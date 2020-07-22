const express = require('express');
const router = express.Router();

const Vendor = require('../models/vendor.model');

// Vendor Account --> ACCOUNT
router.get('/', (req, res) => {
    res.render('account', {
        layout: 'layout',
        title: 'My Account',
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
