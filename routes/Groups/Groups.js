//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
var unirest = require('unirest');

const {
  check,
  validationResult
} = require('express-validator');
//DBs used
const userDB = require('../../models/Database/UserDB');
const StudyGroupDB = require('../../models/Database/StudyGroupsDB');
const TimelineDB = require('../../models/Database/TimeLineDB');
const NotificationDB = require('../../models/Database/NotificationDB');
const GroupMeetups = require('../../models/Database/GroupMeetups');
const Threads = require('../../models/Database/Threads');
//instantiate DBs
var users = new userDB();
var timeline = new TimelineDB();
var notifications = new NotificationDB();
var studyGroups = new StudyGroupDB();
var meetups = new GroupMeetups();
var threads = new Threads();
//use body parser and session
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 6 * 60 * 60 * 1000
  },
}));
//render the Find Group page
router.get('/groups', function (req, res) {
  var i = 0;
  if (req.session.userId) {
    new Promise((resolve, reject) => {
      if (typeof req.query.searchInput !== 'undefined') {
        //if checkbox = blank do this
        studyGroups.getStudyGroupByCourse(req.query.searchInput).exec((err, doks1) => {
          if (doks1.length !== 0) {
            resolve([err, doks1.splice(0, 20)]);
          } else {
            res.redirect('/groups');
            // noResults = true;
          }
        })
      } else {
        studyGroups.getAllStudyGroups().exec((err, doks1) => {
          //doks1
          resolve([err, doks1.splice(0, 20)]);
        })
      }
    }).then(function (result) {
      if (result[0] != null) { } else {
        var docs1 = result[1]
        if (docs1.length > 0) {
          users.getUserByEmail(req.session.email).exec((err, docs2) => {
            new Promise((resolve, reject) => {
              var myCourses = [];
              for (x in docs2[0].myCourses) {
                myCourses.push(docs2[0].myCourses[x].courseCode);
              }
              myCourses.sort();
              if (err) {
                res.json("An error occurred");
              }
              var finalArr = [];
              for (x in myCourses) {
                var containsResults = false;
                var groupsArr = [];
                var subject = myCourses[x];
                for (i in docs1) {
                  if (myCourses[x] === docs1[i].Subject) {
                    containsResults = true;
                    groupsArr.push(docs1[i]);
                  }
                }
                var obj = [];
                obj.push(subject);
                obj.push(groupsArr);
                finalArr.push(obj);
              }
              resolve(finalArr);
            }).then(function (docs3) {
              subjects = [];
              subjCount = 0;
              new Promise((resolve, reject) => {
                for (i in docs3) {
                  subjCount++;
                  groups = [];
                  groupCount = 0;
                  if (docs3[i][1].length == 0) {
                    groups.push([null, null])
                    subjects.push([docs3[i][0], groups])
                  } else {
                    for (j in docs3[i][1]) {
                      groupCount++;
                      memstat = false;
                      for (k in docs3[i][1][j].Members) {
                        if (docs3[i][1][j].Members[k].MemberHandle === req.session.handle) {
                          memstat = true;
                        }
                      }
                      groups.push([docs3[i][1][j], memstat]);
                      if (docs3[i][1].length == groups.length) {
                        subjects.push([docs3[i][0], groups]);
                      }
                    }
                  }
                }
                resolve(subjects);
              }).then((groups) => {
                if (groups.length > 0) {
                  res.render('UserLoggedIn/FindStudyGroups_New', {
                    qs: req.query,
                    session: req.session,
                    qs: req.query,
                    groupName: req.query.searchInput,
                    StudyGroups: groups
                  })
                } else {
                  //this is where you'll render the new file
                  res.render('UserLoggedIn/emptyStudyGroup', {
                    qs: req.query,
                    session: req.session,
                    qs: req.query,
                    groupName: req.query.searchInput,
                    StudyGroups: groups
                  })
                }
              }).catch(function (err) {
                console.log(err);
              });
            })

          })
        } else {
          // This crashes the page when docs == 0
          res.render('UserLoggedIn/emptyStudyGroup', {
            qs: req.query,
            session: req.session,
            qs: req.query,
            // major: searchMajor,
            StudyGroups: []
          });
        }
      }
    })
  } else {
    res.redirect('/login?message=Session%20Ended');
  }

});

//render the Create Group page
router.get('/startAGroup', function (req, res) {
  if (req.session.userId) {
    res.render('UserLoggedIn/StudyGroups', {
      qs: req.query,
      session: req.session,
      qs: req.query,
    });

  } else {
    res.redirect('/login?message=Session%20Ended');
  }
});

