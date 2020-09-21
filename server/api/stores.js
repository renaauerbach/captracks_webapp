// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Store = require('../models/store.model');

// ==================== MAP (GET) ==================== //
router.get('/', (req, res) => {
    // Get all Stores
    Store.find({}).populate({ path: 'details', model: 'details' }).exec((err, stores) => {
        if (err) {
            return res.status(400).send(err);
        }
        // Format Stores for Google
        stores.map(store => {
            const id = store._id;
            delete store._id;
            return {
                id: id,
                name: store.name,
                address: store.address,
                details: store.details[0],
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
            user: req.isAuthenticated(),
        });
    });
});

// ==================== STORE PAGE (GET) ==================== //
router.get('/store/:id', (req, res) => {
    // Get Store by ID
    Store.findById(req.params.id)
        .populate({ path: 'details', model: 'details' })
        .populate({ path: 'forum', model: 'messages' })
        .exec((err, store) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.render('store', {
                layout: 'layout',
                title: store.name,
                store: store,
                details: store.details[0],
                user: req.isAuthenticated(),
            });
        });
});

module.exports = router;