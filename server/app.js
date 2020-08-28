require('./db.js');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const hbs = require('hbs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const parser = require('./parser.js');

const authRouter = require('./api/auth')(passport);
const storeRouter = require('./api/stores');
const vendorRouter = require('./api/vendors');
const messageRouter = require('./api/messages');
const detailsRouter = require('./api/details');

const app = express();
const PORT = process.env.PORT || 3000;

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('*', cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: true }));

// Sessions & Passport middlerware
app.use(session({
    secret: 'supersecret',
    // key:
    resave: false,
    saveUninitialized: false,
    autoRemove: 'disabled', //FOR PRODUCTION
    cookie: {},
    // touchAfter: 24 * 3600,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    })
}));

// app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
const flash = require('connect-flash');
app.use(flash());

// Initialize Passport
const initPassport = require('./passport/init');
initPassport(passport);

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');

// Handlebars helpers & partials
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
hbs.registerHelper('concat', (val1, val2) => {
    return val1 + val2;
});
hbs.registerHelper('len', (obj) => {
    return Object.keys(obj).length;
});
hbs.registerPartials(__dirname + '/views/partials', err => { });

// Routers
app.use('/', authRouter);
app.use('/map', storeRouter);
app.use('/account', vendorRouter);
app.use('/post', messageRouter);
app.use('/details', detailsRouter);

app.use((req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        res.locals.user = req.session.passport.user;
    }
    next();
});

app.get('/about', (req, res) => {
    // Load team member data
    const members = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/team.json')),
        'team'
    );

    res.render('about', {
        layout: 'layout',
        title: 'About Us',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        members: members,
        user: req.user,
    });
});

app.get('/info', (req, res) => {
    // Load functionality box data
    const boxes = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/functionality.json')),
        'functionality'
    );

    // Load vendor info data
    const info = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/info.json')),
        'info'
    );

    res.render('info', {
        layout: 'layout',
        title: 'How It Works',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        functionality: boxes,
        info: info,
        user: req.user,
    });
});

app.get('/terms', (req, res) => {
    res.render('terms', {
        layout: 'layout',
        title: 'Terms & Conditions',
        user: req.user,
    });
});

app.get('/privacy', (req, res) => {
    res.render('privacy', {
        layout: 'layout',
        title: 'Privacy Policy',
        user: req.user,
    });
});


app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

module.exports = app;