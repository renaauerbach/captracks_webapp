// ===== Modules ===== //
const async = require('async');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const sgMail = require('@sendgrid/mail');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Details = require('../models/details.model');
const Store = require('../models/store.model');
const Vendor = require('../models/vendor.model');

// ===== Helper Functions & Data ===== //
const createHash = require('../passport/controller').createHash;
// Email content
const emails = JSON.parse(fs.readFileSync(path.join(__dirname, '../content/emails.json')));
// Nodemailer Transporter
const smtpTransport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
    },
});

module.exports = function(passport) {
    // ==================== LOGIN (GET) ==================== //
    router.get('/login', (req, res) => {
        res.render('login', {
            layout: 'layout',
            title: 'Login',
            error: req.flash('error'),
            message: req.flash('message'),
        });

        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // const msg = {
        //     to: 'test@example.com',
        //     from: 'noreplay@captracks.com',
        //     subject: 'Sending with Twilio SendGrid is Fun',
        //     text: 'and easy to do anywhere, even with Node.js',
        //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // };
        // sgMail.send(msg);
    });
    // ==================== LOGIN (POST) ==================== //
    router.post('/login',
        passport.authenticate('login', { failureRedirect: '/login' }),
        (req, res) => {
            // TODO: CHECK IF NEEDED
            res.cookie('firstName', req.user.firstName);
            res.cookie('userId', req.user.id);
            return res.redirect('/account');
        }
    );

    // ==================== FORGOT (GET) ==================== //
    router.get('/forgot', (req, res) => {
        res.render('forgot', {
            layout: 'layout',
            title: 'Forgot Password',
            error: req.flash('error'),
            message: req.flash('message'),
        });
    });
    // ==================== FORGOT (POST) ==================== //
    router.post('/forgot', (req, res, next) => {
        async.waterfall(
            [
                function(done) {
                    crypto.randomBytes(20, (err, buff) => {
                        var token = buff.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    Vendor.findOne({ email: req.body.email }, (err, user) => {
                        if (!user || err) {
                            req.flash('error', process.env.NO_VENDOR_EXISTS);
                            return res.redirect('/forgot');
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(err => {
                            done(err, token, user);
                        });
                    });
                },
                function(token, user, done) {
                    var mailOptions = {
                        to: user.email,
                        from: 'noreply@captracks.com',
                        subject: emails[0].subject,
                        text: emails[0].text[0] + req.headers.host + emails[0].text[1]
                            + token + emails[0].text[2]
                    };
                    smtpTransport.sendMail(mailOptions, (err) => {
                        req.flash('message', process.env.RESET_MESSAGE);
                        done(err, 'done');
                    });
                },
            ],
            function(err) {
                // Handle Error
                if (err) {
                    return next(err);
                }
                res.redirect('/forgot');
            }
        );
    });

    // ==================== RESET (POST) ==================== //
    router.get('/reset/:token', (req, res) => {
        Vendor.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        },
            (err, user) => {
                if (!user || err) {
                    req.flash('error', process.env.RESET_INVALID);
                    return res.redirect('/forgot');
                }
                res.render('reset', {
                    user: req.user,
                    error: req.flash('error'),
                    message: req.flash('message'),
                });
            });
    });
    // ==================== RESET (GET) ==================== //
    router.post('/reset/:token', (req, res) => {
        async.waterfall([
            function(done) {
                Vendor.findOne({
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: { $gt: Date.now() }
                },
                    (err, user) => {
                        if (!user || err) {
                            req.flash('error', process.env.RESET_INVALID);
                            return res.redirect('/forgot');
                        }

                        user.password = createHash(req.body.password);
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        user.save((err) => {
                            done(err, user);
                        });
                    });
            },
            function(user, done) {
                var mailOptions = {
                    to: user.email,
                    from: 'noreply@captracks.com',
                    subject: emails[1].subject,
                    text: emails[1].text[0] + user.email + emails[1].text[1]
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('message', process.env.RESET_SUCCESS);
                    done(err);
                });
            }
        ], function(err) {
            // Handle Error
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    });

    // ==================== JOIN (GET) ==================== //
    router.get('/join', (req, res) => {
        // Get Stores in DB without Vendors
        Store.find({ vendor: null }, (err, stores) => {
            // Handle Error
            if (err) {
                return res.status(400).send(err);
            }
            stores.map(store => {
                var id = store._id;
                delete store._id;
                return {
                    id: id,
                    name: store.name,
                    address: store.address,
                    details: store.details,
                    phone: store.phone,
                    url: store.url,
                    hours: store.hours,
                };
            });

            res.render('join', {
                layout: 'layout',
                title: 'Join CapTracks',
                stores: stores,
                error: req.flash('error'),
                message: req.flash('message'),
            });
        });
    });
    // ==================== JOIN (POST) ==================== //
    router.post(
        '/join',
        passport.authenticate('signup', { failureRedirect: '/join' }),
        (req, res) => {
            async.waterfall([
                function(done) {
                    // New Details Object
                    let newDetails = new Details({
                        partition: process.env.DB_PARTITION,
                        maxCapacity: req.body.max,
                        capacity: 0,
                        waitTime: 0,
                        registers: req.body.regs,
                        updated: Date(),
                    });
                    // Save Details to DB
                    newDetails.save((err) => {
                        if (err) {
                            req.flash('error', process.env.STORE_REG_ERROR);
                            return res.redirect('/join');
                        }
                    });

                    // Check if user is linking to existing Store
                    if (req.body.existed) {
                        // Get Vendor (just created through passport)
                        Vendor.findOne({ _id: req.user._id }, (err, vendor) => {
                            // Handle Error
                            if (err) {
                                return res.status(400).send(err);
                            }
                            // Assign Vendor and newDetails to the Store
                            Store.findByIdAndUpdate(req.body.existed,
                                { vendor: vendor, details: newDetails._id },
                                err => {
                                    // Handle Error
                                    if (err) {
                                        return res.status(400).send(err);
                                    }
                                }
                            );
                        });
                    }
                    // Otherwise add Store to DB
                    else {
                        // Store Address
                        var address = req.body.street + ', ' + req.body.city + ', '
                            + req.body.state + ' ' + req.body.zip;
                        // Store Hours
                        var hours = [];
                        if (!req.body['24hours']) {
                            var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

                            for (let i = 0; i < days.length; i++) {
                                let curr = req.body[days[i]];
                                if (curr) {
                                    hours.push({
                                        day: days[i],
                                        open: curr[0] + ' ' + curr[1],
                                        close: curr[2] + ' ' + curr[3],
                                    });
                                } else {
                                    hours.push({ day: days[i] });
                                }
                            }
                        } else {
                            hours.push('Open 24/7');
                        }

                        // Check if Store already exists in DB with that address
                        Store.findOne({ address }, (err, store) => {
                            // Handle Error
                            if (err) {
                                req.flash('error', process.env.STORE_REG_ERROR);
                                return res.redirect('/join');
                            }
                            // Handle Store Exists
                            if (store) {
                                req.flash('error', process.env.STORE_REG_EXISTS);
                                return res.redirect('/join');
                            }
                            // New Store Object
                            let newStore = new Store({
                                partition: process.env.DB_PARTITION,
                                name: req.body.name,
                                address: address,
                                phone: req.body.storePhone,
                                url: req.body.url,
                                hours: hours,
                                forum: [],
                                vendor: vendor.id,
                                links: [],
                            });
                            // Save Store to DB
                            newStore.save((err) => {
                                done(err, newStore);
                            });
                        });
                    }
                },
                function(done) {
                    // Email team members when someone joins
                    var recipients = [
                        'gabriel.low@captracks.com',
                        'ben.shor@captracks.com',
                        'rena@captracks.com'
                    ];
                    recipients.forEach((to) => {
                        var adminMailOptions = {
                            from: 'rena@captracks.com',
                            to: to,
                            subject: "A new vendor joined CapTracks!",
                            text: `Vendor: ${req.body.name} 
                            \nSurvey 1: ${req.body.survey1} 
                            \nSurvey 2: ${req.body.survey2} 
                            \nNumber of Registers: ${req.body.reg} 
                            \nMax Capacity: ${req.body.max}`,
                        };
                        smtpTransport.sendMail(adminMailOptions, function(err) {
                            done(err);
                        });
                    });
                    // Confirmation email to vendor
                    var mailOptions = {
                        to: user.email,
                        from: 'noreply@captracks.com',
                        subject: emails[3].subject,
                        text: emails[3].text[0] + user.firstName + emails[3].text[1]
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        req.flash('message', process.env.RESET_SUCCESS);
                        done(err);
                    });
                }
            ], function(err) {
                res.cookie('firstName', user.firstName);
                res.cookie('userId', user.id);
                res.redirect('/account');
            });
        }
    );

    // ==================== LOGOUT (GET) ==================== //
    router.get('/logout', (req, res) => {
        req.session.destroy(err => {
            // Handle Error
            if (err) {
                req.flash('error', process.env.STORE_REG_ERROR);
                return res.redirect('/account');
            }
            req.logout();
            res.clearCookie('firstName');
            res.clearCookie('userId');
            res.redirect('/map');
        });
    });

    return router;
};