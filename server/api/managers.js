const express = require('express');
const router = express.Router();

const Manager = require('../db.js').Manager;

// Handle login
// Get manager by ID
router.get('/:id', (req, res) => {
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
                    createdAt: msg.createdAt,
                };
            })
        );
    });
});

// Create new manager
router.post('/', (req, res) => {
    const newManger = new Manager({
        title: req.body.title,
        text: req.body.text,
        createdAt: req.body.createdAt,
    });

    newManger.save((err, msg) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true, id: msg.id });
        console.log('Forum post added successfully!');
    });
});

// Delete manager account
router.delete('/account/:id', (req, res) => {
    Manager.findByIdAndRemove({ _id: req.params.id, useFindAndModify: false }),
        err => {
            if (err) {
                res.status(400).json({ success: false, error: err });
            }
            res.status(200).json({ success: true });
            console.log('Forum post deleted successfully!');
        };
});

module.exports = router;
