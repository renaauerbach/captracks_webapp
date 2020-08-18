var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
const Vendor = require('../models/vendor.model'); 

const path = require('path');
const fs = require('fs');
const partition = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../config/db.config.json'))
).partition;

function login(passport) {
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true
	}, (req, email, password, done) => { 
			// check in mongo if a Vendor with vendor name exists or not
			Vendor.findOne({ 'email' : email }, (err, vendor) => {
				// In case of any error, return using the done method
				if (err)
					return done(err);
				// vendor name does not exist, log the error and redirect back
				if (!vendor){
					console.log('Vendor Not Found.');
					return done(null, false, req.flash('message', "We don't recognize that email. Want to <a href='/join'>create an account</a>?"));                 
				}
				// Vendor exists but wrong password, log the error 
				if (!isValidPassword(vendor, password)) {
					console.log('Invalid Password');
					return done(null, false, req.flash('message', 'Invalid password. Please try again or <a href="/forgot">reset your password</a>.')); // redirect back to login page
				}
				// Vendor and password both match, return Vendor from done method
				// which will be treated like success
				return done(null, vendor);
			});
		})
	);
	var isValidPassword = (vendor, password) => {
		return bcrypt.compareSync(password, vendor.password);
	}
};

function signup(passport) {
	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	}, (req, email, password, done) => {
		findOrCreateVendor = () => {
			// find a Vendor in Mongo with provided Vendor name
			Vendor.findOne({ 'email' : email }, (err, vendor) => {
				// In case of any error, return using the done method
				if (err){
					console.log('Error in SignUp: ' + err);
					return done(err);
				}
				// already exists
				if (vendor) {
					console.log('Vendor already exists with vendor name: ' + email);
					return done(null, false, req.flash('message','Vendor Already Exists'));
				} else {
					// if there is no vendor with that email
					// create the Vendor
					newVendor = new Vendor({
						partition: partition,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						password: createHash(password),
						phone: req.body.phone,
						email: email,
					});

					// save the vendor
					newVendor.save((err) => {
						if (err) {
							console.log('Error in Saving Vendor: ' + err);  
							throw err;  
						}
						console.log('Vendor registered succesfully');    
						return done(null, newVendor);
					});
				}
			});
		};
		// Delay the execution of findOrCreateVendor and execute the method
		// in the next tick of the event loop
		process.nextTick(findOrCreateVendor);
	}))
	// Generates hash using bcrypt
	var createHash = (password) => {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
	};
};

module.exports = {
	login: login,
	signup: signup,
}

