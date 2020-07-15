const express = require('express');
const mongoose = require('mongoose');
const db = require('../db.js');

const router = express.Router();

const Store = mongoose.model('stores');

// Get all stores

router.get('/', (req, res) => {
    Store.find((err, stores) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        stores.map(store => {
            var id = store._id;
            delete store._id;
            return {
                id: id,
                name: store.name,
                address: store.address,
                details: store.details,
            };
        });

        res.render('map', { layout: 'layout', title: 'Map', displayMap: true, stores: stores });
    });
});

// Get store by ID
router.get('/:id', (req, res) => {
    Store.find({ id: req.params.id }, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('map', { layout: 'layout', title: 'Map', displayMap: true, store: store });
    });
});


// Get store's forum
router.get('/:id/forum', (req, res) => {
    Store.find({ id: req.params._id }, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('forum', { layout: 'layout', title: store.name, forum: store.forum });
    });
 });

module.exports = router;
