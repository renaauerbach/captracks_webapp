const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Message = require('../db.js').Message;

// Get all messages (forum posts)
router.get('/store/:id/forum', (req, res) => {
   Message.find((err, messages) => {
      if (err) {
         res.status(400).json({ success: false, error: err });
      }
      res.json(
         messages.map(msg => {
            return {
               id: msg._id,
               title: msg.title,
               text: msg.text,
               createdOn: msg.createdOn,
            };
         })
      );
   });
});

// Create new message
router.post('/store/:id/forum/post', (req, res) => {
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
router.delete('/store/:id/forum/:id', (req, res) => {
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
