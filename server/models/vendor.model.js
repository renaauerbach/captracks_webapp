const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

// VENDOR SCHEMA
const vendorSchema = new mongoose.Schema({
	id: { type: ObjectID, require: true },
	partition: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	password: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	phone: { type: String, required: true },
	email: { type: String, required: true },
});

// vendorSchema.plugin(passportLocalMongoose, {
// 	usernameField: 'email', // Use email (not 'username' default)
// 	usernameLowerCase: true, // Make all emails lowercase
// 	session: false, // Disable sessions - using JWTs
// });

module.exports = mongoose.model('vendors', vendorSchema);
