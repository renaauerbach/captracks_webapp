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
        // res.json(
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
        // );

        res.render('map', { layout: 'layout', title: 'Map', stores: stores });
    });
});

// Get store by ID
router.get('/:id', (req, res) => {
    Store.findById({ id: req.params._id }, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('map', { layout: 'layout', title: 'Map', stores: stores });
    });
});

// Get forum and all messages

// Create new store & save new store
// router.post('/register/store', (req, res) => {
//     const address; - DEFINE ADDRESS
//     const newStore = new Store({
//         name: req.body.name,
//         address: address,
//         forum: [],
//         manager: req.body.manager,
//     });
//
//     newStore.save((err, msg) => {
//         if (err) {
//             res.status(400).json({ success: false, error: err });
//         }
//         res.status(200).json({ success: true, id: msg.id });
//         console.log('Store added successfully!');
//     });
// });

module.exports = router;
