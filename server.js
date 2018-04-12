// --- Initialization ---
const express   = require('express'),
    bodyParser = require('body-parser'),
    path      = require('path'),
    app       = express(),
    mongoose = require('mongoose'),
    //cookieSession = require('cookie-session'),
    keys = require('./config/keys'),
    PORT     = process.env.PORT || 5000,
    passport = require('passport'),
    crypto = require('crypto'),
    LocalStrategy = require("passport-local"),
    flash    = require("connect-flash");


app.use(express.static(path.resolve(__dirname, './client/build')));
app.use( bodyParser.json({ extended: true, type: '*/*' }) );
//const jsonParser = bodyParser.json({extended: true, type: '*/*'});

// --- db connection ---
mongoose.connect('mongodb://localhost/calendar');
const User = require('./models/user');
const Event = require('./models/event');

// --- db connection test ---
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongodb connected successfully!');
});

// --- passport configuration ---
app.use(flash());
//passport init,setting password to work on application
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//reading session and take the code from session that's encode and uncode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    //res.locals.success = req.flash('success');
    //res.locals.error = req.flash('error');
    next();
});


// --- CORS set ---
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTION,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
    next();
});


// --- service ---
const {isLoggedIn,checkUserEvent} = require('./middleware.js');

// ---      encryption funtion   ---
function cryptPwd(password) {
    const salt = 'abc';
    const saltPassword = password + ':' + salt;
    const md5 = crypto.createHash('md5');
    return md5.update(saltPassword).digest('hex');
}


// --- Router ---
// ---      Login         ---//
app.post('/login', (req, res ) =>  {
    const user = req.body.username;
    const pass = req.body.password;
    //console.log(user + pass);
    if (user === 'null' || pass === 'null') {
        res.status(200).send({msg:'The input cannot be null', isLogin:false});
    }else{

        //add salt
        const currPass = cryptPwd(req.params.password);
        const currUser =  {
            username: user.toLowerCase(),
            password: currPass
        };
        console.log(currUser);
        User.findOne({
            username:currUser.username,
            password:currUser.password
        }, function (err, data) {
            console.log(data);
            if(err) {
                console.log(err);
            }else if (data){
                console.log(data._id + data.username);
                res.status(200).send({userId: data._id, username: data.username, isLogin:true, msg: "Login success" + data._id + data.username});
            }else{
                res.status(200).send({msg:'Can not find the user', isLogin:false});
            }
        });
    }

});

// ---      register         ---//


app.post('/register', (req, res ) =>  {
    console.log(req.body);
    const user = req.body.username.toLowerCase();
    const pass1 = req.body.password;
    const pass2 = req.body.vpassword;
    //console.log(user + pass1 + pass2);
    if (user === 'null' || pass1 === 'null' || pass2 === 'null') {
        res.status(200).send({msg:'The input is not valid', isRegister:false});
    }else{
        if (pass1 === pass2) {
            const currPass = cryptPwd(req.params.password);
            const currUser =  {
                username: user,
                password: currPass
            };
            User.findOne({
                username:currUser.username
            }, function (err, data) {
                if(err) {
                    console.log(err);
                }
                // if the user has existed
                if (data) {
                    res.status(200).send({msg:'The username has existed',isRegister:false});
                }else{
                    console.log("create user...");
                    User.create(currUser, (err) => {
                        if(err) return console.log(err);
                        res.status(200).send({msg:'Register Success', isRegister:true});
                    })
                }
            });
        }
        else{
            res.status(200).send({msg:'The passwords are not equal',isRegister:false});
        }
    }

});


// --- LogOut --- //

app.get('/logout',(req, res) => {
    req.logout();
});


// ---      oAuth with google         ---//


app.get('/auth/google', passport.authenticate('google',{
    scope:['Profile']
}));




app.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        console.log(req.user);
        res.send(req.user);
        //res.redirect('http://localhost:3000');
    });


/* Get a user's events by year/month*/
app.get('/user/:id/:year/:month',isLoggedIn,function (req,res){
    const year = req.params.year;
    const month = req.params.month;
    let events = {};
    User.findById(req.params.id,function (err, user) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-user-failed'});
        }else{
            for (let eventId of user.events){
                Event.findById(eventId,function (err,event) {
                    if (event !== null){
                        console.log('event Id: '+ eventId);
                        console.log('event object: '+event);
                        console.log('event year： '+ event.startDate.getFullYear() +" event month: "+event.startDate.getMonth());
                        if (event.startDate.getFullYear() === year && event.startDate.getMonth() - 1 === month){
                            events[event._id] = event;
                            console.log(events);
                        }
                    }
                });
            }
            res.status(200).send(
                JSON.stringify({
                    events
                })
            );
        }
    });
});


/* a logged user create event*/
app.post('/user/event',isLoggedIn,function (req,res) {
    User.findById(req.body.id,function (err,user) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-user-id-failed'});
        }else{
            Event.create(req.body.event,function (err, event) {
                if (err){
                    console.log(err);
                    res.status(400).send({'msg':'create-event-failed'});
                }else{
                    //create event and add user
                    event.creator.id = req.user._id;
                    event.creator.username = req.user.username;
                    //save event to db
                    event.save();
                    //add this event to user
                    user.events.push(event);
                    user.save();
                    console.log('success,Created a new event!');
                    //req.flash('success','Created a new event!');
                    res.status(200).send({
                        isCreated :true
                    });
                }
            });
        }
    });
});


/* a logged user edit event*/
app.put('/user/event/:id',isLoggedIn,function (req,res) {
    Event.findById(req.params.id,function (err,event) {
       if (err){
           console.log(err);
           res.status(400).send({'msg':'find-event-failed'});
       }else{
           if (event.creator.username === currentUser.name || event.visibility === 'private'){
               Event.findByIdAndUpdate(req.params.id,req.body.event,function (err, event) {
                   if (err){
                       console.log(err);
                       res.status(400).send({'msg':'update-event-failed'});
                   }else{
                       //event creator remains the same
                       event.creator.id = req.user._id;
                       event.creator.username = req.user.username;
                       //save event to db
                       event.save();
                       console.log('Update event successfully!');
                       //req.flash('success','Update event successfully!');
                       res.status(200).send({
                           isUpdated :true
                       });
                   }
               });
           }else{
               console.log("error,user don't have permission to do that!");
               //req.flash("error", "You don't have permission to do that!");
               res.status(200).send({
                   isUpdated :false
               });
           }
       }
    });
});



/* a logged user delete event*/
app.delete('/user/event/:id',isLoggedIn, function (req,res) {
    Event.findById(req.params.id,function (err,event) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-event-failed'});
        }else{
            if (event.creator.username === currentUser.name || event.visibility === 'private'){
                Event.findByIdAndRemove(req.params.id,function (err) {
                    if (err){
                        console.log(err);
                        res.status(400).send({'msg':'delete-event-failed'});
                    }else{
                        //req.flash('success','delete event successfully!');
                        res.status(200).send({
                            isDeleted :true
                        });
                    }
                });
            }else{
                console.log("error,user don't have permission to do that!");
                //req.flash("error", "You don't have permission to do that!");
                res.status(200).send({
                    isDeleted :false
                });
            }
        }
    });
});




// --- Listener ---
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});