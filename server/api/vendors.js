const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const partition = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/db.config.json'))).partition;
const jwtKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/auth.config.json'))).secret;
const jwtExpirySeconds = 360;

const Vendor = require('../models/vendor.model');

// Vendor Account --> ACCOUNT
// Login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        let vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).json({
                message: 'Vendor does not exist',
            });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        console.log("MATCHED: ", isMatch);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect Password!',
            });
        }

        const payload = {
            vendor: {
                id: vendor.id,
            },
        };

        jwt.sign(
            payload,
            jwtKey,
            {
                algorithm: 'HS256',
                expiresIn: jwtExpirySeconds,
            },
            (err, token) => {
                if (err) {
                    throw err;
                }
                res.status(200).json({
                    token,
                });
                res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
            }
        );
        res.redirect('account/' + vendor._id);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
        console.log('Error logging in vendor', err.message);
    }
});


router.get('/:id', (req, res) => {
    Vendor.findById(req.params.id, (err, vendor)=> {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        Store.find({vendor: vendor._id}, (err, store) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            res.render('account', {
                layout: 'layout',
                vendor: vendor,
                store: store,
                title: 'My Account',
            });
        })
    });
});

// Delete Vendor Account
router.delete('/:id', (req, res) => {
    Vendor.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true });
        console.log('Vendor account deleted successfully!');
    });
});

module.exports = router;
