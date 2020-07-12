const express = require('express');
const router = express.Router();

const Store = require('../db.js').Store;

// Get all stores
router.get('/stores', (req, res) => {
    Store.find((err, stores) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.json(
            stores.map(store => {
                // Don't need all data for listing all stores
                return {
                    id: store._id,
                    name: store.name,
                    address: store.address,
                    details: store.details,
                };
            })
        );
    });
});

// Get store by ID
router.get('/stores/:id', (req, res) => {
    Store.findById({ id: req.params._id }, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.json({
            id: store._id,
            name: store.name,
            address: store.address,
            manager: store.manager,
            details: store.details,
            forum: store.forum,
        });
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
