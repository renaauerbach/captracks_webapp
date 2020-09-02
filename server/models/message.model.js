const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MESSAGES SCHEMA
const messageSchema = new mongoose.Schema({
    id: { type: Schema.Types.ObjectId, require: true },
    partition: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdOn: { type: Date, required: true },
});

module.exports = mongoose.model('messages', messageSchema, 'messages');
