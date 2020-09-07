// ===== Modules ===== //
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
// ===== Models ===== //
const Vendor = require('../models/vendor.model');

// ===== Helper Functions ===== //
// Generate password hash using bcrypt
const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Checks for valid password
const isValidPassword = (vendor, password) => {
	return bcrypt.compareSync(password, vendor.password);
};

// Passport local login
function login(passport) {
	passport.use('login', new LocalStrategy({
		usernameField: 'email',			// Override username field
		passwordField: 'password',		// Override password field
		passReqToCallback: true			// Make req accessible after login
	}, (req, email, password, done) => {
		// Check if Vendor exists with input email 
		Vendor.findOne({ 'email': email }, (err, vendor) => {
			// Handle Error
			if (err) {
				console.log('Error in Login: ' + err);
				return done(err);
			}
			// Vendor does NOT exist --> send error message
			if (!vendor) {
				console.log('Vendor Not Found');
				let link = '/join';
				return done(null, false, req.flash('error', process.env.WRONG_EMAIL));
			}
			// Vendor DOES exist BUT wrong password --> send error message
			if (!isValidPassword(vendor, password)) {
				console.log('Invalid Password');
				let link = '/forgot';
				return done(null, false, req.flash('error', process.env.WRONG_PASSWORD));
			}
			// Vendor and password match --> return Vendor from done method
			return done(null, vendor);
		});
	}));
}

// Passport local signup
function signup(passport) {
	passport.use('signup', new LocalStrategy({
		usernameField: 'email',			// Override username field
		passwordField: 'password',		// Override password field
		passReqToCallback: true			// Make req accessible after signup
	}, (req, email, password, done) => {
		const findOrCreateVendor = () => {
			// Check if email already exists in DB
			Vendor.findOne({ 'email': email }, (err, vendor) => {
				// Handle Error
				if (err) {
					console.log('Error in Sign Up: ' + err);
					return done(err);
				}
				// Vendor already exists with that email --> send error message
				if (vendor) {
					console.log('Vendor Already Exists');
					return done(null, false, req.flash('error', process.env.VENDOR_EXISTS));
				}
				// Otherwise signup Vendor 
				else {
					// New Vendor Object
					const newVendor = new Vendor({
						partition: process.env.DB_PARTITION,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						password: createHash(password),
						phone: req.body.phone,
						email: email,
					});

					// Save Vendor to DB
					newVendor.save((err) => {
						// Handle Error
						if (err) {
							return done(err);
						}
						return done(null, newVendor);
					});
				}
			});
		};
		// Delay execution of findOrCreateVendor until next tick of event loop
		process.nextTick(findOrCreateVendor);
	}));
}

module.exports = {
	createHash: createHash,
	isValidPassword: isValidPassword,
	login: login,
	signup: signup,
};

