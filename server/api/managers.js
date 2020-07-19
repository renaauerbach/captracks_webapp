const express = require('express');
const router = express.Router();

const Manager = require('../db.js').Manager;

// Handle login
// Create new manager

router.get('/register', (req, res) => {
    console.log(res.locals);
    res.render('register', {
		layout: 'layout',
		title: 'Create Account',
	});
});

router.post('/register', (req, res) => {
    console.log(res.locals);
    const newManger = new Manager({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password, //TODO: Password hashing
        phone: req.body.phone,
        email: req.body.email,
    });

    newManger.save((err, msg) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true, id: msg.id });
        console.log('Manager created successfully!');
    });

    res.redirect('/:id');

});

// Get manager by ID
router.get('/:id', (req, res) => {
    Manager.findById(req.params.id, (err, manager) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.render('account', { layout: 'layout', title: "Account", store: store });
    });
});

// Delete manager account
router.delete('/:id/delete', (req, res) => {
    Manager.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.status(400).json({ success: false, error: err });
        }
        res.status(200).json({ success: true });
        console.log('Manager account deleted successfully!');
    });
});

module.exports = router;
