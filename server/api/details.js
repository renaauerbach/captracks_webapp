const express = require('express');
const router = express.Router();

const Details = require('../db.js').Details;

// Get details by store ID
router.get('/:id', (req, res) => {
    Details.findById({ id: req.params._id }, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.json({
            id: store._id,
            name: store.name,
            address: store.address,
            vendor: store.vendor,
            forum: store.forum,
        });
    });
});

// Edit store details
// router.post('/register/store', (req, res) => {
//     // const address; - DEFINE ADDRESS
//     const newStore = new Store({
//         name: req.body.name,
//         address: address,
//         forum: [],
//         vendor: req.body.vendor,
//     });

//     newStore.save((err, msg) => {
//         if (err) {
//             res.status(400).json({ success: false, error: err });
//         }
//         res.status(200).json({ success: true, id: msg.id });
//         console.log('Store added successfully!');
//     });
// });

module.exports = router;
