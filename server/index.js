require('./db.js');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const parser = require('./parser.js');

const messageRouter = require('./api/messages');
const detailsRouter = require('./api/details');
const managerRouter = require('./api/managers');
const storeRouter = require('./api/stores');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerHelper('ifOdd', function(val) {
    return val % 2 == 0 ? false : true;
});
hbs.registerHelper('ifEven', function(val) {
    return val % 2 == 0 ? true : false;
});

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Routers
app.use('./api/messages', messageRouter);
app.use('./api/details', detailsRouter);
app.use('./api/managers', managerRouter);
app.use('./api/stores', storeRouter);

app.use((req, res, next) => {
    next();
});

app.get('/', (req, res) => {
    // Load functionality box data
    let boxes = parser.parseData(
        fs.readFileSync(path.join(__dirname, 'content/functionality.json')),
        'functionality'
    );

    res.render('home', { layout: 'layout', intro: true, functionality: boxes });
});

app.get('/about', (req, res) => {
    // Load team member data
    let members = parser.parseData(
        fs.readFileSync(path.join(__dirname, 'content/team.json')),
        'team'
    );

    res.render('about', {
        layout: 'layout',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        members: members,
    });
});

app.get('/map', (req, res) => {
    res.render('map', { layout: 'layout' });
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
