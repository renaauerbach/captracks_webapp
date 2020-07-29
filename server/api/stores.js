const express = require('express');
const mongoose = require('mongoose');
const querystring = require('querystring');    
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const router = express.Router();

const partition = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/db.config.json'))).partition;
const jwtKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/auth.config.json'))).secret;
const jwtExpirySeconds = 360;

const Store = require('../models/store.model');
const Vendor = require('../models/vendor.model');

// Get all stores --> MAP (Home)
router.get('/', (req, res) => {
    Store.find((err, stores) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
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

        res.render('map', { layout: 'layout', title: 'Home', intro: true, displayMap: true, stores: stores });
    });
});


// Get store by ID (for forum/store page)
router.get('/store/:id', (req, res) => {
    Store.findById(req.params.id, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('store', { layout: 'layout', title: store.name, store: store });
    });
});


// Create new vendor account
router.get('/signup', (req, res) => {
    console.log(err)
    res.render('signup', {
        layout: 'layout',
        title: 'Sign Up',
        error: err,
    });
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    try {
        // Check if an account already exists with that email
        let vendor = await Vendor.findOne({
            email,
        });
        if (vendor) {
            return res.status(400).send(JSON.stringify(req.flash('An account already exists with that email.')));
        }
        
        vendor = new Vendor({
            partition: partition,
            firstName: firstName,
            lastName: lastName,
            password: password,
            phone: phone,
            email: email,
        });

        console.log(">> Salting");
        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(password, salt);

        await vendor.save();
        console.log(">> Saved");

        const payload = {
            vendor: {
                id: vendor.id,
            },
        };

        jwt.sign(
            payload,
            jwtKey,
            {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            },
            (err, token) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({
                    token,
                });
                res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
            }
        );
        console.log(">> JWT DONE");

        res.redirect('/signup/' + vendor._id + '/new_store');

    } catch (err) {
        res.status(500).json({ success: false, error: err });
        console.log("Error registering vendor", err);
    }

    // var recipients = ['gabriel@captracks.com', 'ben@captracks.com'];
    // const data = fs.readFileSync(path.join(__dirname, './config.json'));
    // const pwd = JSON.parse(data).gmail;
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'youremail@gmail.com',
    //         pass: pwd,
    //     },
    // });

    // // Email credentials
    // recipients.forEach(email, () => {
    //     var mailOptions = {
    //         from: 'youremail@gmail.com',
    //         to: email,
    //         subject: 'A new vendor registered their store with CapTracks!',
    //         text: 'That was easy!',
    //     };

    //     transporter.sendMail(mailOptions, (err, info) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log('Email sent successfull! ' + info.response);
    //         }
    //     });
    // });
});


// Add Store
router.get('/signup/:id/new_store', (req, res) => {
	res.render('new-store', {
		layout: 'layout',
		title: 'New Store',
	});
});

router.post('/signup/:id/new_store', async (req, res) => {
    var address = req.body.street + ", " + req.body.city + ", " + req.body.state + " " + req.body.zip;

    try {
        // Check if an store already exists with that address
        let store = await Store.findOne({
            address,
        });
        if (store) {
            return res.status(400).send(JSON.stringify(req.flash('This store is already registered in our system. Please try again or contact us for assistance.')));
        }

        var survey = [req.body.survey1, req.body.survey1];

        var hours = [];
        if (!req.body['24hours']) {
            var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            for (let i = 0; i < days.length; i++) {
                let curr = req.body[days[i]];
                if (curr) {
                    hours.push({'day': days[i], 'open': curr[0] + " " + curr[1], 'close': curr[2] + " " + curr[3]});
                }
                else {
                    hours.push({'day': days[i]});
                }
            }
        }
        else {
            hours.push('Open 24/7');
        }
        
        store = new Store({
            partition: partition,
            name: req.body.name,
            address: address,
            phone: req.body.phone,
            url: req.body.url,
            hours: hours,
            forum: [],
            vendor: req.body.id,
            details: [],
        });
    
        store.save((err, store) => {
            if (err) {
                res.status(400).json({ success: false, error: err });
            }
            res.status(200).json({ success: true, id: store.id });
            console.log('Store added successfully!');
        });
        res.redirect('/account');

    } catch (err) {
        res.status(500).send(JSON.stringify(req.flash('Error registering store')));
        console.log("Error registering vendor", err);
    }    
});

module.exports = router;
