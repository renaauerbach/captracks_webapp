const express = require('express');
const router = express.Router();

const Store = require('../models/store.model');
const Details = require('../models/details.model');

// Get all stores --> MAP (Home)
router.get('/', (req, res) => {
    Store.find({}, (err, stores) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        stores.map(store => {
            const id = store._id;
            delete store._id;
            return {
                id: id,
                name: store.name,
                address: store.address,
                details: store.populate({ path: "details", populate: "details" }),
                phone: store.phone,
                url: store.url,
                hours: store.hours,
            };
        });

        res.render('map', {
            layout: 'layout',
            title: 'CapTracks',
            intro: true,
            displayMap: true,
            stores: stores,
            user: req.user,
        });
    });
});

// Get store by ID (for forum/store page)
router.get('/store/:id', (req, res) => {
    Store.findById(req.params.id).populate({ path: "details", model: "details" }).populate({ path: "forum", model: "messages" }).exec((err, store) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        res.render('store', {
            layout: 'layout',
            title: store.name,
            store: store,
            details: store.details[0],
            user: req.user,
        });
    });
});

module.exports = router;