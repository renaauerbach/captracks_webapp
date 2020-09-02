const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async');
const sgMail = require('@sendgrid/mail');

const router = express.Router();

const createHash = require('../passport/controller').createHash;

const Store = require('../models/store.model');
const Vendor = require('../models/vendor.model');
const Details = require('../models/details.model');

var smtpTransport = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
    },
});

module.exports = function(passport) {
    // Login
    router.get('/login', (req, res) => {
        res.render('login', {
            layout: 'layout',
            title: 'Login',
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

    // Login form POST
    router.post(
        '/login',
        passport.authenticate('login', { failureRedirect: '/login' }),
        (req, res) => {
            res.cookie('firstName', req.user.firstName);
            res.cookie('userId', req.user.id);
            return res.redirect('/account');
        }
    );

    // Forgot Password
    router.get('/forgot', (req, res) => {
        res.render('forgot', {
            layout: 'layout',
            title: 'Forgot Password',
            message: req.flash('message'),
        });
    });

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
                            req.flash(
                                'error',
                                'No account with that email address exists.'
                            );
                            return res.redirect('/forgot');
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        console.log("user:", user);

                        user.save(err => {
                            done(err, token, user);
                        });
                    });
                },
                function(token, user, done) {
                    var resetEmail = {
                        to: user.email,
                        from: 'noreply@captracks.com',
                        subject: 'Reset your CapTracks account password',
                        text: '\nYou are receiving this because you (or someone else) requested to reset the password for your CapTracks account.\n\n' +
                            'Please use the following link (valid for the next 60 minutes) to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not make this request, please ignore this email, and your password will remain unchanged.\n'
                    };
                    smtpTransport.sendMail(resetEmail, (err) => {
                        req.flash(
                            'message',
                            'An email has been sent to ' +
                            user.email +
                            ' with further instructions.'
                        );
                        done(err, 'done');
                    });
                },
            ],
            function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/forgot');
            }
        );
    });

    router.get('/reset/:token', (req, res) => {
        Vendor.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
            if (!user || err) {
                req.flash('message', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
                message: req.flash('message'),
            });
        });
    });

    router.post('/reset/:token', (req, res) => {
        async.waterfall([
            function(done) {
                Vendor.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                    if (!user || err) {
                        req.flash('message', 'Password reset token is invalid or has expired.');
                        return res.redirect('/forgot');
                    }

                    user.password = createHash(req.body.password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save((err) => {
                        req.logIn(user, (err) => {
                            done(err, user);
                        });
                    });
                });
            },
            function(user, done) {
                var resetEmail = {
                    to: user.email,
                    from: 'noreply@captracks.com',
                    subject: 'Your password has been reset',
                    text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your CapTracks account ' + user.email + ' has just been reset.\n\n' +
                        'If you did not make these changes, please contact rena@captracks.com.'
                };
                smtpTransport.sendMail(resetEmail, function(err) {
                    req.flash('message', 'Your password has been successfully reset!');
                    done(err);
                });
            }
        ], function(err) {
            res.redirect('/login');
        });
    });

    // Join CapTracks
    router.get('/join', (req, res) => {
        // Get stores without assigned vendors
        Store.find({ vendor: null }, (err, stores) => {
            if (err) {
                res.status(400).send(req.flash(err));
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
                message: req.flash('message'),
            });
        });
    });

    router.post(
        '/join',
        passport.authenticate('signup', { failureRedirect: '/join' }),
        (req, res) => {
            if (req.body.existed) {
                Vendor.findOne({ _id: req.user._id }, (err, vendor) => {
                    if (err) {
                        return res
                            .status(400)
                            .send('Error assinging vendor to store: ');
                    }

                    Store.findByIdAndUpdate(
                        req.body.existed,
                        { vendor: vendor },
                        err => {
                            if (err) {
                                return res.status(400).send(err);
                            }
                            console.log('Store assigned successfully!');
                        }
                    );
                });
            } else {
                var address =
                    req.body.street +
                    ', ' +
                    req.body.city +
                    ', ' +
                    req.body.state +
                    ' ' +
                    req.body.zip;
                try {
                    // Check if an store already exists with that address
                    let store = Store.findOne({ address });
                    if (store) {
                        return res
                            .status(400)
                            .send(
                                JSON.stringify(
                                    req.flash(
                                        'This store is already registered in our system. Please try again or contact us for assistance.'
                                    )
                                )
                            );
                    }

                    var hours = [];
                    if (!req.body['24hours']) {
                        var days = [
                            'Sun',
                            'Mon',
                            'Tues',
                            'Wed',
                            'Thurs',
                            'Fri',
                            'Sat',
                        ];

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

                    details = new Details({
                        partition: process.env.DB_PARTITION,
                        maxCapacity: req.body.max,
                        capacity: 0,
                        waitTime: 0,
                        registers: req.body.survey3,
                        updated: Date(),
                    });

                    details.save((err, details) => {
                        if (err) {
                            return res
                                .status(400)
                                .json({ success: false, error: err });
                        }
                        res.status(200).json({ success: true, id: details.id });
                        console.log('Details recorded successfully!');
                    });

                    newStore = new Store({
                        partition: process.env.DB_PARTITION,
                        name: req.body.name,
                        address: address,
                        phone: req.body.storePhone,
                        url: req.body.url,
                        hours: hours,
                        forum: [],
                        vendor: vendor.id,
                        details: details.id,
                    });

                    newStore.save((err, store) => {
                        if (err) {
                            return res
                                .status(400)
                                .json({ success: false, error: err });
                        }
                        res.status(200).json({ success: true, id: store.id });
                        console.log('Store added successfully!');
                    });
                } catch (err) {
                    res.status(500).send(
                        JSON.stringify(req.flash('Error registering store'))
                    );
                    console.log('Error registering vendor', err);
                }
            }

            var email = process.env.MAIL_USER;
            // var transporter = nodemailer.createTransport({
            //     host: "smtp.gmail.com",
            //     port: 465,
            //     secure: true,
            //     auth: {
            //         user: email,
            //         pass: process.env.MAIL_PASS,
            //     }
            // });

            // var textBody = `Vendor: ${req.body.name} Survey 1: ${req.body.survey1} Survey 2: ${req.body.survey2} Survey 3: ${req.body.survey3}`;
            // var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${req.body.name} <a href="mailto:${req.body.email}">${req.body.email}</a></p><p>${req.body.message}</p>`;

            // // var recipients = ['gabriel@captracks.com', 'ben@captracks.com']
            // var recipients = ['renaauerbach@gmail.com', 'renaauerbach@gmail.com']
            // recipients.forEach((to) => {
            //     var msg = {
            //         from: email,
            //         to: to,
            //         subject: "A new vendor registered their store with CapTracks!",
            //         text: textBody,
            //         html: htmlBody
            //     };

            //     transporter.sendMail(msg, (err, info) => {
            //         if(err) {
            //             console.log(err);
            //             res.json({ message: "message not sent: an error occured; check the server's console log" });
            //         }
            //         else {
            //             console.log({ message: `message sent: ${info.messageId}` });
            //         }
            //     });
            // });
            res.cookie('firstName', user.firstName);
            res.cookie('userId', user.id);
            return res.redirect('/account');
        }
    );

    router.get('/logout', (req, res) => {
        req.session.destroy(err => {
            req.logout();
            res.clearCookie('firstName');
            res.clearCookie('userId');
            res.redirect('/map');
        });
    });

    return router;
};
