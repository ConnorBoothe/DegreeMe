//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
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
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
  store: new DatastoreStore({
      kind: 'express-sessions',
   
      // Optional: expire the session after this many milliseconds.
      // note: datastore does not automatically delete all expired sessions
      // you may want to run separate cleanup requests to remove expired sessions
      // 0 means do not expire
      expirationMs: 0,
   
      dataset: new Datastore({
   
        // For convenience, @google-cloud/datastore automatically looks for the
        // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
        // project ID here:
        projectId: process.env.GCLOUD_PROJECT,
   
        // For convenience, @google-cloud/datastore automatically looks for the
        // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
        // explicitly pass in that path to your key file here:
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
      })
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
router.get('/AcceptedBid/:bidId', function (req, res) {
    acceptedBids.getAcceptedBidByById(req.params.bidId).exec((err, docs)=>{
        if(docs){
            res.render("UserLoggedIn/displaySingleAcceptedBid",{
                session: req.session,
                acceptedBid: docs,
                formatDate: dateFunctions.displayDate
            });
        }
        else{
            res.redirect("/Home");
        }
        
    })
});
module.exports = router;