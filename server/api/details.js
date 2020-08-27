const express = require('express');
const router = express.Router();

const Details = require('../db.js').Details;

// Update store details by Details ID
router.post('/:id', (req, res) => {
    if (req.isAuthenticated()) {
        console.log(req.body);
        const update = {
            capacity: calcCapacity(details, req.body),
            waitTime: calcWait(details, req.body),
        };

        Details.findByIdAndUpdate(req.params.id, update,
            (err) => {
                if (err) {
                    return res.status(400).send(err);
                }
                console.log('Capacity updated successfully!');
            });
        return res.redirect('/account');
    }
    return res.redirect('/login');
});

// Helper functions
// Calculate capacity
function calcCapacity(details, data) {
    // Divide current capacity by max capacity
    return data.capacity / details.maxCapacity;
}

// Calculate wait time
function calcWait(details, date) {
    // Check if store is full
    if (data.capacity == details.maxCapacity) {
        // Check if 
    }
}

module.exports = router;
