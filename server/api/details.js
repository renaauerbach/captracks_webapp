// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Details = require('../models/details.model');
const Store = require('../models/store.model');

// ===== Helper Functions ===== //
// Calculate capacity
function calcCapacity(max, capacity) {
	let cap = (capacity / max) * 100; // Divide current capacity by max capacity
	return Math.round(cap);
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

// ==================== UPDATE CAPACITY (POST) ==================== //
router.post('/', async (req, res) => {
	// Check Vendor Authentication
	if (req.isAuthenticated()) {
		// New Details Object
		let maxCap = req.body.maxCap;
		let newCapacity = new Details({
			partition: process.env.DB_PARTITION,
			maxCapacity: maxCap,
			capacity: calcCapacity(maxCap, req.body.capacity),
			waitTime: calcWait(maxCap, req.body),
			maxRegisters: req.body.maxReg,
			registers: req.body.register === 'on' ? req.body.registers : 0,
			updated: new Date(),
		});

		// Save Updates to DB
		newCapacity.save(
			await function (err) {
				// Handle Error
				if (err) {
					req.flash('errorCap', process.env.CAPACITY_ERROR);
					console.log('Error saving Details to DB:', err);
					return res.redirect('/account');
				}

				Store.findOneAndUpdate(
					{ vendor: req.user._id },
					{
						$push: {
							details: { $each: [newCapacity._id], $position: 0 },
						},
					},
					(err) => {
						// Handle Error
						if (err) {
							req.flash('errorCap', process.env.CAPACITY_ERROR);
							console.log('Error updating Capacity:', err);
							return res.redirect('/account');
						}
					}
				);
			}
		);
		return res.redirect('/account');
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/auth/login');
	}
});

module.exports = router;