router.post("/join",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
        studyGroups.addMember(req.body.id, req.session.handle, req.session.img, "Accepted", function (suc) {
          studyGroups.getStudyGroupById(req.body.id)
            .then(function (data) {
              for (x in data[0].Members) {
                notifications.addNotification(data[0].Members[x].MemberHandle, req.session.handle, "Joined " + data[0].GroupName, req.session.img, "/user/" + req.session.handle);
                users.incrementNotificationCount(data[0].Members[x].MemberHandle);
              }
            })
          if (suc) {
            resolve();
          } else {
            reject();
          }
        });

      }).then(function () {
        res.status(202).json({
          action: "join"
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
router.post("/unjoin",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
        studyGroups.removeStudentAttending(req.body.id, req.session.handle, function (suc) {
          //notifications.addNotification(req.session.userId, req.session.name, "Joined Study Group", function (existed) { });
          if (suc) {
            resolve();
          } else {
            reject();
          }
        });

      }).then(function () {
        studyGroups.getStudyGroupById(req.body.id)
          .then(function (data) {
            //must leave all threads
            threads.leaveThread(data[0].MessageId, req.session.handle);
            users.removeThread(req.session.handle, data[0].MessageId);
          })
        res.status(202).json({
          action: "removed"
        }).end();
      })
        .catch(function () {
          res.status(500).json({
            err: "something broke in unjoin"
          }).end();
        });
    } else {
      res.redirect('/login?message=Session%20Ended');
    }
  })
router.post("/createGroup",
  check('groupName').isString().trim().escape(),
  check('course').isString().trim(),
  function (req, res) {
    studyGroups.isGroupNameTaken(req.body.createGroupName)
      .then(function (isTaken) {
        if (isTaken) {
          res.status(202).json({
            action: "Group Name Exists"
          }).end();
        }
        else {
          var private = false;
          if (req.body.private == 1) {
            private = true
          }
          const defaultBannerImages = [
            "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/bannerImages%2FdefaultBanners%2Fblue-banner-100.jpg?alt=media&token=bedb39b0-e4ff-4163-966e-7271ee09fc31",
            "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/bannerImages%2FdefaultBanners%2Fgreen-banner-100.jpg?alt=media&token=1214b48a-e0ac-4f70-8b08-d87bdb353474",
            "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/bannerImages%2FdefaultBanners%2Fred-banner-100.jpg?alt=media&token=82fc4889-206e-4019-89bb-5a8ae4aa9f42",
            "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/bannerImages%2FdefaultBanners%2Fred-banner-100.jpg?alt=media&token=82fc4889-206e-4019-89bb-5a8ae4aa9f42",
          ];
          //generate random banner image
          var randomInt = Math.floor(Math.random() * Math.floor(4));
          var bannerImg = defaultBannerImages[randomInt];
          studyGroups.addStudyGroup(req.session.userId, req.session.handle, req.session.name,
            req.session.img, req.session.school, req.body.createGroupName, req.session.img, bannerImg, private)
            .then(function (data) {
              //addTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse,url){
              timeline.addGroupTimelinePost(req.session.handle, req.session.handle, req.session.name, "Study Group", req.session.img, "New group created: " + req.body.groupName, new Date(), req.body.groupName,
                req.body.professor, req.body.course, data._id)
                .then(() => {
                  users.addStudyGroup(req.session.handle, data._id,
                    req.body.createGroupName, data.Subject)
                    .then(() => {
                      res.status(202).json({
                        action: "added group",
                        groupId: data._id,
                        groupName: data.GroupName,
                        groupImage: data.GroupImage
                      }).end();
                    })
                })
            })
            .catch(function (err) {
              console.log(err)
              console.log("An Error Occurred");
            })
        }
      })
  })

//add a Group Meetup
router.post("/meetup/addStudyGroupMeetup",
  check('sessionId').isString().trim().escape(),
  check('handle').isString().trim().escape(),
  check('image').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    meetups.addAttendee(req.body.sessionId, req.body.handle, req.body.image, function () {
      users.addMeetup(req.session.handle, req.body.sessionId, req.body.meetupName, req.body.date, req.body.meetupType);
    });
    res.redirect("/home");
  })

router.post("/sendEmailInvite",
  check('emails').isArray().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

    }
    console.log("Group Name", req.body.groupName)
    var splitEmails = req.body.emails.split(",");
    console.log(splitEmails)
    var toEmails = [];
    for (x in splitEmails) {
      if (splitEmails[x] != "") {
        toEmails.push({ "email": splitEmails[x] });
      }
    }
    var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

    mail.headers({
      "content-type": "application/json",
      "authorization": process.env.SENDGRID_API_KEY,
    });
    mail.type("json");
    mail.send({
      "personalizations": [
        {
          "to": toEmails,
          "dynamic_template_data": {
            "subject": "Group Invitation",
            "name": req.session.name,
            "group": req.body.groupName,
            "group_id": req.body.groupId,

          },
          "subject": " "
        }
      ],
      "from": {
        "email": "notifications@degreeme.io",
        "name": "DegreeMe"
      },
      "reply_to": {
        "email": "noreply@degreeme.io",
        "name": "No Reply"
      },
      "template_id": "d-000856c6896f43c88bf5ad54eb98ba9d"
    });
    mail.end(function (res) {
      if (res.error) {
        console.log("this is the error for inviting someone to join group", res.error);
        console.log(res.body);
        // throw new Error(res.error);
      } else if (res.accepted) {
        console.log("email has sent for inviting someone to join group");
      }
    });

    console.log("EMAIL INVITE RAN")
  })
module.exports = router;