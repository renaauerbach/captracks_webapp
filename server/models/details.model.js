const mongoose = require('mongoose');
const { ObjectID, Double } = require('mongodb');

// DETAILS SCHEMA
const detailsSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    capacity: { type: Number, required: true },
    waitTime: { type: Number, required: true },
    registers: { type: Number, required: true },
    createdOn: { type: Date, required: true },
});

module.exports = mongoose.model('details', detailsSchema, 'details');
