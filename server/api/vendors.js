// ===== Modules ===== //
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Store = require('../models/store.model');
const Details = require('../models/details.model');
const Vendor = require('../models/vendor.model');
const path = require('path');
const { jsPDF } = require('jspdf'); //Added for generating PDF file for the QR code
const fs = require('fs');

// ==================== VENDOR ACCOUNT (GET) ==================== //
router.get('/', (req, res) => {
	// Check Vendor Authentication
	if (req.session.user !== undefined) {
		// Get all store info and populate all fields
		Store.findOne({ vendor: req.user._id })
			.populate({ path: 'details', model: 'details' })
			.populate({ path: 'vendor', model: 'vendors' })
			.populate({ path: 'forum', model: 'messages' })
			.exec((err, store) => {
				if (err) {
					return res.status(400).send(err);
				}

				var flag = new Boolean(true);
				if (
					store.vendor.entryqrcode === undefined ||
					store.vendor.entryqrcode === 'undefined'
				) {
					flag = false;
				}

				res.render('account', {
					layout: 'layout',
					vendor: req.user,
					store: store,
					details: store.details[0],
					title: 'My Account',
					user: req.isAuthenticated(),
					error: req.flash('error'),
					errorCap: req.flash('errorCap'),
					errorForum: req.flash('errorForum'),
					errorStore: req.flash('errorStore'),
					qrcodeflag: flag,
				});
			});
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/auth/login');
	}
});

// ==================== UPDATE STORE INFO (POST) ==================== //
// Edit Store info from account page
router.post('/:id', (req, res) => {
	// Check Vendor Authentication
	if (req.isAuthenticated()) {
		// Check update type (Add Link or Store Info)
		let update;
		if (req.body.linkUrl) {
			update = {
				$push: {
					links: {
						$each: [
							{
								title: req.body.linkTitle,
								url: req.body.linkUrl,
							},
						],
						$position: 0,
					},
				},
			};
		} else {
			update = {
				address: req.body.address,
				phone: req.body.phone,
				url: req.body.url,
			};
		}

		// Update Store by ID
		Store.findByIdAndUpdate(req.params.id, update, (err) => {
			if (err) {
				req.flash('errorStore', process.env.STORE_INFO_ERROR);
				console.log('Error updating Store info:', err);
			}
			return res.redirect('/account');
		});
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/auth/login');
	}
});

// ==================== REMOVE STORE LINK (POST) ==================== //
router.post('/remove/:id/:link', (req, res) => {
	// Check Vendor Authentication
	if (req.isAuthenticated()) {
		// Update Store by ID
		Store.findOneAndUpdate(
			{ _id: req.params.id },
			{
				$pull: { links: { url: req.params.link } },
			},
			(err) => {
				if (err) {
					req.flash('errorStore', process.env.STORE_INFO_ERROR);
					console.log('Error removing link:', err);
				}
				return res.redirect('/account');
			}
		);
	}
	// Not Authenticated --> back to Login
	else {
		return res.redirect('/auth/login');
	}
});

//Scan EntryQR code function starts here.
router.get('/entryqr/:id', (req, res) => {
	Store.findOne({ vendor: req.params.id })
		.populate({ path: 'details', model: 'details' })
		.exec((err, store) => {
			if (err || !store) {
				return res.status(400).send(err);
			} else {
				let currentCapcity = store.details[0].capacity;
				currentCapcity = currentCapcity + 1;
				if (currentCapcity > store.details[0].maxCapacity) {
					res.render('error'); //if current capacity and max capacity is equal will redirect to error page
				} else {
					let newdetails = store.details[0];
					newdetails.capacity = currentCapcity;
					newdetails.save((err) => {
						// Handle Error
						if (err) {
							console.log(
								'Save Error while invoking entryqr api - detail model :' +
									err
							);
							return res.status(400).send(err);
						}
					});
					res.redirect('/store/' + store._id);
				}
			}
		});
});

//Scan EntryQR code function Ends here.

//Scan ExitQR code function starts here.
router.get('/exitqr/:id', (req, res) => {
	Store.findOne({ vendor: req.params.id })
		.populate({ path: 'details', model: 'details' })
		.exec((err, store) => {
			if (err || !store) {
				console.log(err);
				return res.status(400).send(err);
			} else {
				let currentCapcity = store.details[0].capacity;
				if (currentCapcity > 0) {
					currentCapcity = currentCapcity - 1;
					let newdetails = store.details[0];
					newdetails.capacity = currentCapcity;
					newdetails.save((err) => {
						// Handle Error
						if (err) {
							console.log(
								'Save Error while invoking exit detail model :' +
									err
							);
							return res.status(400).send(err);
						}
					});
				}
				//After Scanned Exit QR code Redirect to Store exit URL
				res.redirect('/store/' + store._id + '/exit');
			}
		});
});
//Scan ExitQR code function Ends here.

