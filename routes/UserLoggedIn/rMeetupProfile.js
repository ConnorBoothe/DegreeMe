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
const StudyGroupMeetupDB = require('../../models/Database/StudyGroupMeetupsDB.js');
const DateFunctions = require('../../models/classes/DateFunctions.js');
//instantiate DBs used
var studyGroupMeetups = new StudyGroupMeetupDB();
var dateFunctions = new DateFunctions();
//use session and bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
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
//render the meetup profile page
router.get('/meetup/:MeetupId', function (req, res) {
    if (req.session.userId) {
        studyGroupMeetups.getMeetupById(req.params.MeetupId).exec((err, docs) => {
            var memberCount = 0;
            for (x in docs[0].Attendees) {
                memberCount++;
            }
           
            res.render('UserLoggedIn/MeetupProfile', {
                qs: req.query,
                session: req.session,
                params: req.params,
                meetup: docs[0],
                memberCount: memberCount,
                attendees: docs[0].Attendees,
                formatTime:dateFunctions.formatTimeFromDate,
                formatDate:dateFunctions.displayDate
            })
        })

    } else {
        res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
    }
});
module.exports = router;