// --- Initialization ---
const express   = require('express'),
    bodyParser = require('body-parser'),
    path      = require('path'),
    app       = express(),
    mongoose = require('mongoose'),
    cookieParser = require("cookie-parser"),
    env = require('./config/env.json'),
    PORT     = env.SERVER_PORT,
    // passport = require('passport'),
    passport = require('./config/passport-setup'),
    session = require("express-session"),
    LocalStrategy = require("passport-local").Strategy,
    flash    = require("connect-flash"),
    deasync = require('deasync');


app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(bodyParser.json({ extended: true, type: '*/*' }) );
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


// --- db connection ---
mongoose.connect(`mongodb://${env.DB_HOST}/calendar`);
const User = require('./models/user');
const Event = require('./models/event');

// --- db connection test ---
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('mongodb connected successfully!');
});


// // --- passport init,setting password to work on application
// passport.use(new LocalStrategy(User.authenticate()));
// //reading session and take the code from session that's encode and uncode it
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// --- passport configuration ---
app.use(session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
// --- passport enable
app.use(passport.initialize());
app.use(passport.session());

// --- use flash
app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// --- Listener ---
app.listen(PORT, () => {
    console.log(`Server listening at http://${env.SERVER_HOST}:${PORT}`);
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
// function cryptPwd(password) {
//     const salt = 'abc';
//     const saltPassword = password + ':' + salt;
//     const md5 = crypto.createHash('md5');
//     return md5.update(saltPassword).digest('hex');
// }


// --- Router ---
// ---      Login         ---//
app.post('/login', passport.authenticate('local'
    // {
    // failureFlash: 'Invalid username or password',
    // successFlash: 'Welcome'}
    ),(req, res) => {
    console.log("auth success? "+ req.user.username);
    const userInfo = req.body;
    const username = userInfo.username;
    const pass = userInfo.password;
    console.log("username && password : " + username +" , "+ pass);
    res.status(200).send({userId: req.user._id, username: req.user.username, isLogin:true, msg: "Login success"});

    // if (username === 'null' || pass === 'null') {
    //     res.status(400).send({msg:'The input cannot be null', isLogin:false});
    // }else {
    //     User.findOne({
    //         username:username,
    //     }, function (err, user) {
    //         console.log(user);
    //         console.log('find user success :' + user._id);
    //         console.log(`current user id ${user._id}, current user name ${user.username}`);
    //         if(err) {
    //             console.log(err);
    //             res.status(200).send({msg:'Can not find the user', isLogin:false});
    //         }else if (user){
    //             console.log(`current user id ${user._id}, current user name ${user.username}`);
    //             res.status(200).send({userId: user._id, username: user.username, isLogin:true, msg: "Login success"});
    //         }
    //     });
    // }
});
// app.post('/login', (req, res ,next) => {
//         const userInfo = req.body.userInfo;
//         const username = userInfo.username;
//         const pass = userInfo.password;
//         console.log("username && password : " + username +" , "+ pass);
//         if (username === 'null' || pass === 'null') {
//             res.status(400).send({msg:'The input cannot be null', isLogin:false});
//         }else {
//             passport.authenticate('local', (err, user, info) => {
//                 if (err) {
//                     console.log(err);
//                     res.status(400).send({msg: 'The user authenticate failed', isLogin: false});
//                 }
//                 console.log('find user success :' + user._id);
//                 if (!user) {
//                     console.log(err);
//                     res.status(400).send({msg: 'The user is not existed', isLogin: false});
//                 }
//                 return req.logIn(user, function (err) {
//                     if (err) {
//                         console.log(err);
//                         res.status(200).send({msg: 'Can not find the user', isLogin: false});
//                     } else {
//                         console.log("login user : " + user._id + " , " + user.username);
//                         res.status(200).send({
//                             userId: user._id,
//                             username: user.username,
//                             isLogin: true,
//                             msg: "Login success"
//                         });
//                     }
//                 });
//             })(req, res, next);
//         }
//     });
// app.post('/login', (req, res ) =>  {
//     const userInfo = req.body.userInfo;
//     const user = userInfo.username;
//     const pass = userInfo.password;
//     //console.log(user + pass);
//     if (user === 'null' || pass === 'null') {
//         res.status(200).send({msg:'The input cannot be null', isLogin:false});
//     }else{
//
//         //add salt
//         const currPass = cryptPwd(req.params.password);
//         const currUser =  {
//             username: user.toLowerCase(),
//             password: currPass
//         };
//         // console.log(currUser);
//         User.findOne({
//             username:currUser.username,
//             password:currUser.password
//         }, function (err, data) {
//             // console.log(data);
//             if(err) {
//                 console.log(err);
//             }else if (data){
//                 console.log("login user : "+ data._id +" , " +data.username);
//                 res.status(200).send({userId: data._id, username: data.username, isLogin:true, msg: "Login success" + data._id + data.username});
//             }else{
//                 res.status(200).send({msg:'Can not find the user', isLogin:false});
//             }
//         });
//     }
//
// });

// ---      register         ---//


app.post('/register', (req, res) =>  {
    const userInfo = req.body;
    const username = userInfo.username;
    const pass1 = userInfo.password;
    const pass2 = userInfo.vpassword;
    console.log("username && password : " + username +" , "+ pass1 +" , "+pass2);
    if (username === 'null' || pass1 === 'null' || pass2 === 'null') {
        res.status(400).send({msg:'The input is not valid', isRegister:false});
    }else{
        if (pass1 === pass2) {
            const newUser = new User({username : username});
            User.register(newUser,pass1,function (err,user) {
                if (err){
                    console.log(err);
                    req.flash("error", err.message);
                    res.status(400).send({msg: 'user-register-failed',user:user});
                }
                passport.authenticate('local',function (err,user,info) {
                    console.log(arguments);
                })(req, res, function () {
                    console.log('into authenticate....');
                    res.status(200).send(JSON.stringify((info)));
                    // req.flash('success','Successfully signed up! Nice to meet you'+username);
                });
            });
            console.log("create user...");
            res.status(200).send({msg: 'Register Success', isRegister: true});
        }else{
            res.status(400).send({msg:'The passwords are not equal',isRegister:false});
        }
    }

});


// --- LogOut --- //

app.get('/logout',(req, res) => {
    req.logout();
    // req.flash("success", "LOGGED YOU OUT!");
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
app.get('/user/:id/:year/:month',isLoggedIn, (req,res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    let sendEvents = [];
    User.findById(req.params.id,function (err, user) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-user-failed'});
        }else{
            let count =0, length = user.events.length;
            for (let eventId of user.events){
                 Event.findById(eventId, (err,event) => {
                     if (err){
                         console.log(err);
                         res.status(400).send({'msg':'find-event-failed'});
                     }else{
                         let obj = {};
                         if (event !== null){
                             if ((year >= parseInt(event.startDate.getFullYear())  &&  year <= parseInt(event.endDate.getFullYear()))
                                 && (month >= parseInt(event.startDate.getMonth()) && month <= parseInt(event.startDate.getMonth()))){
                                 Object.assign(obj, JSON.parse(JSON.stringify(eventId)), JSON.parse(JSON.stringify(event)));
                                 sendEvents.push(event);
                             }
                         }
                     }
                     count++;
                });
            }
            deasync.loopWhile(() => count < length);

            res.status(200).send(
                JSON.stringify({
                    sendEvents
                })
            );
        }
    });
});


/* a logged user create event*/
app.post('/user/event',isLoggedIn, (req,res) => {
    console.log('get userId  '+ req.body.id);
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
                        eventId: event._id,
                        isCreated :true
                    });
                }
            });
        }
    });
});


/* a logged user edit event*/
app.put('/user/event/:id',checkUserEvent,(req,res) => {
    Event.findById(req.params.id,function (err,event) {
       if (err){
           console.log(err);
           res.status(400).send({'msg':'find-event-failed'});
       }else{
           if (event.visibility === 'private'){
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
app.delete('/user/event/:id',checkUserEvent,(req,res) => {
    Event.findById(req.params.id,function (err,event) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-event-failed'});
        }else{
            if (event.visibility === 'private'){
                User.findById(event.creator.id,function (err,user) {
                    if (err){
                        console.log(err);
                    }else{
                        for (let eventId of user.events){
                            const index = user.events.indexOf(eventId);
                            user.events.splice(index,1);
                            user.save();
                        }
                    }
                });
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


