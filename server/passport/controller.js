// ===== Modules ===== //
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const QRCode = require('qrcode'); //Added for QR generartion
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

//Entry QR code fuction starts
const generateEntryQRCode = async (id) => {
	try {
		return await QRCode.toDataURL(process.env.ENTRY_QR_URL + id);
	} catch (err) {
		console.error('Error while generating Entry QR code: ', err);
	}
};
//Entry QR code fuction ends

//Exit QR code fuction starts
const generateExitQRCode = async (id) => {
	try {
		return await QRCode.toDataURL(process.env.EXIT_QR_URL + id);
	} catch (err) {
		console.error('Error while generating Exit QR code: ', err);
	}
};
//Exit QR code fuction ends

// Passport local login
function login(passport) {
	passport.use(
		'login',
		new LocalStrategy(
			{
				usernameField: 'email', // Override username field
				passwordField: 'password', // Override password field
				passReqToCallback: true, // Make req accessible after login
			},
			(req, email, password, done) => {
				// Check if Vendor exists with input email
				Vendor.findOne({ email: email }, (err, vendor) => {
					// Handle Error
					if (err) {
						console.log('Error in Login: ' + err);
						return done(err);
					}
					// Vendor does NOT exist --> send error message
					if (!vendor) {
						console.log('Vendor Not Found');
						return done(
							null,
							false,
							req.flash('error', process.env.WRONG_EMAIL)
						);
					}
					// Vendor DOES exist BUT wrong password --> send error message
					if (!isValidPassword(vendor, password)) {
						console.log('Invalid Password');
						return done(
							null,
							false,
							req.flash('error', process.env.WRONG_PASSWORD)
						);
					}
					// Vendor and password match --> return Vendor from done method
					return done(null, vendor);
				});
			}
		)
	);
}

// Passport local signup
function signup(passport) {
	passport.use(
		'signup',
		new LocalStrategy(
			{
				usernameField: 'email', // Override username field
				passwordField: 'password', // Override password field
				passReqToCallback: true, // Make req accessible after signup
			},
			(req, email, password, done) => {
				const findOrCreateVendor = () => {
					// Check if email already exists in DB
					Vendor.findOne({ email: email }, (err, vendor) => {
						// Handle Error
						if (err) {
							console.log('Error in Sign Up: ' + err);
							return done(err);
						}
						// Vendor already exists with that email --> send error message
						if (vendor) {
							console.log('Vendor Already Exists');
							return done(
								null,
								false,
								req.flash('error', process.env.VENDOR_EXISTS)
							);
						}
						// Otherwise signup Vendor
						else {
							// New Vendor Object
							let newVendor = new Vendor({
								partition: process.env.DB_PARTITION,
								firstName: req.body.firstName,
								lastName: req.body.lastName,
								password: createHash(password),
								phone: req.body.phone,
								email: email,
								entryqrcode: '',
								exitqrcode: '',
							});

							//Added For Generate the QR Code
							let entrycode = generateEntryQRCode(
								newVendor._id
							).then(function (entryresult) {
								newVendor.entryqrcode = entryresult;
								let exitcode = generateExitQRCode(
									newVendor._id
								).then(function (exitresult) {
									newVendor.exitqrcode = exitresult;
									// Save Vendor to DB
									newVendor.save((err) => {
										// Handle Error
										if (err) {
											console.log('Save Error:' + err);
											return done(err);
										}

										return done(null, newVendor);
									});
								});
							});
						}
					});
				};
				// Delay execution of findOrCreateVendor until next tick of event loop
				process.nextTick(findOrCreateVendor);
			}
		)
	);
}

module.exports = {
	createHash: createHash,
	isValidPassword: isValidPassword,
	login: login,
	signup: signup,
};
