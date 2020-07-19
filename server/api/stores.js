const express = require('express');
const mongoose = require('mongoose');
const querystring = require('querystring');    

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

        res.render('map', { layout: 'layout', title: 'Home', intro: true, displayMap: true, stores: stores });
    });
});

// Add Store (for add store page)
router.get('/store/add', (req, res) => {
	res.render('add', {
		layout: 'layout',
		title: 'Add Store',
	});
});

router.post('/store/add', (req, res) => {
    var address = req.body.street + req.body.city + ", " + req.body.state + req.body.zip;
    var survey = [req.body.survey1, req.body.survey1];

    const newStore = new Store({
        name: req.body.name,
        address: address,
        phone: req.body.phone,
        url: req.body.url,
        // ADD HOURS
    });

    res.locals.store = newStore;
    res.locals.survey = survey;

    // newStore.save((err, store) => {
    //     if (err) {
    //         res.status(400).json({ success: false, error: err });
    //     }
    //     res.status(200).json({ success: true, id: store.id });
    //     console.log('Store added successfully!');
    // });
    res.redirect('/account/register');
});

// Get store by ID (for forum/store page)
router.get('/store/:id', (req, res) => {
    Store.findById(req.params.id, (err, store) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('store', { layout: 'layout', title: store.name, store: store });
    });
});

module.exports = router;
