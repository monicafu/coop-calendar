// --- Initialization ---
const express   = require('express'),
    bodyParser = require('body-parser'),
    path      = require('path'),
    app       = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    env = require('./config/env.json'),
    PORT     = env.SERVER_PORT,
    passport = require('passport'),
    crypto = require('crypto'),
    session = require('express-session'),
    LocalStrategy = require("passport-local"),
    deasync = require('deasync'),
    MongoStore = require('connect-mongo')(session);
    //RedisStore = require('connect-redis')(session);

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use( bodyParser.json({ extended: true, type: '*/*' }) );
app.use(cookieParser());
//const jsonParser = bodyParser.json({extended: true, type: '*/*'});

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

// --- passport configuration ---
// app.use(flash());
//passport init,setting password to work on application
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//reading session and take the code from session that's encode and uncode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//session

app.use(session({
    name: 'mysession',
    secret: 'password',  // 用来对session id相关的cookie进行签名
    store: new MongoStore({ mongooseConnection: mongoose.connection }),// 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 3600 * 1000,  // 有效期，单位是毫秒
        secure:false,  
    }
}));


// --- CORS set ---
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'OPTION,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
});


// --- service ---
const {isLoggedIn,checkUserEvent} = require('./middleware');

// ---      encryption function   ---
function cryptPwd(password) {
    const salt = env.salt;
    const saltPassword = password + ':' + salt;
    const md5 = crypto.createHash('md5');
    return md5.update(saltPassword).digest('hex');
}




// --- Router ---
// ---      Login         ---//
app.post('/login', (req, res ) =>  {
	const userInfo = req.body
    console.log(userInfo.username);
    const user = userInfo.username;
    const pass = userInfo.password;

    if (user === 'null' || pass === 'null') {
        res.status(400).send({msg:'The input cannot be null', isLogin:false});
    }else{
        //add salt
        const currPass = cryptPwd(pass);
        const currUser =  {
            username: user.toLowerCase(),
            password: currPass
        };
        //console.log(currUser);
        User.findOne({
            username:currUser.username,
            password:currUser.password
        }, function (err, data) {
            if(err){
                console.log(err);   
                res.status(400).send({isLogin:false, msg: "username or password is not correct"});           
            }else{
                if (data) {
                   req.session.loginUser = {
                        username: data.username,
                        id: data._id
                    };
                    // req.session.cookie.user = {
                    //     userId: data._id,
                    //     username: data.username,
                    // };
                    res.cookie('user', {
                        userId: data._id,
                        username: data.username,
                    })
                res.status(200).send({userId: data._id, username: data.username, isLogin:true, msg: "Login success" + data._id + data.username});      
                }   
            }                        
        });
    }
});

// ---      register         ---//


app.post('/register', (req, res ) =>  {
    // console.log(req.body);
    const userInfo = req.body
    const user = userInfo.username.toLowerCase();
    const pass1 = userInfo.password;
    const pass2 = userInfo.vpassword;

    if (user === 'null' || pass1 === 'null' || pass2 === 'null') {
        res.status(400).send({msg:'The input is not valid', isRegister:false});
    }else{
        if (pass1 === pass2) {
            const currPass = cryptPwd(pass1);
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
                    res.status(400).send({msg:'The username has existed',isRegister:false});
                }else{
                    console.log("create user...");
                    User.create(currUser, (err) => {
                        if(err) return console.log(err);
                        res.status(200).send({msg:'Register Success', isRegister:true});
                    });
                }
            });
        }
        else{
            res.status(400).send({msg:'The passwords are not equal',isRegister:false});
        }
    }

});


// --- LogOut --- //

app.get('/logout',(req, res) => {
    // currentUser.id = "";
    // currentUser.name ="";
    req.logout();
});


// ---      oAuth with google         ---//


app.get('/auth/google', passport.authenticate('google',{
    scope:['Profile']
}));




app.get('/auth/google/redirect',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // console.log(req.user);
        res.send(req.user);
        //res.redirect('http://localhost:3000');
    });


