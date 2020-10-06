// ===== Modules ===== //
const mongoose = require('mongoose');

// Connect to MongoDB
let uri;
// process.env.NODE_ENV = 'PRODUCTION';
if (process.env.NODE_ENV === 'PRODUCTION') {
    uri = process.env.DB_PROD_URI;
}
else {
    // Users 
    uri = process.env.DB_URI;
}

mongoose.Promise = global.Promise;
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Connection error: ', err));
