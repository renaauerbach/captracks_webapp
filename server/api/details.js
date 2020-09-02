const express = require('express');
const router = express.Router();

const Details = require('../models/details.model');

// Calculate capacity
function calcCapacity(max, capacity) {
    // Divide current capacity by max capacity
    return (capacity / max) * 100;
}

// Calculate wait time
function calcWait(max, capacity) {
    // Check if store is full
    if (capacity === max) {
        // Check if 
    }
}

// Update store details by Details ID
router.post('/:id', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
        console.log(req.body);
        Details.findById(req.params.id, (err, details) => {
            if (err) {
                return res.status(400).json({ success: false, error: err });
            }
            details.capacity = calcCapacity(details.maxCapacity, req.body.capacity);
            details.waitTime = calcWait(details.maxCapacity, req.body.capacity);

            return res.redirect('/account');
        });

    }
    else {
        // Otherwise go back to login page
        return res.redirect('/login');
    }
});


module.exports = router;
