const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

// MANAGER SCHEMA
const managerSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model('managers', managerSchema, 'managers');
