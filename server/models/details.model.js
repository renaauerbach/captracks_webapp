// ===== Modules ===== //
const mongoose = require('mongoose');
const tz = require('moment-timezone');
const Schema = mongoose.Schema;

// DETAILS SCHEMA
const detailsSchema = new mongoose.Schema({
	id: { type: Schema.Types.ObjectId, require: true },
	partition: { type: String, required: true },
	maxCapacity: { type: Number, required: true },
	capacity: { type: Number, required: true },
	waitTime: { type: Number, required: true },
	maxRegisters: { type: Number, required: true },
	registers: { type: Number },
	updated: { type: Date, default: Date.now, offset: now.getTimezoneOffset() },
});

module.exports = mongoose.model('details', detailsSchema, 'details');
