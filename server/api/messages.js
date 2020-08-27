const express = require('express');
const path = require('path');
const fs = require('fs');

const partition = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/db.config.json'))).partition;

const router = express.Router();

const Message = require('../models/message.model');
const Store = require('../models/store.model');

// Add new message to store's forum
router.post('/:id', (req, res) => {
	if (req.isAuthenticated()) {
		var newMessage = new Message({
			partition: partition,
			title: req.body.title,
			text: req.body.text,
			createdOn: new Date(),
		});
		newMessage.save((err, msg) => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			console.log('Forum post added successfully!');
		});
		Store.findByIdAndUpdate(req.params.id,
			{ $push: { forum: { $each: [newMessage], $position: 0 } } },
			(err) => {
				if (err) {
					return res.status(400).send(err);
				}
				console.log('Store updated successfully!');
			});
		return res.redirect('/account');
	}
	return res.redirect('/login');
});

// Delete a message
router.post('/:id/delete/:msg_id', (req, res) => {
	if (req.isAuthenticated()) {
		Store.findByIdAndUpdate(req.params.id,
			{ $pull: { forum: { _id: req.params.msg_id } } },
			(err) => {
				if (err) {
					console.log("err: ", err);
					return res.status(400).send(err);
				}
				console.log('Store updated successfully!');
			});
		Message.findByIdAndDelete({ _id: req.params.msg_id }), err => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			console.log('Forum post deleted successfully!');
		};
		return res.redirect('/account');
	}
	return res.redirect('/login');
});

module.exports = router;
