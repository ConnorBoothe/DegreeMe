//packages used
const express = require('express');
const router = express.Router();
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
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the meetup profile page
router.get('/meetup/:MeetupId', function (req, res) {
    console.log("Meetup Profile")
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