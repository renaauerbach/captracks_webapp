// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Details = require('../models/details.model');

// ===== Helper Functions ===== //
// Calculate capacity
function calcCapacity(max, capacity) {
    return (capacity / max) * 100; // Divide current capacity by max capacity
}

// Calculate waitTime
function calcWait(max, body) {
    // Check if Store is full
    if (body.capacity === max) {
        return body.wait;
    }
    // Not full --> No wait
    return 0;
}
// TODO: FOR NOW: ESTIMATE WAIT TIME BELOW LINE QUESTION


// ==================== UPDATE CAPACITY (POST) ==================== //
router.post('/:id', (req, res) => {
    // Check Vendor Authentication
    if (req.isAuthenticated()) {
        Details.findById(req.params.id, (err, details) => {
            // Handle Error
            if (err) {
                req.flash('error', process.env.CAPACITY_ERROR);
                console.log('Error finding Details in DB:', err);
                return res.redirect('/account');
            }
            details.capacity = calcCapacity(
                details.maxCapacity,
                req.body.capacity
            );
            details.waitTime = calcWait(details.maxCapacity, req.body);
            details.save((err) => {
                // Handle Error
                if (err) {
                    req.flash('error', process.env.CAPACITY_ERROR);
                    console.log('Error saving Details to DB:', err);
                    return res.redirect('/account');
                }
            });

            return res.redirect('/account');
        });
    }
    // Not Authenticated --> back to Login
    else {
        return res.redirect('/login');
    }
});

module.exports = router;
