const express = require('express');
const router = express.Router();

const Manager = require('../models/manager.model');

// Manager Account --> ACCOUNT
router.get('/', (req, res) => {
    res.render('account', {
        layout: 'layout',
        title: 'My Account',
    });
});

// Delete Manager Account
router.delete('/:id', (req, res) => {
    Manager.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true });
        console.log('Manager account deleted successfully!');
    });
});

module.exports = router;
