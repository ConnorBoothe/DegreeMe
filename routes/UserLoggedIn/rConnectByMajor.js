//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const {
  check,
  validationResult
} = require('express-validator');
//DBs used
const userDB = require('../../models/Database/UserDB');
const NotificationDB = require('../../models/Database/NotificationDB');
//classes used
var Student = require('../../models/classes/Student');
//instantiate DBs
var users = new userDB();
var notifications = new NotificationDB();
//use session and bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
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

//Render Find Classmates
router.get('/discover', function (req, res) {
  if (req.session.userId) {
    users.getUserByEmail(req.session.email).exec((err, curUser) => {
      var searchMajor;
      if (typeof req.query.searchInput !== 'undefined') {
        searchMajor = req.query.searchInput;
      } else {
        searchMajor = curUser[0].Major;
      }
      users.getUsersByMajor(searchMajor.trim()).exec((err, docs) => {
        if (err != null) {
          console.log(err);
        } else {
          if (docs.length > 1) {
            var numInMajor = 0;
            var students = [];
            new Promise((resolve, reject) => {
              for (x in docs) {
                if (docs[x]._id != req.session.userId) {
                  numInMajor++;
                  //create tutor objects from DB results
                  //constructor(userId,first_name,last_name,school,email,password,img,theme,handle, mySchedule, status, subscription, creditHours, threads, major) {
                  var temp = new Student(docs[x]._id, docs[x].first_name, docs[x].last_name, docs[x].school,
                    docs[x].email, docs[x].password, docs[x].img, docs[x].theme, docs[x].handle, docs[x].myCourses,
                    docs[x].status, docs[x].subscription, null, docs[x].threads, docs[x].Major, docs[x].bio);
                  //console.log("calling isFollowing:"+docs[x].handle);
                  users.isFollowing(req.session.handle, docs[x], temp, function (student, folstat) {
                    students.push([student, folstat]);
                    if (students.length == numInMajor) {
                      resolve(students);
                    }
                  });
                }
              }
            }).then((students) => {
              students.sort(function (a, b) {
                a = a[0].getName();
                b = b[0].getName();
                return a < b ? -1 : (a > b ? 1 : 0);
              })
              res.render('UserLoggedIn/ConnectByMajor', {
                qs: req.query,
                session: req.session,
                students: students,
                major: searchMajor,
              })
            });
          } else {
            res.render('UserLoggedIn/ConnectByMajor', {
              qs: req.query,
              session: req.session,
              students: [],
              major: searchMajor,
            });
          }
        }
      })
    })
  } else {
    res.redirect('/login?error=Session%20Ended');
  }

});
//follow user account
router.post("/follow",
  check('handle').isString().trim().escape(),
  check('image').isString().trim(),
  function (req, res) {
    //stores validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //redirect to index if error
      res.redirect('/');
    }
    if (req.session.userId) {
      new Promise((resolve, reject) => {
          // addFollow(follower_handle, handle, image, callback)
          users.addFollow(req.session.handle, req.body.handle, req.session.img, req.body.image, function (suc) {
            //add follow notification
            notifications.addNotification(req.body.handle, req.session.name, "followed you", req.session.img, "/user/" + req.session.handle);
            if (suc) {
              resolve();
            } else {
              reject();
            }
          });
        }).then(function () {
          users.incrementNotificationCount(req.body.handle).then(function (data) {
            console.log(data)
        });
          res.status(202).json({
            action: "followed"
          }).end();
        })
        .catch(function () {
          console.log("ERROR")
          res.status(500).json({
            err: "something broke in follow"
          }).end();
        });
    } else {
      res.redirect('/login?error=Session%20Ended');
    }
  });
//unfollow a user account
router.post("/unfollow", function (req, res) {
  console.log("unfollow ran")
  if (req.session.userId) {
    new Promise((resolve, reject) => {
        users.removeFollow(req.session.handle, req.body.handle, function (suc) {
          if (suc) {
            resolve();
          } else {
            reject();
          }
        });
      }).then(function () {
        res.status(202).json({
          action: "unfollowed"
        }).end();
      })
      .catch(function () {
        res.status(500).json({
          err: "something broke in unfollow"
        }).end();
      });
  } else {
    res.redirect('/login?error=Session%20Ended');
  }
})
module.exports = router;