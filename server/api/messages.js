const express = require('express');

const router = express.Router();

const Message = require('../models/message.model');
const Store = require('../models/store.model');

// Add new message to store's forum
router.post('/', async (req, res) => {
	// Check if user is authenticated
	if (req.isAuthenticated()) {
		// Create new message from form
		var newMessage = new Message({
			partition: process.env.DB_PARTITION,
			title: req.body.title,
			text: req.body.text,
			createdOn: new Date(),
		});
		// Save new message to messages collection
		newMessage.save(await function(err) {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			// Find associated store by current user as the vendor
			Store.findOneAndUpdate({ vendor: req.user._id }, { $push: { forum: { $each: [newMessage._id], $position: 0 } } }, (err) => {
				if (err) {
					return res.status(400).json({ success: false, error: err });
				}
				return res.redirect('/account');
			});
		});
	}
	else {
		// Otherwise go back to login page
		return res.redirect('/login');
	}
});

// Delete a message from a forum
router.post('/delete/:id', (req, res) => {
	// Check if user is authenticated
	if (req.isAuthenticated()) {
		// Remove message from store forum
		Store.findOneAndUpdate({ vendor: req.user._id }, { $pull: { forum: { _id: req.params.id } } }, (err) => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			// Remove message from collection
			Message.findOneAndRemove({ _id: req.params.id }, err => {
				if (err) {
					return res.status(400).json({ success: false, error: err });
				}
				return res.redirect('/account');
			});
		});
	}
	else {
		// Otherwise go back to login page
		return res.redirect('/login');
	}
});

module.exports = router;
