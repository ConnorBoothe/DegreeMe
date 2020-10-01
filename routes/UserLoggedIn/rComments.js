//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var unirest = require('unirest');
const {
    check,
    validationResult
} = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_KEY);
//DBs used
const TimelineDB = require("../../models/Database/TimeLineDB");
//classes used
var DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes
var dateFunctions = new DateFunctions();
//instantiate DBs for us
var timeline = new TimelineDB();

//use session and bodyParser 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
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
//render the checkout page
router.get('/post/:timelineId', function (req, res) {
    if (req.session.userId) {
        console.log(req.session)
        timeline.getTimelineById(req.params.timelineId)
            .then(function (post) {
                console.log("POST", post[0])
                res.render('UserLoggedIn/Comments', {
                    session: req.session,
                    post: post[0],
                });
            })
            .catch(function (err) {
                console.log(err)
                res.redirect("/home")
            })
    }
    else{
        res.redirect("/home");
    }
                
});




module.exports = router;