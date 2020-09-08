//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
var userDB = require('../../models/Database/UserDB');
var ListingsDB = require('../../models/Database/ListingsDB');
var UserDB = require('../../models/Database/UserDB.js');
//classes used
var DateFunctions = require('../../models/classes/DateFunctions.js');
//instantiate DBs
var users = new userDB();
var listings = new ListingsDB();
var users = new UserDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//use body parser and session
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection
       }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
//render the create connection page
router.get('/editListing/:id', function (req, res) {
    if (req.session.userId) {
        listings.getListingById(req.params.id).exec((err, docs2) => {
            res.render('UserLoggedIn/EditListing', {
                qs: req.query,
                session: req.session,
                qs: req.query,
                params: req.params,
                listing: docs2[0],
                formatDate: dateFunctions.displayDate,
                formatTime: dateFunctions.formatTimeFromDate
            });
        })
    } else {
        res.redirect('/login?error=Session%20Ended');
    }
});

router.post('/editListing',
    check('listingId').isString().trim().escape(),
    check('price').isString().trim().escape(),
    check('duration').isString().trim().escape(),
    check('Schedule').isArray(),
    check('expirationDate').trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        listings.updateListing(req.body.listingId, req.body.price, req.body.duration, req.body.Schedule, req.body.expirationDate);
        res.status(202).json({
            status: "Help request sent"
        }).end();

    });
router.post('/DisabledListing',
    check('listingId').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        listings.disableListing(req.body.listingId);
        res.status(202).json({
            status: "Disabled Listing"
        }).end();
    });
router.post('/ActiveListing',
    check('listingId').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        listings.activateListing(req.body.listingId);
        res.status(202).json({
            status: "Activated Listing"
        }).end();


    });

module.exports = router;