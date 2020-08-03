const express = require('express');
const router = express.Router();

const Vendor = require('../models/vendor.model');
const Store = require('../models/store.model');

// Vendor Account --> ACCOUNT
router.get('/:id', (req, res) => {
    Vendor.findById(req.params.id, (err, vendor)=> {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        Store.find({vendor: req.params.id}, (err, store) => {
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
