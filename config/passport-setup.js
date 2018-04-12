const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//require('passport-google-oauth20')

const keys = require('./keys');
const User = require('../models/user');//require model


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user.id);
    });

});


passport.use(

    new GoogleStrategy({
            callbackURL: 'http://localhost:8000/auth/google/redirect',
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret
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
