require('dotenv').config({ path: __dirname + '/../.env' });
require('./db.js');
// ===== Modules ===== //
const bodyParser = require('body-parser');
// const cors = require('cors');
const express = require('express');
const flash = require('connect-flash');
const fs = require('fs');
const hbs = require('hbs');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// ===== Helper Functions ===== //
const parser = require('./parser.js');
const initPassport = require('./passport/init');
// ===== Routers ===== //
const authRouter = require('./api/auth')(passport);
const storeRouter = require('./api/stores');
const vendorRouter = require('./api/vendors');
const messageRouter = require('./api/messages');
const detailsRouter = require('./api/details');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware ===== //
// Bodyparser - parses JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('*', cors()); //TODO: CHECK IF NEEDED
// Express - server framework
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: true }));

// Sessions & Passport - authentication and keeping user signed-in
app.use(session({
    secret: process.env.SECRET_KEY,
    // key:
    resave: false,
    saveUninitialized: false,
    autoRemove: 'disabled', //TODO: ONLY FOR PRODUCTION
    // touchAfter: 24 * 3600,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    })
}));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

// Flash - error messages
app.use(flash());

// Hbs (Handlebars) - view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
// Hbs Helper Functions 
hbs.registerHelper('ifOdd', val => {
    return val % 2 == 0 ? false : true;
});
hbs.registerHelper('ifEven', val => {
    return val % 2 == 0 ? true : false;
});
hbs.registerHelper('convert', data => {
    const stringify = JSON.stringify(data)
        .split('"_id":')
        .join('"id":');
    return stringify;
});
hbs.registerHelper('eq', (val1, val2) => {
    return val1 === val2;
});
hbs.registerHelper('div', (val1, val2) => {
    return val1 / val2;
});
hbs.registerHelper('concat', (val1, val2) => {
    return val1 + val2;
});
hbs.registerHelper('len', (obj) => {
    return Object.keys(obj).length;
});
// Hbs Partials
hbs.registerPartials(__dirname + '/views/partials', err => { });

// Routers
app.use('/', authRouter);
app.use('/map', storeRouter);
app.use('/account', vendorRouter);
app.use('/post', messageRouter);
app.use('/details', detailsRouter);

app.use((req, res, next) => {
    next();
});

// ==================== WHY USE CAPTRACKS ==================== //
// Load Customer/Vendor benefits data
const benefits = parser.parseData(
    fs.readFileSync(path.join(__dirname, '/content/benefits.json')),
    'benefits'
);
// ========== CUSTOMERS (GET) ========== //
app.get('/customers', (req, res) => {
    res.render('info', {
        layout: 'layout',
        title: 'Customer Benefits',
        data: benefits.slice(0, 3),
        user: req.isAuthenticated(),
    });
});
// ========== VENDORS (GET) ========== //
app.get('/vendors', (req, res) => {
    res.render('info', {
        layout: 'layout',
        title: 'Vendor Benefits',
        data: benefits.slice(3, 6),
        user: req.isAuthenticated(),
    });
});

// ==================== ABOUT US (GET) ==================== //
app.get('/about', (req, res) => {
    // Load team member data
    const members = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/team.json')),
        'team'
    );

    res.render('info', {
        layout: 'layout',
        title: 'About Us',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        data: members,
        user: req.isAuthenticated(),
    });
});

// ==================== TERMS & CONDITIONS (GET) ==================== //
app.get('/terms', (req, res) => {
    res.render('legal', {
        layout: 'layout',
        title: 'Terms & Conditions',
        user: req.isAuthenticated(),
    });
});

// ==================== PRIVACY POLICY(GET) ==================== //
app.get('/privacy', (req, res) => {
    res.render('legal', {
        layout: 'layout',
        title: 'Privacy Policy',
        user: req.isAuthenticated(),
    });
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

module.exports = app;