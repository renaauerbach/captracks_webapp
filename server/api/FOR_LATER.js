// ===== AUTH ===== //
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//     to: 'test@example.com',
//     from: 'noreplay@captracks.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);


// ===== VENDOR ===== //

// ==================== VENDOR PROFILE (GET) ==================== //
// router.get('/profile', (req, res) => {
//     // Check Vendor Authentication
//     if (req.isAuthenticated()) {
//         res.render('account', {
//             layout: 'layout',
//             vendor: req.user,
//             title: 'My Profile',
//              user: true,     // Dynamic since already checked for authentication
//         });
//     }
//     // Not Authenticated --> back to Login
//     else {
//         return res.redirect('/login');
//     }
// });

// ==================== ACCOUNT SETTINGS (GET) ==================== //
// router.get('/settings', (req, res) => {
// Check Vendor Authentication
//     if (req.isAuthenticated()) {
//      Store.find({ vendor: req.user._id }).populate({ path: "store.details", populate: "details" }).exec((err, store) => {
//             if (err) {
//                 return res.status(400).json({ success: false, error: err });
//             }
//             res.render('account', {
//                 layout: 'layout',
//                 vendor: req.user,
//                 store: store[0],
//                 title: 'Settings',
//                 user: true,     // Dynamic since already checked for authentication
//             });
//         });
//     }
// Not Authenticated --> back to Login
//     else {
//         res.redirect('/login');
//     }
// });

// ==================== DELETE VENDOR ACCOUNT (POST) ==================== //
// router.post('/:id', (req, res) => {
//     if (req.isAuthenticated()) {
//         Vendor.findByIdAndRemove(req.user._id, err => {
//             if (err) {
//                 res.status(400).json({ success: false, error: err });
//             }
//             res.status(200).json({ success: true });
//             console.log('Vendor account deleted successfully!');
//         });
//     }
// // TODO: MAKE SURE USER IS ALSO LOGGED OUT
//     res.redirect('/login');
// });