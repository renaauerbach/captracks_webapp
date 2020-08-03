const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const passport = require('./auth.middleware');
const vendorSignJwt = require('./auth.middleware');
const Vendor = require('../../models/vendor.model'); 
const partition = JSON.parse(
	fs.readFileSync(path.join(__dirname, '../../config/db.config.json'))
).partition;
const AuthController = {};

AuthController.register = async (req, res) => {
	const { firstName, lastName, phone, email, password } = req.body;

	try {
		// Check if an account already exists with that email
		let vendor = await Vendor.findOne({
			email,
		});
		if (vendor) {
			return res
				.status(400)
				.send(
					('An account already exists with that email.')
					
				);
		}

		vendor = new Vendor({
			partition: partition,
			firstName: firstName,
			lastName: lastName,
			password: password,
			phone: phone,
			email: email,
		});

		Vendor.register(vendor, password, (err, account) => {
			if (err) {
				return res.status(500).send('An error occurred: ' + err);
			}

			passport.authenticate('local', {
				session: true,
			})(req, res, () => {
				res.status(200).send('Vendor registered successfully');
			});
		});
	} catch (err) {
		res.status(500).json({ success: false, error: err });
		console.log('Error registering vendor', err.message);
	}
};

AuthController.login = async (req, res, next) => {
    const { email, password } = req.body;

	try {
		let vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(400).send(JSON.stringify(req.flash('There is no account with that email')));
        }
		passport.authenticate(
			'local',
			{ session: true, failureFlash: 'Invalid username or password.' },
			(err, vendor, info) => {
				if (err || !vendor) {
					return res.status(400).json({
						err: err
					});
				}
				req.login(vendor, { session: true }, err => {
					if (err) {
						res.send(err);
                    }
                    const token = vendorSignJwt(req, res);
					res.status(200).json({
                        token,
                    });
                    res.cookie('jwt', token, { maxAge: jwtExpiry });
					return res.json({ vendor: vendor.username, token });
				});
			}
        )(req, res);
        res.redict()
	} catch (err) {
		res.status(500).json({ success: false, error: err });
		console.log('Error registering vendor', err);
	}
};

module.exports = AuthController;
