//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
const session = require('express-session');
const bodyParser = require('body-parser');
const {
  check,
  validationResult
} = require('express-validator');
//DBs used
var reviewsDB = require("../../models/Database/ReviewsDB")
var MeetupsDB = require("../../models/Database/MeetupsDB.js");
var UserDB = require("../../models/Database/UserDB.js");
//instantiate DBs
var meetups = new MeetupsDB();
var reviews = new reviewsDB();
var users = new UserDB();
//use session and body parser
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
  extended: true
}));
//render the create connection page
router.get('/Review/:meetingId', function (req, res) {
  if (req.session.userId) {
    meetups.getMeetupById(req.params.meetingId).exec((err,meeting)=>{
      var isMember = false;
      console.log(meeting, "MEETING");
      if(meeting){
      for(var x = 0; x< meeting.Members.length;x++){
        if((meeting.Members[x].handle === req.session.handle) && meeting.Members[x].role != "Host" ){
            isMember = true;
        }
      }
      if(isMember){
        res.render('UserLoggedIn/LeaveAReview', {
          qs: req.query,
          session: req.session,
          meeting:meeting
        });
      }
      else{
        res.redirect("/Home");
      }
    } else{
      res.redirect("/Home");
    }
    })
  } else {
    res.redirect('/login?error=Session%20Ended');
  }

});

router.get('/FeedbackLeft', function (req, res) {
  if (req.session.userId) {
    res.render('UserLoggedIn/FeedbackLeft', {
      session: req.session,
    });
  } else {
    res.redirect('/login?error=Session%20Ended');
  }

});
//review post route
router.post('/LeaveAReview', function (req, res) {
  reviews.addReview(req.session.handle, req.session.img, req.body.tutor, req.body.course, req.body.star, req.body.message)
  .then(function(){
    users.leftReview(req.session.handle, req.body.connectionID);
    meetups.updateLeftReview(req.body.connectionID);
    res.redirect("/FeedbackLeft");
  })
});


module.exports = router;