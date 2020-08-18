require('./db.js')
const passport = require('passport')
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");

const hbs = require('hbs');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const parser = require('./parser.js');

const authRouter = require('./api/auth')(passport);
const messageRouter = require('./api/messages');
const vendorRouter = require('./api/vendors');
const storeRouter = require('./api/stores');

const app = express();
const PORT = process.env.PORT || 3000;

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('*', cors());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: true }));

// Sessions & Passport middlerware
app.use(cookieParser("supersecret"));
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    resave: false,
}));

// app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
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


// Routers
app.use('/', authRouter);
app.use('/map', storeRouter);
// app.use('/account', passport.authenticate('jwt', {session: true}), vendorRouter);
app.use('/account', vendorRouter);
app.use('/post', messageRouter);

app.use((req, res, next) => {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.locals.currUser = req.user;
    next();
});

app.get('/about', (req, res) => {
    var loggedIn = req.user ? true : false;
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
        loggedIn: loggedIn,
    });
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// const email = JSON.parse(fs.readFileSync(path.join(__dirname, '/config/mail.config.json')),
// 'email');
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//         user: email,
//         pass: parser.parseData(fs.readFileSync(path.join(__dirname, '/config/mail.config.json')),
//             'password'),
//     }
// });

// var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
// var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;

// const recipients = ['gabriel@captracks.com', 'ben@captracks.com']
// recipients.forEach((to, i, array) => {
//     var msg = {
//         from: email,
//         to: to,
//         subject: "CapTracks Contact Form Mail", 
//         text: textBody,
//         html: htmlBody
//     };
  
//     transporter.sendMail(msg, function (err, info) {
//         if(err) {
//             console.log(err);
//             response.json({ message: "message not sent: an error occured; check the server's console log" });
//         }
//         else {
//             response.json({ message: `message sent: ${info.messageId}` });
//         }
//     });
// });

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

module.exports = app;