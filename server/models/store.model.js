const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

// STORE SCHEMA
const storeSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true},
    url: { type: String, required: true},
    hours: { type: Array },
    forum: { type: Array },
    vendor: { type: ObjectID },
    details: { type: Array },
});

module.exports = mongoose.model('stores', storeSchema, 'stores');
