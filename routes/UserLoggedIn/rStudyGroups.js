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
const StudyGroupMeetupsDB = require('../../models/Database/StudyGroupMeetupsDB');
const MessagesDB = require('../../models/Database/MessagesDB');
//instantiate DBs
var users = new userDB();
var timeline = new TimelineDB();
var notifications = new NotificationDB();
var studyGroups = new StudyGroupDB();
var studyGroupMeetups = new StudyGroupMeetupsDB();
var messages = new MessagesDB();
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
  cookie: { secure: true,
      maxAge:  6*60*60*1000 },
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
      if (result[0] != null) {} else {
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
                res.send("An error occurred");
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
          studyGroups.addStudentAttending(req.body.id, req.session.handle, req.session.img, function (suc) {
            studyGroups.getStudyGroupById(req.body.id)
              .then(function (data) {
              
                //add the user to the message thread
                messages.addUserToThread(data[0].MessageId, [req.session.handle, req.session.img]);
                //addThread(host, hostImg, subject, threadId, handle)
                messages.getConversation(data[0].MessageId).then(function(data){
                  users.addThread(data.host, data.hostImg, data.subject, data._id, req.session.handle)
                })
               
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
          .then(function(data){
            messages.leaveThread(data[0].MessageId, req.session.handle);
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
  check('course').isString().trim().escape(),
  check('professor').isString().trim().escape(),
  check('groupName').isString().trim().escape(),
  check('groupDescription').isString().trim().escape(),
  check('groupImage').isString().trim(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    studyGroups.getGroupNames().then(function(data){
      var groupNameExists = false;
      for(x in data){
        if(data[x].GroupName == req.body.groupName){
          groupNameExists = true;
        }
      }
      if(groupNameExists){
        res.status(202).json({
          action: "Group Name Exists"
        }).end();
      }
      else{
        messages.newThread(req.session.handle, req.session.img, [[req.session.handle, req.session.img]], new Date(), req.body.groupName + " Group Chat")
        .then(function(data){
          
          users.addThread(req.session.handle, req.session.img, data.subject, data._id, req.session.handle);
          studyGroups.addStudyGroup(req.session.userId, req.session.handle, req.session.name, req.session.img, req.body.course, "fake ID", req.body.professor,
          req.session.school, req.body.groupName, req.body.groupDescription, req.body.groupImage, data._id)
        .then(function (data) {
          //addTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse,url){
          timeline.addGroupTimelinePost(req.session.handle, req.session.handle, req.session.name, "Study Group", req.session.img, "New group created: " + req.body.groupName, new Date(), req.body.groupName,
            req.body.professor, req.body.course, data._id);
          users.addStudyGroup(req.session.handle, data._id, req.body.groupName, data.Subject);
          //add group message thread here
          //newThread(host, hostImg, userHandles, datetime, subject)
         
          res.status(202).json({
            action: "added group",
            groupId:data._id
          }).end();
        })
      })
      .catch(function (err) {
        console.log(err)
        console.log("An Error Occurred");
      })
      }
    
    })
  })
// router.post("/StudyGroup",
//   check('course').isString().trim().escape(),
//   check('professor').isString().trim().escape(),
//   check('groupName').isString().trim().escape(),
//   check('groupDescription').isString().trim().escape(),
//   check('groupImage').isString().trim(),
//   function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.redirect('/home');
//     }
//     studyGroups.addStudyGroup(req.session.userId, req.session.handle, req.session.name, req.session.img, req.body.course, "fake ID", req.body.professor,
//         req.session.school, req.body.groupName, req.body.groupDescription, req.body.groupImage)
//       .then(function (data) {
//         //addTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse,url){
//         timeline.addGroupTimelinePost(req.session.handle, req.session.handle, req.session.name, "Study Group", req.session.img, "New group created: " + req.body.groupName, new Date(), req.body.groupName,
//           req.body.professor, req.body.course, data._id);
//         users.addStudyGroup(req.session.handle, data._id, req.body.groupName, data.Subject);
//         setTimeout(function () {
//           res.redirect("/home?status=Study%20Group%20Created");
//         }, 100);
//       })
//       .catch(function (err) {
//         console.log(err)
//         console.log("An Error Occurred");
//       })
//   })
router.post("/meetup/addStudyGroupMeetup",
  check('sessionId').isString().trim().escape(),
  check('handle').isString().trim().escape(),
  check('image').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    studyGroupMeetups.addAttendee(req.body.sessionId, req.body.handle, req.body.image, function () {
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
    for(x in splitEmails){
      if(splitEmails[x] != ""){
        toEmails.push({"email": splitEmails[x]});
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
      if (res.error){
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