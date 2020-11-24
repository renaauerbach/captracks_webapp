// ===== Modules ===== //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// VENDOR SCHEMA
const vendorSchema = new Schema({
	id: { type: Schema.Types.ObjectId, require: true },
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
	session: { type: String },
	resetPasswordToken: String,
	resetPasswordExpires: Date
});

module.exports = mongoose.model('vendors', vendorSchema, 'vendors');
