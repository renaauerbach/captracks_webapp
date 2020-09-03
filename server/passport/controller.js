// ===== Modules ===== //
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
// ===== Models ===== //
const Vendor = require('../models/vendor.model');

// Generate password hash using bcrypt
const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Checks for valid password
const isValidPassword = (vendor, password) => {
	return bcrypt.compareSync(password, vendor.password);
};

function login(passport) {
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		// Check if a Vendor with input email exists
		Vendor.findOne({ 'email': email }, (err, vendor) => {
			if (err) {
				console.log('Error in Login: ' + err);
				return done(err);
			}
			// Vendor does NOT already exist --> log error and redirect back
			if (!vendor) {
				console.log('Vendor Not Found');
				return done(null, false, req.flash('message', "We don't recognize that email. Want to <a href='/join'>create an account</a>?"));
			}
			// Vendor DOES exist BUT wrong password --> log the error 
			if (!isValidPassword(vendor, password)) {
				console.log('Invalid Password');
				return done(null, false, req.flash('message', "Wrong password. Please try again or <a href='/forgot'>reset your password</a>."));
			}
			// Vendor and password match --> return Vendor from done method
			return done(null, vendor);
		});
	}));
}

function signup(passport) {
	passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		const findOrCreateVendor = () => {
			// find a Vendor in Mongo with provided Vendor name
			Vendor.findOne({ 'email': email }, (err, vendor) => {
				// In case of any error, return using the done method
				if (err) {
					console.log('Error in Sign Up: ' + err);
					return done(err);
				}
				// already exists
				if (vendor) {
					console.log('Vendor Already Exists');
					return done(null, false, req.flash('message', 'An account with that email already exists. Please try again.'));
				} else {
					// if there is no vendor with that email
					// create the Vendor
					const newVendor = new Vendor({
						partition: process.env.DB_PARTITION,
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
	}));
}

module.exports = {
	createHash: createHash,
	isValidPassword: isValidPassword,
	login: login,
	signup: signup,
};

