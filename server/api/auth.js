// ===== Modules ===== //
const async = require('async');
const crypto = require('crypto');
const express = require('express');
// ===== Router ===== //
const router = express.Router();
// ===== Models ===== //
const Details = require('../models/details.model');
const Store = require('../models/store.model');
const Vendor = require('../models/vendor.model');

// ===== Helper Functions & Data ===== //
const createHash = require('../passport/controller').createHash;
const emails = global.emails;
const smtpTransport = global.smtpTransport;

module.exports = function (passport) {
	// ==================== LOGIN (GET) ==================== //
	router.get('/login', (req, res) => {
		res.render('auth', {
			layout: 'layout',
			title: 'Login',
			error: req.flash('error'),
			message: req.flash('message'),
		});
	});
	// ==================== LOGIN (POST) ==================== //
	router.post(
		'/login',
		passport.authenticate('login', { failureRedirect: '/auth/login' }),
		(req, res) => {
			req.session.user = req.user;
			return res.redirect('/account');
		}
	);

	// ==================== FORGOT (GET) ==================== //
	router.get('/forgot', (req, res) => {
		res.render('auth', {
			layout: 'layout',
			title: 'Forgot Password',
			error: req.flash('error'),
			message: req.flash('message'),
		});
	});
	// ==================== FORGOT (POST) ==================== //
	router.post('/forgot', (req, res, next) => {
		async.waterfall(
			[
				function (done) {
					crypto.randomBytes(20, (err, buff) => {
						const token = buff.toString('hex');
						done(err, token);
					});
				},
				function (token, done) {
					Vendor.findOne({ email: req.body.email }, (err, user) => {
						if (!user || err) {
							req.flash('error', process.env.WRONG_EMAIL);
							return res.redirect('/auth/forgot');
						}

						user.resetPasswordToken = token;
						user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

						user.save((err) => {
							done(err, token, user);
						});
					});
				},
				function (token, user, done) {
					const mailOptions = {
						to: user.email,
						from: 'noreply@captracks.com',
						subject: emails[0].subject,
						text:
							emails[0].text[0] +
							req.headers.host +
							emails[0].text[1] +
							token +
							emails[0].text[2],
					};
					smtpTransport.sendMail(mailOptions, (err) => {
						req.flash('message', process.env.RESET_MESSAGE);
						done(err, 'done');
					});
				},
			],
			function (err) {
				// Handle Error
				if (err) {
					return next(err);
				}
				res.redirect('/auth/forgot');
			}
		);
	});

	// ==================== RESET (POST) ==================== //
	router.get('/reset/:token', (req, res) => {
		Vendor.findOne(
			{
				resetPasswordToken: req.params.token,
				resetPasswordExpires: { $gt: Date.now() },
			},
			(err, user) => {
				if (!user || err) {
					req.flash('error', process.env.RESET_INVALID);
					return res.redirect('/auth/forgot');
				}
				res.render('auth', {
					user: req.user,
					title: 'Reset Password',
					error: req.flash('error'),
					message: req.flash('message'),
				});
			}
		);
	});
	// ==================== RESET (GET) ==================== //
	router.post('/reset/:token', (req, res, next) => {
		async.waterfall(
			[
				function (done) {
					Vendor.findOne(
						{
							resetPasswordToken: req.params.token,
							resetPasswordExpires: { $gt: Date.now() },
						},
						(err, user) => {
							if (!user || err) {
								req.flash('error', process.env.RESET_INVALID);
								return res.redirect('/auth/forgot');
							}

							user.password = createHash(req.body.password);
							user.resetPasswordToken = undefined;
							user.resetPasswordExpires = undefined;

							user.save((err) => {
								done(err, user);
							});
						}
					);
				},
				function (user, done) {
					const mailOptions = {
						to: user.email,
						from: 'noreply@captracks.com',
						subject: emails[1].subject,
						text:
							emails[1].text[0] + user.email + emails[1].text[1],
					};
					smtpTransport.sendMail(mailOptions, (err) => {
						req.flash('message', process.env.RESET_SUCCESS);
						done(err);
					});
				},
			],
			function (err) {
				// Handle Error
				if (err) {
					return next(err);
				}
				res.redirect('/auth/login');
			}
		);
	});

	// ==================== JOIN (GET) ==================== //
	router.get('/join', (req, res) => {
		// Get Stores in DB without Vendors
		Store.find({ vendor: null }, (err, stores) => {
			// Handle Error
			if (err) {
				return res.status(400).send(err);
			}
			stores.map((store) => {
				const id = store._id;
				delete store._id;
				return {
					id: id,
					name: store.name,
					address: store.address,
				};
			});

			res.render('auth', {
				layout: 'layout',
				title: 'Join CapTracks',
				stores: stores,
				error: req.flash('error'),
				message: req.flash('message'),
			});
		});
	});
	// ==================== JOIN (POST) ==================== //
	router.post(
		'/join',
		passport.authenticate('signup', { failureRedirect: '/auth/join' }),
		(req, res, next) => {
			async.waterfall(
				[
					function (done) {
						// New Details Object
						const newDetails = new Details({
							partition: process.env.DB_PARTITION,
							maxCapacity: req.body.max,
							capacity: 0,
							waitTime: 0,
							maxRegisters: req.body.reg,
							registers: req.body.reg,
							updated: new Date(),
						});
						// Save Details to DB
						newDetails.save((err) => {
							// Handle Error
							if (err) {
								// Delete Vendor
								Vendor.deleteOne(
									{ _id: req.user._id },
									(err) => {
										console.log(err);
										req.flash(
											'error',
											process.env.STORE_REG_ERROR
										);
										return res.redirect('/auth/join');
									}
								);
							}
						});

						// Check if user is linking to existing Store
						if (req.body.existed) {
							// Assign Vendor (user) and newDetails to the Store
							Store.findByIdAndUpdate(
								req.body.existed,
								{
									vendor: req.user._id,
									details: newDetails._id,
								},
								(err, store) => {
									// Handle Error
									if (err || !store) {
										// Delete Vendor
										Vendor.deleteOne(
											{ _id: req.user._id },
											(err) => {
												console.log(err);
												req.flash(
													'error',
													process.env.STORE_REG_ERROR
												);
												return res.redirect(
													'/auth/join'
												);
											}
										);
									}
									done(err, store);
								}
							);
						}
						// Otherwise add Store to DB
						else {
							console.log('BODY', req.body);
							// Store Address
							const address =
								req.body.street +
								', ' +
								req.body.city +
								', ' +
								req.body.state +
								' ' +
								req.body.zip;
							// Store Hours
							const hours = [];
							if (!req.body['24hours']) {
								const days = [
									'Sun',
									'Mon',
									'Tues',
									'Wed',
									'Thur',
									'Fri',
									'Sat',
								];

								for (let i = 0; i < days.length; i++) {
									const curr = req.body[days[i]];
									console.log(curr);
									if (curr) {
										hours.push({
											day: days[i],
											open: curr[0] + ' ' + curr[1],
											close: curr[2] + ' ' + curr[3],
										});
									} else {
										hours.push({ day: days[i] });
									}
								}
							} else {
								hours.push('Open 24/7');
							}

							// Check if Store already exists in DB with that address
							Store.findOne({ address }, (err, store) => {
								// Handle Error
								if (err) {
									// Delete Vendor
									Vendor.deleteOne(
										{ _id: req.user._id },
										(err) => {
											console.log(err);
											req.flash(
												'error',
												process.env.STORE_REG_ERROR
											);
											return res.redirect('/auth/join');
										}
									);
								}
								// Handle Store Exists
								if (store) {
									// Delete Vendor
									Vendor.deleteOne(
										{ _id: req.user._id },
										(err) => {
											console.log(err);
											req.flash(
												'error',
												process.env.STORE_REG_EXISTS
											);
											return res.redirect('/auth/join');
										}
									);
								}
								// New Store Object
								const newStore = new Store({
									partition: process.env.DB_PARTITION,
									address: address,
									details: [newDetails._id],
									forum: [],
									hours: hours,
									links: [],
									name: req.body.name,
									phone: req.body.storePhone,
									url: req.body.url,
									vendor: req.user._id,
								});
								// Save Store to DB
								newStore.save((err) => {
									done(err, newStore);
								});
							});
						}
					},
					function (store, done, err) {
						// Email team members when a Vendor joins
						const admins = [
							'gabriel.low@captracks.com',
							'ben.shor@captracks.com',
							'rena@captracks.com',
						];
						const adminMailOptions = {
							from: 'rena@captracks.com',
							to: admins,
							subject: emails[2].subject,
							text:
								emails[3].text[0] +
								req.body.firstName +
								' ' +
								req.body.lastName +
								emails[3].text[1] +
								store.name +
								emails[3].text[2] +
								store.address +
								emails[3].text[3] +
								req.body.survey1 +
								emails[3].text[4] +
								req.body.survey2 +
								emails[3].text[5] +
								req.body.reg +
								emails[3].text[6] +
								req.body.max,
						};
						// smtpTransport.sendMail(adminMailOptions, (err) => {
						// 	// Handle Error
						// 	if (err) {
						// 		return next(err);
						// 	}
						// 	next();
						// });

						// // Confirmation email to Vendor
						// const mailOptions = {
						// 	to: req.body.email,
						// 	from: 'noreply@captracks.com',
						// 	subject: emails[3].subject,
						// 	text:
						// 		emails[3].text[0] +
						// 		'https://' +
						// 		req.headers.host +
						// 		'/account' +
						// 		emails[3].text[1],
						// };
						// smtpTransport.sendMail(mailOptions, (err) => {
						// 	// Handle Error
						// 	if (err) {
						// 		return next(err);
						// 	}
						done(err);
						// });
					},
				],
				function (err) {
					// Handle Error
					if (err) {
						return next(err);
					}
					res.redirect('/account');
				}
			);
		}
	);

	// ==================== LOGOUT (GET) ==================== //
	router.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			// Handle Error
			if (err) {
				req.flash('error', process.env.STORE_REG_ERROR);
				return res.redirect('/account');
			}
			req.logout();
			res.redirect('/');
		});
	});

	return router;
};
