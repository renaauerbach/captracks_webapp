const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const jwtKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/auth.config.json'))).secret;
const jwtExpirySeconds = 360;

const Manager = require('../models/manager.model');

// Handle login
router.get('/', (req, res) => {
    res.render('account', {
        layout: 'layout',
        title: 'My Account',
    });
});


// Create new manager
router.get('/register', (req, res) => {
    res.render('register', {
        layout: 'layout',
        title: 'Create Account',
    });
});

router.post('/register', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, error: errors.array() });
    }
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
            firstName: firstName,
            lastName: lastName,
            password: password,
            phone: phone,
            email: email,
        });

        const salt = await bcrypt.genSalt(10);
        manager.password = await bcrypt.hash(password, salt);

        await manager.save();

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
        res.render('account', {
            layout: 'layout',
            title: 'Account',
            store: req.store,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
        console.log("Error registering manager", err.message);
    }

    var recipients = ['gabriel@captracks.com', 'ben@captracks.com'];
    const data = fs.readFileSync(path.join(__dirname, './config.json'));
    const pwd = JSON.parse(data).gmail;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: pwd,
        },
    });

    // Email credentials
    recipients.forEach(email, () => {
        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'A new vendor registered their store with CapTracks!',
            text: 'That was easy!',
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent successfull! ' + info.response);
            }
        });
    });

    res.redirect('/:id');
});

// Delete manager account
router.delete('/:id/delete', (req, res) => {
    Manager.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true });
        console.log('Manager account deleted successfully!');
    });
});

module.exports = router;
