const login = require('./controller').login;
const signup = require('./controller').signup;
const Vendor = require('../models/vendor.model');


module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser((user, done) => {
        console.log("serialize user: ", user);
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        Vendor.findById(id, (err, vendor) => {
            if (err) {
                done(err, false);
            }
            else {
                console.log("deserialize user: ", vendor);
                done(null, vendor);
            }
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
};