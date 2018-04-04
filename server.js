// --- Initialization ---
const express   = require('express');
const bodyParser = require('body-parser');
const path      = require('path');
const app       = express();
const mongoose = require('mongoose');
const PORT     = process.env.PORT || 5000;
const passport = require('passport');
const flash    = require("connect-flash");


app.use(express.static(path.resolve(__dirname, './client/build')));
const jsonParser = bodyParser.json({extended: true, type: '*/*'});

// --- db connection ---
mongoose.connect('mongodb://localhost/calendar');
const User = require('./models/user');
const Event = require('./models/event');

// --- db connection test ---
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected successfully!');
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
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
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

// --- Router ---

/* Get a user's events by year/month*/
app.get('/user/:id/year/month',isLoggedIn,function (req,res){
    const year = req.params.year;
    const month = req.params.month;
    let events = {};
    User.findById(req.params.id,function (err, user) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-user-failed'});
        }else{
            for (let event of user.events){
                if (event.startDate.getYear() === year && event.startDate.getMonth() === month - 1){
                    events[event._id] = event;
                }
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
                    req.flash('success','Created a new event!');
                    res.status(200).send({
                        isCreated :true
                    });
                }
            });
        }
    });
});


/* a logged user edit event*/
app.put('/user/event',isLoggedIn,function (req,res) {
    Event.findById(req.body.event._id,function (err,event) {
       if (err){
           console.log(err);
           res.status(400).send({'msg':'find-event-failed'});
       }else{
           if (event.visibility === 'private'){
               Event.findByIdAndUpdate(req.body.event._id,req.body.event,function (err, event) {
                   if (err){
                       console.log(err);
                       res.status(400).send({'msg':'update-event-failed'});
                   }else{
                       //event creator remains the same
                       event.creator.id = req.user._id;
                       event.creator.username = req.user.username;
                       //save event to db
                       event.save();
                       req.flash('success','Update event successfully!');
                       res.status(200).send({
                           isUpdated :true
                       });
                   }
               });
           }else{
               req.flash("error", "You don't have permission to do that!");
               res.status(200).send({
                   isUpdated :false
               });
           }
       }
    });
});



/* a logged user delete event*/
app.delete('/user/event',isLoggedIn, function (req,res) {
    Event.findById(req.body.event._id,function (err,event) {
        if (err){
            console.log(err);
            res.status(400).send({'msg':'find-event-failed'});
        }else{
            if (event.visibility === 'private'){
                Event.findByIdAndRemove(req.body.event._id,function (err) {
                    if (err){
                        console.log(err);
                        res.status(400).send({'msg':'delete-event-failed'});
                    }else{
                        req.flash('success','delete event successfully!');
                        res.status(200).send({
                            isDeleted :true
                        });
                    }
                });
            }else{
                req.flash("error", "You don't have permission to do that!");
                res.status(200).send({
                    isUpdated :false
                });
            }
        }
    });
});




// --- Listener ---
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});