const express = require('express');
const router = express.Router();

const Vendor = require('../models/vendor.model');
const Store = require('../models/store.model');

// Vendor Account --> ACCOUNT
router.get('/', (req, res) => {
    Store.find({ vendor: req.user._id }, (err, store) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        res.render('account', {
            layout: 'layout',
            vendor: req.user,
            store: store[ 0 ],
            title: 'My Account',
            user: req.isAuthenticated(),
        });
    });
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', {
            layout: 'layout',
            vendor: req.user,
            title: 'My Profile',
            user: true,     // Dynamic since already checked for authentication
        });
    }
    else {
        res.redirect('/login');
    }
});

router.get('/settings', (req, res) => {
    if (req.isAuthenticated()) {
        Store.find({ vendor: req.user._id }, (err, store) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            res.render('settings', {
                layout: 'layout',
                vendor: req.user,
                store: store[ 0 ],
                title: 'Settings',
                user: true,     // Dynamic since already checked for authentication
            });
        });
    }
    else {
        res.redirect('/login');
    }
});

// Delete Vendor Account
router.delete('/:id', (req, res) => {
    if (req.isAuthenticated()) {
        Vendor.findByIdAndRemove(res.locals.user._id, err => {
            if (err) {
                res.status(400).json({ success: false, error: err });
            }
            res.status(200).json({ success: true });
            console.log('Vendor account deleted successfully!');
        });
    }
    res.redirect('/login');
});

module.exports = router;
