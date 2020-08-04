var login = require('./controller').login;
var signup = require('./controller').signup;
const Vendor = require('../models/vendor.model');


module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser((vendor, done) => {
        console.log('serializing vendor: ');console.log(vendor);
        done(null, vendor._id);
    });

    passport.deserializeUser((id, done) => {
        Vendor.findById(id, (err, vendor) => {
            console.log('deserializing vendor:',vendor);
            done(err, vendor);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}