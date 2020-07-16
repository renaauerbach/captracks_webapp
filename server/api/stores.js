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
                phone: store.phone,
                url: store.url,
                hours: store.hours,
            };
        });

        res.render('map', { layout: 'layout', title: 'Map', displayMap: true, stores: stores });
    });
});

// Get store by ID (for forum/store page)
router.get('/:id', (req, res) => {
    Store.findById(req.params.id, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('forum', { layout: 'layout', title: store.name, store: store });
    });
 });

module.exports = router;
