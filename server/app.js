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

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
hbs.registerHelper('ifOdd', (val) => {
    return val % 2 == 0 ? false : true;
});
hbs.registerHelper('ifEven', (val) => {
    return val % 2 == 0 ? true : false;
});
hbs.registerHelper('convert', (data) => {
    var stringify = JSON.stringify(data).split('"_id":').join('"id":');
    return stringify;
});

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Routers
app.use('/map', storeRouter);
// app.use('/map/store', detailsRouter);
// app.use('/map/:id/forum', messageRouter);
app.use('/account', managerRouter);

app.use((req, res, next) => {
    next();
});

app.get('/', (req, res) => {
    // Load functionality box data
    const boxes = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/functionality.json')),
        'functionality'
    );

    res.render('home', { layout: 'layout', title: 'Home', intro: true, functionality: boxes });
});

app.get('/about', (req, res) => {
    // Load team member data
    const members = parser.parseData(
        fs.readFileSync(path.join(__dirname, '/content/team.json')),
        'team'
    );

    res.render('about', {
        layout: 'layout',
        title: 'About',
        helpers: { ifOdd: 'ifOdd', ifEven: 'ifEven' },
        members: members,
    });
});

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
