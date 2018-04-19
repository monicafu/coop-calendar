const passport = require('passport'),
      LocalStrategy = require("passport-local").Strategy;

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//require('passport-google-oauth20')

const env = require('./env.json');
const User = require('../models/user');//require model


// --- passport init,setting password to work on application
passport.use(new LocalStrategy(User.authenticate()));
//reading session and take the code from session that's encode and uncode it
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// module.exports = (app) => {
//     passport.use(new LocalStrategy(User.authenticate()));
//     passport.serializeUser(User.serializeUser());
//     passport.deserializeUser(User.deserializeUser());
//     //use express session
//     app.use(require('express-session')({
//         secret: env.sessionSecret,
//         resave: false,
//         saveUninitialized: false
//     }));
//
//     //init passport
//     app.use(passport.initialize());
//     //use session verify
//     app.use(passport.session());
//     // return passport;
// };


passport.use(new LocalStrategy(
    {
        usernameField: 'username',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'password'
    },function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

// passport.serializeUser(function(user, done) {
//     done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });


passport.use(
    new GoogleStrategy({
            callbackURL: 'http://localhost:8000/auth/google/redirect',
            clientID: env.google.clientID,
            clientSecret: env.google.clientSecret
        }, function(accessToken, refreshToken, profile, done) {
            User.findOne({password: profile.id}).then(currentUser =>{
                if (currentUser) {
                    console.log('the user has already existed' + currentUser.userId + currentUser.username);
                    done(null, currentUser);
                }else{
                    new User({
                        username: profile.displayName,
                        password: profile.id
                    }).save().then((newUser) => {
                        console.log('new User created' + newUser);
                        done(null, newUser);
                    });
                }
            });
        }
    ));




/*
(accessToken, refreshToken, profile, done )=>{

		User.findOne({password: profile.id}).then(currentUser =>{
			if (currentUser) {
				console.log('the user has already existed' + currentUser.username);
				done(null, currentUser);
			}else{
				new User({
					username: profile.displayName,
					password: profile.id
				}).save().then((newUser) => {
					console.log('new User created' + newUser);
					done(null, newUser);
				});
			}
		});

	}
*/
module.exports = passport;