// ===== Modules ===== //
const express = require('express');
const app = express();

// ===== Configuration ===== //
require('dotenv').config({ path: __dirname + '/../.env' });
require('./db.js');
require('./db-cron.js');
require('./config/environment.js')(app, express);
require('./config/routes.js')(app);
require('./config/views.js')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});

module.exports = app;