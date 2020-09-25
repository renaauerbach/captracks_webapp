// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Store = require('../models/store.model');

// ==================== VENDOR ACCOUNT (GET) ==================== //
router.get('/', (req, res) => {
    // Get all store info and populate all fields
    Store.findOne({ vendor: req.user._id })
        .populate({ path: 'details', model: 'details' })
        .populate({ path: 'vendor', model: 'vendors' })
        .populate({ path: 'forum', model: 'messages' })
        .exec((err, store) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.render('account', {
                layout: 'layout',
                vendor: req.user,
                store: store,
                details: store.details,
                title: 'My Account',
                user: req.isAuthenticated(),
                error: req.flash('error'),
            });
        });
});

// ==================== UPDATE STORE INFO (POST) ==================== //
// Edit Store info from account page
router.post('/:id', (req, res) => {
    // Check Vendor Authentication
    if (req.isAuthenticated()) {
        // Check update type (Add Link or Store Info)
        let update;
        if (req.body.linkUrl) {
            update = {
                $push: {
                    links: { $each: [{ 'title': req.body.linkTitle, 'url': req.body.linkUrl }], $position: 0 },
                },
            };
        }
        else {
            update = {
                address: req.body.address,
                phone: req.body.phone,
                url: req.body.url,
            };
        }

        // Update Store by ID
        Store.findByIdAndUpdate(req.params.id, update, err => {
            if (err) {
                req.flash('error', process.env.STORE_INFO_ERROR);
                console.log('Error updating Store info:', err);
                return res.redirect('/account');
            }
            return res.redirect('/account');
        });
    }
    // Not Authenticated --> back to Login
    else {
        return res.redirect('/login');
    }
});

// ==================== REMOVE STORE LINK (POST) ==================== //
router.post('/remove/:id/:link', (req, res) => {
    // Check Vendor Authentication
    if (req.isAuthenticated()) {

        // Update Store by ID
        Store.findOneAndUpdate({ _id: req.params.id },
            {
                $pull: { links: { 'url': req.params.link } }
            }, err => {
                if (err) {
                    req.flash('error', process.env.STORE_INFO_ERROR);
                    console.log('Error removing link:', err);
                    return res.redirect('/account');
                }
                return res.redirect('/account');
            });
    }
    // Not Authenticated --> back to Login
    else {
        return res.redirect('/login');
    }
});

module.exports = router;