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
		newMessage.save((err) => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			console.log('Forum post added successfully!');
			Store.findById(req.params.id, (err, store) => {
				if (err) {
					return res.status(400).send(err);
				}
				store.forum.push(newMessage._id);
				store.partition = partition;
				console.log("Updated store:", store);
				store.save((err) => {
					console.log("SAVED STORE:", store);
					if (err) {
						return res.send(err);
					}
					return res.redirect('/account');
				});
			});

		});
		return res.redirect('/login');
	}
});

// Delete a message from a forum
router.post('/:id/delete/:msg_id', (req, res) => {
	if (req.isAuthenticated()) {
		console.log('ID: ', req.params.id);
		Message.findOneAndRemove({ _id: req.params.msg_id }), err => {
			if (err) {
				return res.status(400).json({ success: false, error: err });
			}
			Store.findByIdAndUpdate(req.params.id,
				{ $pull: { forum: { _id: req.params.msg_id } } },
				(err, store) => {
					console.log('STORE:', store);
					if (err) {
						console.log("err: ", err);
						return res.status(400).send(err);
					}
					console.log('Store updated successfully!');
				});

			console.log('Forum post deleted successfully!');
		};
		return res.redirect('/account');
	}
	return res.redirect('/login');
});

module.exports = router;
