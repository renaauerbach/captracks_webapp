// ===== Modules ===== //
const cors = require('cors');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// ===== Helper Functions ===== //
const initPassport = require('../passport/init');

// ===== Middleware ===== //
module.exports = function (app, express) {
	// Express - server framework
	app.use(express.static(path.join(__dirname, '../../public')));
	app.use(express.urlencoded({ extended: true }));
	app.use('*', cors());

	// Bodyparser - parses JSON
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	// Sessions & Passport - authentication and keeping user signed-in
	app.use(
		session({
			secret: process.env.SECRET_KEY,
			// cookie: { secure: true } // hides req info
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({
				mongooseConnection: mongoose.connection,
				touchAfter: 72 * 3600, // 72 hour period
				autoRemove: 'interval', // PROD: 'disabled'
			}),
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());
	initPassport(passport);

	// Flash - error messages
	app.use(flash());
};
