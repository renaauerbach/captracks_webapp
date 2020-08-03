const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const router = express.Router();

const AuthController = require('./auth.controller');
const partition = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/db.config.json'))).partition;

const Store = require('../../models/store.model');
const Vendor = require('../../models/vendor.model');

// Login
router.get('/login', (req, res) => {
    res.render('login', {
        layout: 'layout',
        title: 'Login',
    });
});

// Login form POST
router.post('/login', async (req, res) => {
    AuthController.login(req, res);
    // const { email, password } = req.body;
    // try {
    //     let vendor = await Vendor.findOne({ email });
    //     if (!vendor) {
    //         return res.status(400).send(JSON.stringify(req.flash('There is no account with that email')));
    //     }

    //     const isMatch = await bcrypt.compare(password, vendor.password);
    //     console.log("MATCHED: ", isMatch);

    //     if (!isMatch) {
    //         return res.status(400).send(JSON.stringify(req.flash('Incorrect password')));
    //     }

    //     const payload = {
    //         vendor: {
    //             id: vendor.id,
    //         },
    //     };

    //     jwt.sign(
    //         payload,
    //         jwtKey,
    //         {
    //             algorithm: 'HS256',
    //             expiresIn: jwtExpirySeconds,
    //         },
    //         (err, token) => {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.status(200).json({
    //                 token,
    //             });
    //             res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
    //         }
    //     );
    //     res.redirect('account/' + vendor._id);
    // } catch (err) {
    //     res.status(500).json({ success: false, error: err });
    //     console.log('Error logging in vendor', err.message);
    // }
});

// Sign up
router.get('/signup', (req, res) => {
    res.render('signup', {
        layout: 'layout',
        title: 'Sign Up',
    });
});

// New account form POST
router.post('/signup', async (req, res) => {
    AuthController.register(req, res);
    // const { firstName, lastName, phone, email, password } = req.body;
    // try {
    //     // Check if an account already exists with that email
    //     let vendor = await Vendor.findOne({
    //         email,
    //     });
    //     if (vendor) {
    //         return res.status(400).send(JSON.stringify(req.flash('An account already exists with that email.')));
    //     }
        
    //     vendor = new Vendor({
    //         partition: partition,
    //         firstName: firstName,
    //         lastName: lastName,
    //         password: password,
    //         phone: phone,
    //         email: email,
    //     });

    //     const salt = await bcrypt.genSalt(10);
    //     vendor.password = await bcrypt.hash(password, salt);

    //     await vendor.save();

    //     const payload = {
    //         vendor: {
    //             id: vendor.id,
    //         },
    //     };

    //     jwt.sign(
    //         payload,
    //         jwtKey,
    //         {
    //             algorithm: "HS256",
    //             expiresIn: jwtExpirySeconds,
    //         },
    //         (err, token) => {
    //             if (err) {
    //                 throw err;
    //             }
    //             res.status(200).json({
    //                 token,
    //             });
    //             res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
    //         }
    //     );

    //     res.redirect('/signup/' + vendor._id + '/register');

    // } catch (err) {
    //     res.status(500).json({ success: false, error: err });
    //     console.log("Error registering vendor", err);
    // }
    
    // var recipients = ['gabriel@captracks.com', 'ben@captracks.com'];
    // const data = fs.readFileSync(path.join(__dirname, './config.json'));
    // const pwd = JSON.parse(data).gmail;
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'youremail@gmail.com',
    //         pass: pwd,
    //     },
    // });

    // // Email credentials
    // recipients.forEach(email, () => {
    //     var mailOptions = {
    //         from: 'youremail@gmail.com',
    //         to: email,
    //         subject: 'A new vendor registered their store with CapTracks!',
    //         text: 'That was easy!',
    //     };

    //     transporter.sendMail(mailOptions, (err, info) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log('Email sent successfull! ' + info.response);
    //         }
    //     });
    // });
});

// Register New Store
router.get('/signup/:id/register', (req, res) => {
    
    // Get stores without assigned vendors
    Store.find({ vendor: null}, (err, stores) => {
        if (err) {
            res.status(400).send(JSON.stringify(req.flash(err)));
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

        res.render('register', {
            layout: 'layout',
            title: 'Register Store',
            stores: stores,
        });
    });
});

router.post('/signup/:id/register', async (req, res) => {
    if (req.body.existed) {
        const vendorId = req.params.id;
        console.log(req.body.existed)
        Vendor.findById(vendorId, (err, vendor) => {
            if (err) {
                return res.status(400).send(JSON.stringify(req.flash(err)));
            }
            const update = {
                vendor: vendor,
            }
            Store.findByIdAndUpdate(req.body.existed, update, (err, store) => {
                if (err) {
                    return res.status(400).send(JSON.stringify(req.flash(err)));
                }
                console.log('Store assigned successfully!');
            });
        })
        res.redirect('/account/' + vendorId);
    }
    else {
        var address = req.body.street + ", " + req.body.city + ", " + req.body.state + " " + req.body.zip;
        try {
            // Check if an store already exists with that address
            let store = await Store.findOne({
                address,
            });
            if (store) {
                return res.status(400).send(JSON.stringify(req.flash('This store is already registered in our system. Please try again or contact us for assistance.')));
            }

            var survey = [req.body.survey1, req.body.survey1];

            var hours = [];
            if (!req.body['24hours']) {
                var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

                for (let i = 0; i < days.length; i++) {
                    let curr = req.body[days[i]];
                    if (curr) {
                        hours.push({'day': days[i], 'open': curr[0] + " " + curr[1], 'close': curr[2] + " " + curr[3]});
                    }
                    else {
                        hours.push({'day': days[i]});
                    }
                }
            }
            else {
                hours.push('Open 24/7');
            }
            
            store = new Store({
                partition: partition,
                name: req.body.name,
                address: address,
                phone: req.body.phone,
                url: req.body.url,
                hours: hours,
                forum: [],
                vendor: req.body.id,
                details: [],
            });
        
            store.save((err, store) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err });
                }
                res.status(200).json({ success: true, id: store.id });
                console.log('Store added successfully!');
            });
            res.redirect('/account/' + vendorId);

        } catch (err) {
            res.status(500).send(JSON.stringify(req.flash('Error registering store')));
            console.log("Error registering vendor", err);
        } 
    }   
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
