const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');
const asyncify = require('express-asyncify');
const nodemailer = require('nodemailer');
const router = express.Router();

const partition = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../config/db.config.json'))
).partition;

const Store = require('../models/store.model');
const Vendor = require('../models/vendor.model');
const Details = require('../models/details.model');

module.exports = function(passport) {
    // Login
    router.get('/login', (req, res) => {
        res.render('login', {
            layout: 'layout',
            title: 'Login',
            message: req.flash('message'),
        });
    });

    // Login form POST
    router.post(
        '/login',
        passport.authenticate('login', {
            successRedirect: '/account',
            failureRedirect: '/login',
            failureFlash: true,
        })
    );

    // Forgot Password
    router.get('/forgot', (req, res) => {
        res.render('forgot', {
            layout: 'layout',
            title: 'Forgot Password',
            message: req.flash('message'),
        });
    });

    router.post('/forgot', async (req, res, next) => {
        const token = (await promisify(crypto.randomBytes)(20)).toString('hex');
        const user = Vendors.find(u => u.email === req.body.email);

        if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        const resetEmail = {
            to: user.email,
            from: 'noreply@captracks.com',
            subject: 'Reset Your CapTracks Account Password',
            text: `
            You are receiving this because you have requested the reset of the password for your account.
            Please click on the following link, or paste this into your browser to complete the process:
            http://${req.headers.host}/reset/${token}
            If you did not request this, please ignore this email and your password will remain unchanged.
        `,
        };

        await transport.sendMail(resetEmail);
        req.flash(
            'info',
            `An e-mail has been sent to ${user.email} with further instructions.`
        );

        res.redirect('/forgot');
    });

    router.get('/reset/:token', (req, res) => {
        const vendor = Vendor.find(
            v =>
                v.resetPasswordExpires > Date.now() &&
                crypto.timingSafeEqual(
                    Buffer.from(v.resetPasswordToken),
                    Buffer.from(req.params.token)
                )
        );

        if (!vendor) {
            req.flash(
                'error',
                'Password reset token is invalid or has expired.'
            );
            return res.redirect('/forgot');
        }

        res.setHeader('Content-type', 'text/html');
        res.render('reset', {
            layout: 'layout',
            title: 'Reset Password',
            token: vendor.resetPasswordToken,
        });
    });

    router.post('/reset/:token', async (req, res) => {
        const vendor = Vendor.find(
            v =>
                v.resetPasswordExpires > Date.now() &&
                crypto.timingSafeEqual(
                    Buffer.from(v.resetPasswordToken),
                    Buffer.from(req.params.token)
                )
        );

        if (!vendor) {
            req.flash(
                'error',
                'Password reset token is invalid or has expired.'
            );
            return res.redirect('/forgot');
        }

        vendor.password = req.body.password;
        delete vendor.resetPasswordToken;
        delete vendor.resetPasswordExpires;

        const resetEmail = {
            to: vendor.email,
            from: 'noreply@captracks.com',
            subject: 'Your password has been reset',
            text: `
            This is a confirmation that the password for your account "${user.email}" has just been changed.
        `,
        };

        await transport.sendMail(resetEmail);
        req.flash('success', `Your password has been successfully reset`);

        res.redirect('/login');
    });
    
    // Join CapTracks
    router.get('/join', (req, res) => {
        // Get stores without assigned vendors
        Store.find({ vendor: null }, (err, stores) => {
            if (err) {
                res.status(400).send(JSON.stringify(req.flash(err)));
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
                title: 'Join',
                stores: stores,
            });
        });
    });
 
    router.post('/join', passport.authenticate('signup', { failureRedirect: '/join' }),
    (req, res) => {
        console.log("res.locals.currUser: ", res.locals.currUser);
        const vendor = req.user;
        if (req.body.existed) {
            Vendor.findOne({id: vendor.id}, (err, vendor) => {
                if (err) {
                    return res.status(400).send(JSON.stringify(req.flash(err)));
                }

                Store.findOne({id: req.body.existed}), (err, store) => {
                    if (err) {
                        return res
                            .status(400)
                            .send(JSON.stringify(req.flash(err)));
                    }
                    store.overwrite({vendor: vendor});
                    store.save();
                    console.log('Store assigned successfully!');
                }
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
                let store = Store.findOne({
                    address,
                });
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
                    partition: partition,
                    capacity: 0,
                    waitTime: 0,
                    registers: req.body.survey3,
                    createdOn: Date(),
                })

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
                    partition: partition,
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

        var email = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/mail.config.json'))).email;
        console.log(email);
        // var transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true,
        //     auth: {
        //         user: email,
        //         pass: JSON.parse(fs.readFileSync(path.join(__dirname, '../config/mail.config.json'))).password,
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
        res.redirect('/account');
    });

    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });

    return router;
};
