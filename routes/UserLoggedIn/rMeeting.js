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
const MeetupsDB = require('../../models/Database/MeetupsDB.js');
//classes
const DateFunctions = require('../../models/classes/DateFunctions.js');
//instantiate DBs
var meetups = new MeetupsDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//register the session and use bodyParser
router.use(bodyParser.json());
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
router.get('/meeting/:meetingId', function (req, res) {
  meetups.getMeetupById(req.params.meetingId)
    .then(function (data) {
      //check if current user is a member of the meeting
      var inMeeting = false;
      for (x in data.Members) {
        if (data.Members[x].handle === req.session.handle) {
          inMeeting = true;
        }
      }
      if (req.session.userId) {
        var timeStampArr = [];
        var members = data.Members;
        var foundMemberHandles = [];
        if (inMeeting) {
          //get the handle's most recent timestamp by looping backward through timestamp array
          for (var x = data.TimeStamps.length - 1; x >= 0; x--) {
            if (timeStampArr.length === data.Members.length) {
              break;
            }
            for (i in members) {
              if ((members[i].handle === data.TimeStamps[x].handle) && foundMemberHandles.indexOf(members[i].handle) === -1) {
                var tempArr = [data.TimeStamps[x].handle, members[i].image, data.TimeStamps[x].time, data.TimeStamps[x].type];
                timeStampArr.push(tempArr);
                foundMemberHandles.push(data.TimeStamps[x].handle);
                break;
              }
            }
          }
          res.render('UserLoggedIn/ZoomMeeting', {
            session: req.session,
            qs: req.query,
            params: req.params,
            meeting: data,
            timeStampArr: timeStampArr,
            formatDate: dateFunctions.displayDate,
            formatTime: dateFunctions.formatTimeFromDate
          });
        } else {
          res.redirect("/Home")
        }
      } else {
        res.redirect('/login?error=Session%20Ended')
      }
    })
    .catch(function(){
      res.redirect("/Home");
    })

});
//join meeting
router.post('/meeting/joinMeeting',
  check('meetingId').isString().trim().escape(),
  check('status').isString().trim().escape(),
  check('time').trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/Home');
    }
    //add join timestamp
    meetups.addTimeStamp(req.body.meetingId)
      .then(function (meetup) {
        meetup.TimeStamps.push({
          type: req.body.status,
          handle: req.session.handle,
          time: req.body.time,
          image: req.session.img
        });
        meetup.save()
          .then(function (data) {
            res.status(202).json({
              handle: req.session.handle,
              image: req.session.img,
              status: data.TimeStamps[data.TimeStamps.length - 1].type,
              time: dateFunctions.formatTimeFromDate(new Date(data.TimeStamps[data.TimeStamps.length - 1].time))

            }).end();
          })
      })
      .catch(function (err) {
        console.log(err)
      })
  });
//leave meeting
router.post('/meeting/leaveMeeting',
  check('meetingId').isString().trim().escape(),
  check('status').isString().trim().escape(),
  check('time').trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/Home');
    }
    meetups.addTimeStamp(req.body.meetingId)
      .then(function (meetup) {
        meetup.TimeStamps.push({
          type: req.body.status,
          handle: req.session.handle,
          time: req.body.time,
          image: req.session.img
        });
        meetup.save()
          .then(function (data) {
            res.status(202).json({
              handle: req.session.handle,
              image: req.session.img,
              status: data.TimeStamps[data.TimeStamps.length - 1].type,
              time: dateFunctions.formatTimeFromDate(new Date(data.TimeStamps[data.TimeStamps.length - 1].time))

            }).end();
          })
      })
      .catch(function (err) {
        console.log(err)
      })
  });

module.exports = router;