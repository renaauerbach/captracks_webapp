// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Store = require('../models/store.model');

// ==================== MAP (GET) ==================== //
router.get('/', (req, res,next) => {
	// Get all Stores
	Store.find({})
		.populate({ path: 'details', model: 'details' })
		.exec((err, stores) => {
			if (err) {
				//return res.status(400).send(err);
				return next(err);
			}
			// Format Stores for Google
			stores.map((store) => {
				const id = store._id;
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
				title: 'CapTracks',
				intro: true,
				displayMap: true,
				stores: stores,
				user: req.isAuthenticated(),
			});
		});
});

// ==================== STORE PAGE (GET) ==================== //
router.get('/store/:id', (req, res,next) => {
	console.log('params', req.query);

	// Get Store by ID
	Store.findById(req.params.id)
		.populate({ path: 'details', model: 'details' })
		.populate({ path: 'forum', model: 'messages' })
		.exec((err, store) => {
			if (err || store==null) {
				 //res.status(400).send(error());;
			return next(err);
			}
			else{
			res.render('store', {
				layout: 'layout',
				title: store.name,
				store: store,
				details: store.details[0],
				user: req.isAuthenticated(),
				qr: req.query.qr ? true : false,
			
			});}
		});
	
});

// ==================== EXIT STORE PAGE (GET) ==================== //
router.get('/store/:id/exit', (req, res,next) => {
	// Get Store by ID
	Store.findById(req.params.id)
		.populate({ path: 'details', model: 'details' })
		.populate({ path: 'forum', model: 'messages' })
		.exec((err, store) => {
			if (err || store==null) {
				//return res.status(400).send(err);
				return next(err);
			}
			res.render('exit', {
				layout: 'layout',
				title: 'Goodbye',
				store: store,
				details: store.details[0],
				user: req.isAuthenticated(),
			});
		});
});



module.exports = router;
