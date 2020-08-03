const express = require('express');
const path = require('path');
const fs = require('fs');

const partition = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/db.config.json'))).partition;

const router = express.Router();

const Message = require('../models/message.model');
const Store = require('../models/store.model');

// Add new message to store's forum
router.post('/:id', (req, res) => {
	const newMessage = new Message({
		partition: partition,
		title: req.body.title,
		text: req.body.text,
		createdOn: new Date(year, month, day, hours, minutes)
	});

	Store.findById(req.body.storeId, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        newMessage.save((err, msg) => {
			if (err) {
				res.status(400).json({ success: false, error: err });
			}
			store.forum.push(msg);
			res.status(200).json({ success: true, id: msg.id });
			console.log('Forum post added successfully!');
		});
    });
	
});

// Delete a message
router.delete('/:id/delete', (req, res) => {
	Message.findByIdAndRemove({ _id: req.params.id, useFindAndModify: false }),
		err => {
			if (err) {
				res.status(400).json({ success: false, error: err });
			}
			res.status(200).json({ success: true });
			console.log('Forum post deleted successfully!');
		};
});

module.exports = router;
