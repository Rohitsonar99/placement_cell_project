const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth20');
const dotenv = require('dotenv');
dotenv.config();

// Load User Model
const User = require("../models/user");

// local strategy
module.exports = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            // Match User
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: ' That email is not registered' });
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Password incorrect ' });
                        }
                    });
                })
        }

    ))
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id)
            .then(user => { done(null, user); })
            .catch(err => { done(err, null); })
    });

}

// passport.serializeUser((user, done) => {
//     done(null, user);
// });

// // deserializeUser function
// passport.deserializeUser(function(user, cb) {
//    cb(null, user);
// });


