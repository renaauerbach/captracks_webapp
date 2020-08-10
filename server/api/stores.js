const express = require('express');
const router = express.Router();

const Store = require('../models/store.model');

// Get all stores --> MAP (Home)
router.get('/', (req, res) => {
    var loggedIn = req.user ? true : false;
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

        res.render('map', { 
            layout: 'layout', 
            title: 'Stores', 
            intro: true, 
            displayMap: true, 
            stores: stores,
            loggedIn: loggedIn,
        });
    });
});

// Get store by ID (for forum/store page)
router.get('/store/:id', (req, res) => {
    var loggedIn = req.user ? true : false;
    Store.findById(req.params.id, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('store', { 
            layout: 'layout', 
            title: store.name, 
            store: store,
            loggedIn: loggedIn,
        });
    });
});

module.exports = router;