/* Get a user's events by year/month*/
app.get('/user/:id/:year/:month',(req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    let sendEvents = [];
    let count = 0, length = 0; 
    Event.find({visibility:'public'},(err,event)=>{
        if (err) {
            console.log(err);
        }else{
            sendEvents.push(event);
            // console.log('public event: '+sendEvents);
            length += sendEvents.length;
            count = length;
        }
    });
    User.findById(req.params.id,(err, user) => {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-user-failed'});
        }else{
            length += user.events.length;
            for (let eventId of user.events){
                 Event.findById(eventId, (err,event) => {
                     if (err){
                         console.log(err);
                         res.status(400).send({'msg':'find-event-failed'});
                     }else{
                         let obj = {};
                         if (event !== null && event.visibility === 'private'){
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
            // console.log('==================');
            // console.log('all event: '+sendEvents);
            res.status(200).send(
                JSON.stringify({
                    sendEvents
                })
            );
        }
    });
});

/* a logged user create event*/
app.post('/user/event',isLoggedIn,function (req,res) {
    const event = req.body.event;
    if ( event == null || event.title == null || event.endDate < event.startDate){
        res.status(400).send({isCreated :false,'msg':'create-event-is-not-valid'});
    }else{
        User.findById(req.session.loginUser.id,function (err,user) {
            if (err){
                console.log(err);
                res.status(400).send({isCreated :false,'msg':'find-user-id-failed'});
            }else{
                Event.create(req.body.event,function (err, event) {
                    if (err){
                        console.log(err);
                        res.status(400).send({isCreated :false,'msg':'create-event-failed'});
                    }else{
                        //create event and add user
                        event.creator.id = req.session.loginUser.id;
                        event.creator.username = req.session.loginUser.username;
                        //save event to db
                        event.save();
                        //add this event to user
                        user.events.push(event);
                        user.save();
                        console.log('success,Created a new event!');
                        res.status(200).send({
                            eventId: event._id,
                            isCreated :true
                        });
                    }
                });
            }
        });
    }  
});


/* a logged user edit event*/
app.put('/user/event/:id',checkUserEvent,function (req,res) {
    const event = req.body.event;
    if(event == null || event.title == null || event.endDate < event.startDate){
        res.status(400).send({isUpdated :false,'msg':'update-event-is-not-valid'});
    }else{
        Event.findById(req.params.id,function (err,event) {
           if (err){
               console.log(err);
               res.status(400).send({isUpdated :false,'msg':'find-event-failed'});
           }else{
               if (event.creator.username === req.session.loginUser.username|| event.visibility === 'private'){
                   Event.findByIdAndUpdate(req.params.id, req.body.event, function (err, event) {
                       if (err){
                           console.log(err);
                           res.status(400).send({isUpdated :false,'msg':'update-event-failed'});
                       }else{
                           //event creator remains the same
                           event.creator.id = req.session.loginUser.id;
                           event.creator.username = req.session.loginUser.username;
                           //save event to db
                           event.save();
                           console.log('Update event successfully!');
                           res.status(200).send({
                               isUpdated :true
                           });
                       }
                   });
               }else{
                   console.log("error,user don't have permission to do that!");
                   res.status(200).send({
                       isUpdated :false
                   });
               }
           }
        });
    }
    
});



/* a logged user delete event*/
app.delete('/user/event/:id',checkUserEvent, function (req,res) {
    Event.findById(req.params.id,function (err,event) {
        if (err){
            console.log(err);
            res.status(400).send({isDeleted :false,'msg':'find-event-failed'});
        }else{
            if (event.creator.username === req.session.loginUser.username || event.visibility === 'private'){
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
                        res.status(400).send({isDeleted :false,'msg':'delete-event-failed'});
                    }else{
                        console.log('delete a event successfully!');
                        res.status(200).send({
                            isDeleted :true
                        });
                    }
                });
            }else{
                console.log("error,user don't have permission to do that!");
                res.status(200).send({
                    isDeleted :false
                });
            }
        }
    });
});




// --- Listener ---
app.listen(PORT, () => {
    console.log(`Server listening at http://${env.SERVER_HOST}:${PORT}`);
});