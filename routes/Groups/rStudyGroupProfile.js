//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const {
  check,
  validationResult
} = require('express-validator');
//DBs used
const UserDB = require('../../models/Database/UserDB.js');
const StoryDB = require('../../models/Database/StoryDB.js');
const EventsDB = require('../../models/Database/EventsDB.js');

const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const GroupMeetups = require('../../models/Database/GroupMeetups.js');
const TimelineDB = require('../../models/Database/TimeLineDB.js');
const StreamDB = require('../../models/Database/StreamDB.js');

//classes used
const DateFunctions = require("../../models/classes/DateFunctions");
const { route } = require('../API/sendTutors.js');
//instantiate DBs
var users = new UserDB();
var studyGroups = new StudyGroupDB();
var meetups = new GroupMeetups();
var timeline = new TimelineDB();
var events = new EventsDB();
var stream = new StreamDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//use session and bodyParser
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
//render the tutor page
router.get('/Group/:GroupId', function (req, res) {
  if (req.session.userId) {
    var qs = req.query;
    studyGroups.getStudyGroupById(req.params.GroupId).exec((err, docs) => {
      if(docs){
        var isMember = false;
        var pending = false;

        for (var x = 0; x <  docs[0].Members.length; x++){
          if(docs[0].Members[x].MemberHandle == req.session.handle &&
            docs[0].Members[x].Status == "Accepted"){
            isMember = true;
          }
          else if(docs[0].Members[x].MemberHandle == req.session.handle &&
            docs[0].Members[x].Status == "Pending"){
              isMember = false;
              pending = true;
            }
        }
        if(isMember) {
            var isHost = false;
            if(docs[0].HostHandle=== req.session.handle) {
              isHost = true;
            }
            var members = [];
            var memberCount = 0;
            new Promise((resolve, reject) => {
                if (docs[0].Members.length === 0) {
                  resolve();
                } else {
                  for (x in docs[0].Members) {
                    memberCount++;
                    users.getUserByHandle(docs[0].Members[x].MemberHandle).exec((err, docs3) => {
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
                meetups.getMeetupsByGroupId(req.params.GroupId).exec((err, docs1) => {
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
                      groupImg: docs[0].GroupImage,
                      formatDate: dateFunctions.displayDate,
                      formatTime: dateFunctions.formatTime,
                      isHost: isHost,
                      isMember: isMember
                    });
                  }
                });
              })
              .catch(function (err) {
                console.log(err)
              })
      }
      else {
        //if private and user not member
        res.render('UserLoggedIn/PrivateGroup', {
          qs: req.query,
          session: req.session,
          params: req.params,
          studyGroup: docs[0],
          memberCount: docs[0].Members.length,
          groupImg: docs[0].HostImage,
          formatDate: dateFunctions.displayDate,
          formatTime: dateFunctions.formatTime,
          isHost: isHost,
          isMember: isMember,
          pending: pending


        });
      }
      }
      else{
        res.redirect("/home")
      }
    });
  } else {
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
  }
});
router.get('/group-settings/:GroupId', function (req, res) {
  if (req.session.userId) {
    var qs = req.query;
    studyGroups.getStudyGroupById(req.params.GroupId).exec((err, docs) => {
      if(docs[0].HostHandle == req.session.handle){
            var members = [];
            var memberCount = 0;
            new Promise((resolve, reject) => {
                if (docs[0].Members.length === 0) {
                  resolve();
                } else {
                  for (x in docs[0].Members) {
                    memberCount++;
                    users.getUserByHandle(docs[0].Members[x].MemberHandle).exec((err, docs3) => {
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
                 
                    res.render('UserLoggedIn/GroupSettings', {
                      qs: req.query,
                      session: req.session,
                      params: req.params,
                      studyGroup: docs[0],
                      memberCount: memberCount,
                      members: members,
                      groupImg: docs[0].HostImage,
                      formatDate: dateFunctions.displayDate,
                      formatTime: dateFunctions.formatTime,
                      isHost:false,
                      isMember: false
                    });
                  })
              .catch(function (err) {
                console.log(err)
              })
      
      }
      else{
        res.redirect("/home")
      }
    });
  } else {
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
  }
});
//get group meetups
router.get("/getGroupMeetups/:groupId", function(req,res){
  meetups.getMeetupsByGroupId(req.params.groupId)
  .then((meetups)=>{
    console.log("Meetups: " +meetups)
    res.json({meetups:meetups})

  })
})
//Create new study group meetup
router.post('/createMeetup',
  // check('groupName').isString().trim().escape(),
  // check('groupId').isString().trim().escape(),
  // check('date').trim().escape(),
  // check('title').isString().trim().escape(),
  // check('duration').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
    }
    console.log("CREATE MEETUP: " +req.body)

    console.log(req.body)
stream.addStream(req.session.handle, req.session.userId, req.session.img, 
  req.body.title, req.body.groupId)
.then((stream)=>{

    meetups.addMeetup(req.body.groupName, req.session.handle, 
      req.session.img, stream._id, req.body.groupId, req.body.date, req.body.title)
        .then(function (data) {
          console.log("Meetup added")
          
        timeline.addGroupMeetupTimelinePost(req.session.handle, req.session.handle, req.session.name, "Group Meetup", req.session.img, "New meetup in " + req.body.groupName + ": "+ req.body.title, new Date(), req.body.title,
          req.body.groupId, req.body.date)
        .then(function () {
          //add item to calendar
          events.addEvent(req.session.userId, req.body.date, req.body.duration,
            0, req.body.title, req.body.title, "Group Meetup", stream._id,
            "")
            .then(()=>{
              console.log("then ran")
              res.status(202).json({
                hostHandle: req.session.handle,
                hostImage: req.session.img,
                date: req.body.date,
                title: req.body.title
              })
            })
          
        })
      })
      })
      .catch(function (error) {
        console.log(error)
      })

  });
router.post("/attendStudyGroup",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          meetups.addAttendee(req.body.id, req.session.handle, req.session.img, function (suc) {
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
      res.redirect('/login?message=Session%20Ended');
    }
  })
router.post("/leaveStudyGroup",
  check('id').isString().trim().escape(),
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect('/home');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          meetups.removeAttendee(req.body.id, req.session.handle, function (suc) {
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
      res.redirect('/login?message=Session%20Ended');
    }
  })
  router.get("/getGroupImages", (req, res)=>{
    studyGroups.getGroupImages(req.session.userId)
    .then((groups)=>{
      res.json(groups)
    })
    .catch((err)=> {
      res.json("An error occurred")
    })
  })
  router.get("/getStoryImages", (req, res)=>{
    studyGroups.getStoryImages(req.session.userId)
    .then((groups)=>{
      res.json(groups)
    })
    .catch((err)=> {
      res.json("An error occurred")
    })
  })
  router.get('/approveMembers/:GroupId', function (req, res) {
     studyGroups.getStudyGroupById(req.params.GroupId)
    .then((group)=>{
      var isHost = false;
      var isMember = false;
      if(group[0].HostHandle=== req.session.handle) {
        isHost = true;
      }
      for (var x = 0; x <  group[0].Members.length; x++){
        if(group[0].Members[x].MemberHandle == req.session.handle
         ){
          isMember = true;
        }
      }
      if(isHost){
        res.render("UserLoggedIn/approveGroupMembers",
        {
          params: req.params,
          studyGroup:group[0],
          session: req.session,
          isHost: isHost,
          isMember: isMember
        })
      }
      else{
        res.redirect("/")
      }
      
    })

  });

  //join meetup
  router.post("/joinMeetup",
  function (req, res) {
    console.log("join meetup")
    meetups.addAttendee(req.body.meetupId, req.session.handle, req.session.img)
    .then(()=>{
      console.log("Attendee added")
    })
  });
module.exports = router;