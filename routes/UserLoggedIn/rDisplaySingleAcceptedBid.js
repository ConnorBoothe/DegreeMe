//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require("mongoose");

var MongoStore = require('connect-mongo')(session);
const {
  check,
  validationResult
} = require('express-validator');
//DBs used
const AcceptedBidsDB = require('../../models/RecycledClasses/AcceptedBidsDB.js');
//classes
const DateFunctions = require('../../models/classes/DateFunctions.js');
//instantiate DBs
var acceptedBids = new AcceptedBidsDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//register the session and use bodyParser
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
  extended: true,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true,
      maxAge:  6*60*60*1000 },
}));
router.get('/acceptedBid/:bidId', function (req, res) {
    acceptedBids.getAcceptedBidByById(req.params.bidId).exec((err, docs)=>{
        if(docs){
            res.render("UserLoggedIn/displaySingleAcceptedBid",{
                session: req.session,
                acceptedBid: docs,
                formatDate: dateFunctions.displayDate
            });
        }
        else{
            res.redirect("/home");
        }
        
    })
});
module.exports = router;