const express = require('express');
const router = express.Router();

const Vendor = require('../models/vendor.model');
const Store = require('../models/store.model');

// Vendor Account --> ACCOUNT
router.get('/', (req, res) => {
    // Get all store info and populate all fields
    Store.find({ vendor: req.user._id }).populate({ path: "details", model: "details" }).populate({ path: "vendor", model: "vendors" }).populate({ path: "forum", model: "messages" }).exec((err, store) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        res.render('account', {
            layout: 'layout',
            vendor: req.user,
            store: store[0],
            details: store[0].details[0],
            title: 'My Account',
            user: req.isAuthenticated(),
            message: req.flash('message')
        });
    });
});

// Edit Store info from account page
router.post('/:id', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        let update = {
            address: req.body.address,
            phone: req.body.phone,
            url: req.body.url
        };

        Store.findByIdAndUpdate(req.params.id, update,
            (err) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                console.log('Store info updated successfully!');
                return res.redirect('/account');
            });
    }
    else {
        // Otherwise go back to login page
        return res.redirect('/login');
    }
});

router.get('/profile', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        res.render('account', {
            layout: 'layout',
            vendor: req.user,
            title: 'My Profile',
            user: true,     // Dynamic since already checked for authentication
        });
    }
    else {
        // Otherwise go back to login page
        return res.redirect('/login');
    }
});

// // Account Settings
// router.get('/settings', (req, res) => {
//     if (req.isAuthenticated()) {
//      Store.find({ vendor: req.user._id }).populate({ path: "store.details", populate: "details" }).exec((err, store) => {
//             if (err) {
//                 return res.status(400).json({ success: false, error: err });
//             }
//             res.render('account', {
//                 layout: 'layout',
//                 vendor: req.user,
//                 store: store[0],
//                 title: 'Settings',
//                 user: true,     // Dynamic since already checked for authentication
//             });
//         });
//     }
//     else {
//         res.redirect('/login');
//     }
// });

// // Delete Vendor Account
// router.delete('/:id', (req, res) => {
//     if (req.isAuthenticated()) {
//         Vendor.findByIdAndRemove(res.locals.user._id, err => {
//             if (err) {
//                 res.status(400).json({ success: false, error: err });
//             }
//             res.status(200).json({ success: true });
//             console.log('Vendor account deleted successfully!');
//         });
//     }
//     res.redirect('/login');
// });

module.exports = router;
