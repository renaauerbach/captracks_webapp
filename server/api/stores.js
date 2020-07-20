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

const jwtKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/auth.config.json'))).secret;
const jwtExpirySeconds = 360;

const Store = require('../models/store.model');
const Manager = require('../models/manager.model');

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

// Add Store
router.get('/register/store', (req, res) => {
	res.render('add', {
		layout: 'layout',
		title: 'Add Store',
	});
});

router.post('/register/store', (req, res) => {
    console.log("STORE BODY: ", req.body);
    var address = req.body.street + " " + req.body.city + ", " + req.body.state + " " + req.body.zip;
    var survey = [req.body.survey1, req.body.survey1];

    const newStore = new Store({
        name: req.body.name,
        partition: 'trackable_caps',
        address: address,
        phone: req.body.phone,
        url: req.body.url,
        // ADD HOURS
    });

    // newStore.save((err, store) => {
    //     if (err) {
    //         res.status(400).json({ success: false, error: err });
    //     }
    //     res.status(200).json({ success: true, id: store.id });
    //     console.log('Store added successfully!');
    // });
    res.redirect('/register/account');
});

// Create new manager
router.get('/register/account', (req, res) => {
    res.render('register', {
        layout: 'layout',
        title: 'Create Account',
    });
});

router.post('/register/account', async (req, res) => {
    const { firstName, lastName, password, phone, email } = req.body;
    // Check if an account already exists with that email
    try {
        let manager = await Manager.findOne({
            email,
        });
        if (manager) {
            return res.status(400).json({
                msg: 'Account already exists with that email',
            });
        }
        manager = new Manager({
            partition: 'trackable_caps',
            firstName: firstName,
            lastName: lastName,
            password: password,
            phone: phone,
            email: email,
        });

        console.log(">> Salting");
        const salt = await bcrypt.genSalt(10);
        manager.password = await bcrypt.hash(password, salt);

        await manager.save();
        console.log(">> Saved");

        const payload = {
            manager: {
                id: manager.id,
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

        res.redirect('/account');

    } catch (err) {
        res.status(500).json({ success: false, error: err });
        console.log("Error registering manager", err);
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

// Get store by ID (for forum/store page)
router.get('/stores/:id', (req, res) => {
    Store.findById(req.params.id, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('store', { layout: 'layout', title: store.name, store: store });
    });
});

module.exports = router;
