const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = mongoose.model('User');

// Get user info
router.get('/:id', (req, res) => {
    User.findById({ id: req.params.id })
        .then(user => res.json(user))
        .catch(err => res.json({ error: err.message }));
});

// Create new user & save to database

// Get user favorites

// Add store to favorites
