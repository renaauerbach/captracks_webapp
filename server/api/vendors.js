const express = require('express');
const router = express.Router();

const Vendor = require('../models/vendor.model');
const Store = require('../models/store.model');


var isAuthenticated = (req, res, next) => {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/login');
}


// Vendor Account --> ACCOUNT
router.get('/', isAuthenticated, (req, res) => {
    var user = req.user;
    var loggedIn = req.user ? true : false;
    Store.find({vendor: vendor._id}, (err, store) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        res.render('account', {
            layout: 'layout',
            vendor: vendor,
            store: store[0],
            title: 'My Account',
            loggedIn: loggedIn,
        });
    })
});

router.get('/profile', isAuthenticated, (req, res) => {
    var user = req.user;
    var loggedIn = req.user ? true : false;
    Vendor.find({_id: user._id}, (err, vendor) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        res.render('profile', {
            layout: 'layout',
            vendor: vendor,
            title: 'My Profile',
            loggedIn: loggedIn,
        });
    })
});

router.get('/settings', isAuthenticated, (req, res) => {
    var user = req.user;
    var loggedIn = req.user ? true : false;
    Vendor.find({_id: user._id}, (err, vendor) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        Store.find({vendor: vendor._id}, (err, store) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            res.render('settings', {
                layout: 'layout',
                vendor: vendor,
                store: store[0],
                title: 'Settings',
                loggedIn: loggedIn,
            });
        })
});

// Delete Vendor Account
router.delete('/:id', (req, res) => {
    Vendor.findByIdAndRemove(req.user._id, err => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true });
        console.log('Vendor account deleted successfully!');
    });
});

module.exports = router;
