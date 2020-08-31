//packages used
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator');
//Dbs used
const ListingDB = require("../../models/Database/ListingsDB");
const TimelineDB = require("../../models/Database/TimeLineDB");
//Instantiate DBs
var listings = new ListingDB();
var timeline = new TimelineDB();
//register the session and bodyParser
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
//render Host a Session
router.get('/HostASession', function (req, res) {
  if (req.session.userId) {
    res.render('UserLoggedIn/HostASession', {
      qs: req.query,
      session: req.session,
      params: req.params
    });

  } else {
    res.redirect('/login?error=Session%20Ended');
  }
});
//create the tutpr listing
router.post('/createSession', [
    check('userId').isString().trim().escape(),
    check('handle').isString().trim().escape(),
    check('name').isString().trim().escape(),
    check('courseName').isString().trim().escape(),
    check('courseCode').isString().trim().escape(),
    check('grade').isString().trim().escape(),
    check('hourlyRate').isString().trim().escape(),
    check('duration').isString().trim().escape(),
    check('school').isString().trim().escape(),
    check('type').isString().trim().escape(),
    check('schedule').isArray(),
    check('maxStudents').isString().trim().escape(),
    check('image').isString().trim(),
    check('startDate').isString().trim().escape(),
    check('expirationDate').trim().escape(),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      console.log("ERROR")
      res.redirect('/Home');
    }
    console.log("Schedule",req.body.schedule)
    if (req.body.virtual == "Physical Location") {
      //if physical and group
      if (req.body.type == "Group Session") {
        listings.addPhysicalGroupListing(req.body.userId, req.body.handle, req.body.name, req.body.courseName, req.body.courseCode, req.body.grade,
          req.body.hourlyRate, req.body.duration, req.body.school, req.body.type, req.body.schedule, req.body.maxStudents, req.body.image,
          true, req.body.startDate, req.body.expirationDate).then(response => {
          // addPost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse, anonymous, professor,description,course, groupId,postImage){
          timeline.addTimelinePost(req.session.handle, req.session.handle, req.session.name, "Tutor Listing", req.session.img, "New tutor listing created in " + req.body.courseName, new Date(), "TutorListing",
            parseFloat(req.body.hourlyRate) * parseInt(req.body.duration), req.body.courseName, "/Checkout?id=" + response._id);
          res.status(202).json({
            status: "Added Session"
          }).end();
        }).catch(function (error) {
          console.log(error);
        });
      }
      //if physical and individual
      else if (req.body.type == "Individual Session") {
        listings.addPhysicalIndividualListing(req.body.userId, req.body.handle, req.body.name, req.body.courseName, req.body.courseCode, req.body.grade,
          req.body.hourlyRate, req.body.duration, req.body.school, req.body.type, req.body.schedule, req.body.image,
          true, req.body.startDate, req.body.expirationDate).then(response => {
          timeline.addTimelinePost(req.session.handle, req.session.handle, req.session.name, "Tutor Listing", req.session.img, "New tutor listing created in " + req.body.courseName, new Date(), "TutorListing",
            parseFloat(req.body.hourlyRate) * parseInt(req.body.duration), req.body.courseName, "/Checkout?id=" + response._id);
          res.status(202).json({
            status: "Added Session"
          }).end();

        }).catch(function (error) {
          console.log(error);
        });
      }
    }
      else if (req.body.virtual == "Online") {
        //if virtual and group
        if (req.body.type == "Group Session") {
          listings.addVirtualGroupListing(req.body.userId, req.body.handle, req.body.name, req.body.courseName, req.body.courseCode, req.body.grade,
            req.body.hourlyRate, req.body.duration, req.body.maxStudents, req.body.school, req.body.type, req.body.schedule, req.body.image,
            true, req.body.startDate, req.body.expirationDate).then(response => {
            timeline.addTimelinePost(req.session.handle, req.session.handle, req.session.name, "Tutor Listing", req.session.img, "New tutor listing created in " + req.body.courseName, new Date(), "TutorListing",
              parseFloat(req.body.hourlyRate) * parseInt(req.body.duration), req.body.courseName, "/Checkout?id=" + response._id);
            res.status(202).json({
              status: "Added Session"
            }).end();
          }).catch(function (error) {
            console.log(error);
          });
        }
        //if virtual and individual
        else if (req.body.type == "Individual Session") {
          listings.addVirtualIndividualListing(req.body.userId, req.body.handle, req.body.name, req.body.courseName, req.body.courseCode, req.body.grade,
            req.body.hourlyRate, req.body.duration, req.body.school, req.body.type, req.body.schedule, req.body.image,
            true, req.body.startDate, req.body.expirationDate).then(response => {
            timeline.addTimelinePost(req.session.handle, req.session.handle, req.session.name, "Tutor Listing", req.session.img, "New tutor listing created in " + req.body.courseName, new Date(), "TutorListing",
              parseFloat(req.body.hourlyRate) * parseInt(req.body.duration), req.body.courseName, "/Checkout?id=" + response._id);
            res.status(202).json({
              status: "Added Session"
            }).end();
  
          }).catch(function (error) {
            console.log(error);
          });
        }
      }
    
  });


module.exports = router;