//Download pdf file for EntryQR code starts here
router.get('/downloadEntryQR', (req, res) => {
	if (req.isAuthenticated()) {
		Store.findOne({ vendor: req.user._id })
			.populate({ path: 'vendor', model: 'vendors' })
			.exec((err, store) => {
				{
					if (err || !store) {
						console.log(err);
						return res.status(400).send(err);
					}
					var doc = new jsPDF();

					var logoPath = path.join(
						__dirname,
						'../../public/assets/img/logo1.png'
					);
					var bitmap = fs.readFileSync(logoPath);
					var logoBase64 = new Buffer.from(bitmap).toString('base64');

					doc.setFont(process.env.QR_DOC_FONT_FAMILY);
					doc.setTextColor(0, 0, 102);
					doc.addImage(logoBase64, 'PNG', 65, 20, 75, 25);
					doc.setFontSize(26);
					var welcomeMsg1 =
						process.env.QR_DOC_ENTRY_MESSAGE1 +
						' ' +
						store.name.toUpperCase() +
						'!';

					doc.text(
						doc.splitTextToSize(welcomeMsg1, 180),
						doc.internal.pageSize.getWidth() / 2,
						60,
						{ align: 'center' }
					);
					doc.setFontSize(20);
					var welcomeMsg2 =
						process.env.QR_DOC_ENTRY_MESSAGE2 +
						' ' +
						store.name.toUpperCase() +
						' ' +
						process.env.QR_DOC_ENTRY_MESSAGE3 +
						':';
					doc.text(
						doc.splitTextToSize(welcomeMsg2, 180),
						doc.internal.pageSize.getWidth() / 2,
						80,
						{ align: 'center' }
					);
					doc.addImage(
						store.vendor.entryqrcode,
						'PNG',
						30,
						95,
						150,
						150
					);
					doc.setFontSize(21);
					doc.text(
						process.env.QR_DOC_FOOTER_MESSAGE,
						doc.internal.pageSize.getWidth() / 2,
						doc.internal.pageSize.height - 25,
						{ align: 'center' }
					);

					let saveStatus = doc
						.save(
							req.user._id + process.env.QR_DOC_ENTRY_FILE_NAME,
							{
								returnPromise: true,
							}
						)
						.then(function (obj) {
							res.download(
								path.join(
									__dirname,
									'../' +
										req.user._id +
										process.env.QR_DOC_ENTRY_FILE_NAME
								),
								(err) => {
									if (err) {
										console.log(err);
									} else {
										let relPath =
											req.user._id +
											process.env.QR_DOC_ENTRY_FILE_NAME;
										fs.unlink(relPath, (err) => {
											if (err) {
												console.error(err);
												return;
											}
										});
									}
								}
							);
						});
				}
			});
	}
});
//Download pdf file for EntryQR code Ends here

//Download pdf file for ExitQR code starts here

router.get('/downloadExitQR', (req, res) => {
	if (req.isAuthenticated()) {
		Store.findOne({ vendor: req.user._id })
			.populate({ path: 'vendor', model: 'vendors' })
			.exec((err, store) => {
				{
					if (err || !store) {
						return res.status(400).send(err);
					}

					var doc = new jsPDF();

					var logoPath = path.join(
						__dirname,
						'../../public/assets/img/logo1.png'
					);
					var bitmap = fs.readFileSync(logoPath);
					var logoBase64 = new Buffer.from(bitmap).toString('base64');

					doc.setFont(process.env.QR_DOC_FONT_FAMILY);
					doc.setTextColor(0, 0, 102);
					doc.addImage(logoBase64, 'PNG', 65, 20, 75, 25);
					doc.setFontSize(24);
					doc.text(
						process.env.QR_DOC_EXIT_MESSAGE1,
						doc.internal.pageSize.getWidth() / 2,
						60,
						{ align: 'center' }
					);

					var exitMsg =
						process.env.QR_DOC_EXIT_MESSAGE2 +
						' ' +
						store.name.toUpperCase() +
						'!';
					doc.text(
						doc.splitTextToSize(exitMsg, 180),
						doc.internal.pageSize.getWidth() / 2,
						75,
						{ align: 'center' }
					);
					doc.addImage(
						store.vendor.exitqrcode,
						'PNG',
						30,
						90,
						150,
						150
					);
					doc.setFontSize(20);
					doc.text(
						doc.internal.pageSize.getWidth() / 2,
						doc.internal.pageSize.height - 50,
						process.env.QR_DOC_EXIT_MESSAGE3,
						{ align: 'center' }
					);
					doc.setFontSize(21);
					doc.text(
						doc.internal.pageSize.getWidth() / 2,
						doc.internal.pageSize.height - 25,
						process.env.QR_DOC_EXIT_MESSAGE4,
						{ align: 'center' }
					);
					let saveStatus = doc
						.save(
							req.user._id + process.env.QR_DOC_EXIT_FILE_NAME,
							{
								returnPromise: true,
							}
						)
						.then(function (obj) {
							res.download(
								path.join(
									__dirname,
									'../' +
										req.user._id +
										process.env.QR_DOC_EXIT_FILE_NAME
								),
								(err) => {
									if (err) {
										res.send(err);
										console.log(err);
									} else {
										let relPath =
											req.user._id +
											process.env.QR_DOC_EXIT_FILE_NAME;
										fs.unlink(relPath, (err) => {
											if (err) {
												console.error(err);
												return;
											}
										});
									}
								}
							);
						});
				}
			});
	}
});

module.exports = router;
