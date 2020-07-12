const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { ObjectID } = require('mongodb');

// MESSAGES SCHEMA
const messageSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdOn: { type: Date, required: true },
});

// DETAILS SCHEMA
const detailsSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    capacity: { type: Number, required: true },
    waitTime: { type: Number, required: true },
    createdOn: { type: Date, required: true },
});

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

// STORE SCHEMA
const storeSchema = new mongoose.Schema({
    id: { type: ObjectID, require: true },
    partition: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    forum: { type: [{ messageSchema }] },
    manager: { type: managerSchema },
    details: { type: [{ detailsSchema }] },
});

// Connect to MongoDB
let uri;
if (process.env.NODE_ENV === 'PRODUCTION') {
    const data = fs.readFileSync(path.join(__dirname, '../../config.json'));
    const conf = JSON.parse(data);
    uri = conf.uri;
} else {
    // If NOT in PRODUCTION mode
    uri = 'mongodb://localhost/captracks';
}

mongoose.Promise = global.Promise;
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Database connected successfully`))
    .catch(err => console.log('Connection error: ', err));

module.exports = {
    Message: mongoose.model('Message', messageSchema),
    Details: mongoose.model('Details', detailsSchema),
    Manager: mongoose.model('Manager', managerSchema),
    Store: mongoose.model('Store', storeSchema),
};
