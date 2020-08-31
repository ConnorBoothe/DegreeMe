//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const {
  check,
  validationResult
} = require('express-validator');
//DBs used
const AcceptedBidsDB = require('../../models/Database/AcceptedBidsDB.js');
//classes
const DateFunctions = require('../../models/classes/DateFunctions.js');
//instantiate DBs
var acceptedBids = new AcceptedBidsDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//register the session and use bodyParser
router.use(bodyParser.json());
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
router.get('/AcceptedBids', function (req, res) {
    acceptedBids.getAllAcceptedBids(req.session.handle).exec((err, docs)=>{
        res.render("UserLoggedIn/displayAllBids",{
            session: req.session,
            acceptedBids: docs,
            formatDate: dateFunctions.displayDate
        });
    })

});
module.exports = router;