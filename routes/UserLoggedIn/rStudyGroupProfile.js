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
const UserDB = require('../../models/Database/UserDB.js');
const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const StudyGroupMeetupDB = require('../../models/Database/StudyGroupMeetupsDB.js');
const TimelineDB = require('../../models/Database/TimeLineDB.js');
//classes used
const DateFunctions = require("../../models/classes/DateFunctions");
//instantiate DBs
var users = new UserDB();
var studyGroups = new StudyGroupDB();
var studyGroupMeetups = new StudyGroupMeetupDB();
var timeline = new TimelineDB();
//instantiate classes
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

//render the tutor page
router.get('/Group/:GroupId', function (req, res) {
  if (req.session.userId) {
    var qs = req.query;
    studyGroups.getStudyGroupById(req.params.GroupId).exec((err, docs) => {
      if(docs){
        studyGroups.getStudyGroupById(req.params.GroupId).exec((err, docs2) => {
          if (err) {
            console.log(err)
            res.redirect("/Group/" + req.params.GroupId);
          } else {
            var members = [];
            var memberCount = 0;
            new Promise((resolve, reject) => {
                if (docs2[0].Members.length === 0) {
                  resolve();
                } else {
                  for (x in docs2[0].Members) {
                    memberCount++;
                    users.getUserByHandle(docs2[0].Members[x].MemberHandle).exec((err, docs3) => {
                      users.isFollowing(req.session.handle, docs3[0], null, function (obj, folstat) {
                        members.push([{
                          handle: docs3[0].handle,
                          image: docs3[0].img
                        }, folstat])
                        if (members.length == memberCount) {
                          resolve(members);
                        }
                      })
                    })
                  }
                }
              }).then(function (members) {
                studyGroupMeetups.getMeetupsByGroupId(req.params.GroupId).exec((err, docs1) => {
                  if (err) {
                    console.log(err)
                    res.redirect("/Group/" + req.params.GroupId);
                  } else {
                    res.render('UserLoggedIn/StudyGroupProfile', {
                      qs: req.query,
                      session: req.session,
                      params: req.params,
                      studyGroup: docs[0],
                      meetups: docs1,
                      memberCount: memberCount,
                      members: members,
                      formatDate: dateFunctions.displayDate,
                      formatTime: dateFunctions.formatTime
                    });
                  }
                });
              })
              .catch(function (err) {
                console.log(err)
              })
          }
        });
      }
      else{
        res.redirect("/Home")
      }
    });
  } else {
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
  }
});
//Create new study group meetup
router.post('/Group/createMeetup',
  check('groupName').isString().trim().escape(),
  check('groupId').isString().trim().escape(),
  check('type').isString().trim().escape(),
  check('date').trim().escape(),
  check('time').isString().trim().escape(),
  check('building').isString().trim().escape(),
  check('room').isString().trim().escape(),
  check('description').isString().trim().escape(),
  check('zoomLink').isString().trim(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/Home');
    }
    studyGroupMeetups.addMeetup(req.body.groupName, req.session.handle, req.body.groupId, req.body.type, req.body.date, req.body.time,
        req.body.building, req.body.room, req.body.description, req.body.courseName, req.body.zoomLink, req.session.handle, req.session.img).then(function (data) {
        users.addMeetup(req.session.handle, data._id, req.body.description, req.body.date, "Study Group");
        timeline.addMeetupPost(req.session.handle, req.session.handle, req.session.name, "Study Group Meetup", req.session.img, "Caption", new Date(), req.body.description, "Group Name",
          data._id);
      })
      .catch(function (error) {
        console.log(error)
        res.redirect("/Group/" + req.body.groupId);
      })
      .then(function () {
        res.redirect("/Group/" + req.body.groupId)
      })
      .catch(function (error) {
        res.redirect("/Group/" + req.body.groupId);
      })

  });
router.post("/attendStudyGroup",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/Home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          studyGroupMeetups.addAttendee(req.body.id, req.session.handle, req.session.img, function (suc) {
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
        .catch(function (err) {
          res.status(500).json({
            err: err
          }).end();
        });
    } else {
      res.redirect('/login?error=Session%20Ended');
    }
  })
router.post("/leaveStudyGroup",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/Home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          studyGroupMeetups.removeAttendee(req.body.id, req.session.handle, function (suc) {
            if (suc) {
              resolve();
            } else {
              reject();
            }
          });

        }).then(function () {
          res.status(202).json({
            action: "leave"
          }).end();
        })
        .catch(function () {
          res.status(500).json({
            err: "something broke in leave"
          }).end();
        });
    } else {
      res.redirect('/login?error=Session%20Ended');
    }
  })
module.exports = router;