const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const jwtStrategy   = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

const partition = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../config/db.config.json'))
).partition;

const jwtSecret = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../../config/auth.config.json'))
    ).secret,
    jwtAlgo = 'HS256',
    jwtExpiry = '7 days';

const Vendor = require('../../models/vendor.model');


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    Vendor.authenticate()
));
passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());
passport.use(
    new jwtStrategy(
        // Options
        {
            jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            algorithms: [jwtAlgo],
        },
        (payload, done) => {
            // Find the real vendor from our database using the `id` in the JWT
            Vendor.findById(payload.sub)
                .then(vendor => {
                    if (vendor) {
                        return done(null, vendor);
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => {
                    return done(err, false);
                });
        }
    )
);

function vendorSignJwt(req, res) {
    const vendor = req.vendor;
    jwt.sign(
        payload,
        jwtSecret,
        {
            algorithm: jwtAlgorithm,
            expiresIn: jwtExpiresIn,
            subject: vendor._id.toString(),
        },
        (err, token) => {
            if (err) {
                throw err;
            }
            return token;
        }
    );
}

module.exports = {
    passport: passport,
    vendorSignJwt: vendorSignJwt,
};
