//packages used
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
router.use(session({
  secret: 'iloveu',
  resave: true,
  saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true,
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