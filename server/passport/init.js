// ===== Models ===== //
const Vendor = require('../models/vendor.model');

// ===== Helper Functions ===== //
const login = require('./controller').login;
const signup = require('./controller').signup;

// User serialize and deserialize for persistent login sessions
module.exports = function(passport) {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        Vendor.findById(id, (err, vendor) => {
            if (err) {
                done(err, false);
            }
            else {
                done(null, vendor);
            }
        });
    });

    // Set up Passport strategies for Login and Signup
    login(passport);
    signup(passport);
};