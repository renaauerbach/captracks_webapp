const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Connect to MongoDB
let uri;
process.env.NODE_ENV = 'PRODUCTION';
if (process.env.NODE_ENV === 'PRODUCTION') {
    const data = fs.readFileSync(path.join(__dirname, './config/db.config.json'));
    const conf = JSON.parse(data);
    uri = conf.uri;
} else {
    // If NOT in PRODUCTION mode
    // uri = '"mongodb://captracks-rirqa.mongodb.net/cap_tracks';
}

mongoose.Promise = global.Promise;
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log(`Database connected successfully`))
    .catch(err => console.log('Connection error: ', err));
