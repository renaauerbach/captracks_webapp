// ===== Modules ===== //
const fs = require('fs');
const nodemailer = require('nodemailer');
const passport = require('passport');
const path = require('path');

// ===== Helper Functions ===== //
const parser = require('./parser.js');

// ===== Global Variables ===== //
// Email Contents
global.emails = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../content/emails.json'))
)['emails'];
// Nodemailer Transporter
global.smtpTransport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
    },
});

// ===== Routers ===== //
const authRouter = require('../api/auth')(passport);
const storeRouter = require('../api/stores');
const vendorRouter = require('../api/vendors');
const messageRouter = require('../api/messages');
const detailsRouter = require('../api/details');

module.exports = function(app) {
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
        fs.readFileSync(path.join(__dirname, '../content/benefits.json')),
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
            fs.readFileSync(path.join(__dirname, '../content/team.json')),
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

    // ==================== PRIVACY POLICY (GET) ==================== //
    app.get('/privacy', (req, res) => {
        res.render('legal', {
            layout: 'layout',
            title: 'Privacy Policy',
            user: req.isAuthenticated(),
        });
    });

    // ==================== FOOTER - CONTACT FORM (POST) ==================== //
    // Confirmation email to Vendor
    app.post('/contact', (req, res, next) => {
        const mailOptions = {
            // to: 'info@captracks.com',
            to: 'rena@captracks.com',
            from: 'noreply@captracks.com',
            subject: req.body.subject,
            text:
                req.body.name +
                global.emails[4].text[0] +
                req.body.message +
                global.emails[4].text[1] +
                req.body.email,
        };
        global.smtpTransport.sendMail(mailOptions, err => {
            // Handle Error
            if (err) {
                return next(err);
            }
            next();
        });
    });

    // ==================== ERROR (GET) ==================== //
    app.get('/error', (req, res) => {
        res.render('error', {
            layout: 'layout',
            title: 'Error',
            user: req.isAuthenticated(),
        });
    })

};