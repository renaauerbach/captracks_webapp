// ===== Modules ===== //
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// STORE SCHEMA
const storeSchema = new Schema({
	id: { type: Schema.Types.ObjectId, require: true },
	partition: { type: String, required: true },
	name: { type: String, required: true },
	address: { type: String, required: true },
	phone: { type: String, required: true },
	url: { type: String },
	hours: [
		{
			day: { type: String },
			open: { type: String },
			close: { type: String },
		},
	],
	twenty_four: { type: Boolean, required: true },
	forum: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
	vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
	details: [{ type: Schema.Types.ObjectId, ref: 'Details' }],
	links: [{ type: Object }],
});

module.exports = mongoose.model('stores', storeSchema, 'stores');
