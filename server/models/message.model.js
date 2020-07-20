const mongoose = require('mongoose');
const { ObjectID } = require('mongodb');

// MESSAGES SCHEMA
const messageSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdOn: { type: Date, required: true },
});

module.exports = mongoose.model('messages', messageSchema, 'messages');
