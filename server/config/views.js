// ===== Modules ===== //
const path = require('path');
const hbs = require('hbs');

module.exports = function(app) {

    // Hbs (Handlebars) - view engine
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'hbs');

    // Register Hbs Partials
    hbs.registerPartials(path.join(__dirname, '../views/partials'));

    // ===== Hbs Helper Functions ===== //
    // Check if val is odd
    hbs.registerHelper('ifOdd', val => {
        return val % 2 === 0 ? false : true;
    });
    // Check if val is even
    hbs.registerHelper('ifEven', val => {
        return val % 2 === 0 ? true : false;
    });
    // Convert data to stringified JSON
    hbs.registerHelper('convert', data => {
        const stringify = JSON.stringify(data)
            .split('"_id":')
            .join('"id":');
        return stringify;
    });
    // Check if val1 === val2
    hbs.registerHelper('eq', (val1, val2) => {
        return val1 === val2;
    });
    // Divide val1 / val2
    hbs.registerHelper('div', (val1, val2) => {
        return val1 / val2;
    });
    // Concatonate val1 and val2
    hbs.registerHelper('concat', (val1, val2) => {
        return val1 + val2;
    });
    // Get length of obj
    hbs.registerHelper('len', obj => {
        return Object.keys(obj).length;
    });
};