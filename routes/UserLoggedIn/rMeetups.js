//packages used
require('dotenv').config();
const express = require('express');
const {
  check,
  validationResult
} = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);
//DBs used
const MeetupsDB = require('../../models/Database/MeetupsDB.js');
const NotificationDB = require('../../models/Database/NotificationDB');
//classes used
const DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes
var dateFunctions = new DateFunctions();
//instantiate DBs
var notifications = new NotificationDB();
var meetups = new MeetupsDB();
//use session and bodyParser
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
  saveUninitialized: true
}));
router.get('/meetups',
  function (req, res) {
    //require login for page access
    if (req.session.userId) {
      meetups.getMeetupsByHandle(req.session.handle).exec((err, docs1) => {
        var pastMeetups = [];
        console.log("Meetups: " + docs1)
        for (x in docs1) {
          if (new Date(docs1[x].date) < new Date()) {
            pastMeetups.push(docs1[x]);
          }
        }
        res.render('UserLoggedIn/ListingMeetups', {
          session: req.session,
          formatDate: dateFunctions.displayDate,
          formatTime: dateFunctions.formatTimeFromDate,
          meetups: pastMeetups,
        });
      })
    } else {
      res.redirect('/login?message=Session%20Ended');
    }
  });

router.get('/changeMeetupsViewing', function (req, res) {
  if (req.session.userId) {
    meetups.getMeetupsByHandle(req.session.handle).exec((err, docs) => {
      var returnArr = [];
      if (req.query.kind.valueOf() == "undefined".valueOf()) {
        returnArr = docs;
      } else {
        var time = new Date(Date.now())
        for (var i = 0; i < docs.length; i++) {
          var compareTime = new Date(docs[i].time);
          compareTime.setHours(compareTime.getHours() + docs[i].hours);
          if (Boolean(req.query.kind)) {
            if (compareTime.getTime() < time.getTime()) { //less than/greater than signs might need to be flipped
              returnArr.push(docs[i]);
            }
          } else {
            if (compareTime.getTime() > time.getTime()) {
              returnArr.push(docs[i]);
            }
          }
        }
      }
      res.status(202).json({
        array: docs
      }).end();
    })
  } else {
    res.redirect('/login?message=Session%20Ended');
  }
})

//commented out bc not used. Will come back and delete
// router.post('/delete', [
//     check('type').isString(),
//     check('tutor').isString()
//   ],
//   function (req, res) {
//     req.session.notificationCount++;
//     notifications.addNotification(req.session.userId, req.body.tutor, req.body.type, "tempURL");
//     meetups.removeConnection(req.body.delete, res);
//   });

//attend meeting
router.post("/attend",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          meetups.addStudentAttending(req.body.id, req.session.handle, function (suc) {
            //notifications.addNotification(req.session.userId, req.session.name, "Joined Study Group", function (existed) { });
            if (suc) {
              resolve();
            } else {
              reject();
            }
          });

        }).then(function () {
          res.status(202).json({
            action: "attend"
          }).end();
        })
        .catch(function () {
          res.status(500).json({
            err: "something broke in join"
          }).end();
        });
    } else {
      res.redirect('/login?message=Session%20Ended');
    }
  })

module.exports = router;