// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Message = require('../models/message.model');
const Store = require('../models/store.model');

// ==================== ADD FORUM POST (POST) ==================== //
router.post('/', async (req, res) => {
	// Check Vendor Authentication
	if (req.isAuthenticated()) {
		// New Message Object
		let newMessage = new Message({
			partition: process.env.DB_PARTITION,
			title: req.body.title,
			text: req.body.text,
			createdOn: new Date(),
		});
		// Save Message to DB
		newMessage.save(
			await function(err) {
				// Handle Error
				if (err) {
					req.flash('error', process.env.FORUM_POST_ERROR);
					console.log('Error saving Message to the db:', err);
					return res.redirect('/account');
				}
				// Add Message to Store's forum
				Store.findOneAndUpdate(
					{ vendor: req.user._id },
					{
						$push: {
							forum: { $each: [newMessage._id], $position: 0 },
						},
					},
					err => {
						// Handle Error
						if (err) {
							req.flash('error', process.env.FORUM_POST_ERROR);
							console.log('Error posting Message to forum:', err);
							return res.redirect('/account');
						}
						return res.redirect('/account');
					}
				);
			}
		);
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/login');
	}
});

// ==================== DELETE FORUM POST (POST) ==================== //
router.post('/delete/:id', (req, res) => {
	// Check Vendor Authentication
	if (req.isAuthenticated()) {
		// Remove Message from Store's forum
		Store.findOneAndUpdate(
			{ vendor: req.user._id },
			{ $pull: { forum: { _id: req.params.id } } },
			err => {
				// Handle Error
				if (err) {
					req.flash('error', process.env.FORUM_REMOVE_ERROR);
					console.log('Error removing Message from forum:', err);
					return res.redirect('/account');
				}
				// Remove Message from DB
				Message.findOneAndRemove({ _id: req.params.id }, err => {
					// Handle Error
					if (err) {
						req.flash('error', process.env.FORUM_REMOVE_ERROR);
						console.log('Error deleting Message from forum:', err);
						return res.redirect('/account');
					}
					return res.redirect('/account');
				});
			}
		);
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/login');
	}
});

module.exports = router;
