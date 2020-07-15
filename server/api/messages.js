const express = require('express');
const mongoose = require('mongoose');
const db = require('../db.js');

const router = express.Router();

const Store = mongoose.model('stores');
const Message = mongoose.model('messages');

// Create new message
router.post('/post', (req, res) => {
   const newMessage = new Message({
      title: req.body.title,
      text: req.body.text,
      createdOn: req.body.createdOn,
   });

   newMessage.save((err, msg) => {
      if (err) {
         res.status(400).json({ success: false, error: err });
      }
      res.status(200).json({ success: true, id: msg.id });
      console.log('Forum post added successfully!');
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
