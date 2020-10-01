// ===== Modules ===== //
const bodyParser = require('body-parser');
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
module.exports = function(app, express) {
    // Bodyparser - parses JSON
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Express - server framework
    app.use(express.static(path.join(__dirname, '../../client')));
    app.use(express.urlencoded({ extended: true }));
    app.use('*', cors());

    // Sessions & Passport - authentication and keeping user signed-in
    app.use(
        session({
            secret: process.env.SECRET_KEY,
            cookie: { secure: true },
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection,
                touchAfter: 72 * 3600,  // 72 hour period
                autoRemove: 'interval', //PROD: 'disabled'
            }),
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
    initPassport(passport);

    // Flash - error messages
    app.use(flash());
};