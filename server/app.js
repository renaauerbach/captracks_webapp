require('./db.js')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');


const hbs = require('hbs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const parser = require('./parser.js');

const authRouter = require('./api/auth/auth');
const messageRouter = require('./api/messages');
const vendorRouter = require('./api/vendors');
const storeRouter = require('./api/stores');

const app = express();
const PORT = process.env.PORT || 3000;

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
    var stringify = JSON.stringify(data)
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
hbs.registerPartials(__dirname + '/views/partials', err => {});

// Bodyparser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use('*', cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("supersecret"));
app.use(session({cookie: {maxAge: 60000 }}));

app.use(passport.initialize(path.join(__dirname, '../middleware/passport')));
app.use(passport.session());

// Routers
app.use('/', authRouter);
app.use('/map', storeRouter);
app.use('/account', passport.authenticate('jwt', {session: false}), vendorRouter);
app.use('/post', messageRouter);

app.use((req, res, next) => {
    next();
});

app.get('/about', (req, res) => {
    // Load functionality box data
    const boxes = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/functionality.json')),
        'functionality'
    );

    // Load team member data
    const members = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/team.json')),
        'team'
    );

    res.render('about', {
        layout: 'layout',
        title: 'About',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        functionality: boxes,
        members: members,
    });
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
