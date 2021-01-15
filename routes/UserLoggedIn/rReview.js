//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const {
  check,
  validationResult
} = require('express-validator');
//DBs used
var reviewsDB = require("../../models/Database/ReviewsDB")
var MeetupsDB = require("../../models/Database/MeetupsDB.js");
var UserDB = require("../../models/Database/UserDB.js");
//instantiate DBs
var meetups = new MeetupsDB();
var reviews = new reviewsDB();
var users = new UserDB();
//use session and body parser
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
  extended: true
}));
//render the create connection page
router.get('/review/:handle', function (req, res) {
  if (req.session.userId) {
        users.getUserHandleByHandle(req.params.handle)
        .then(function(handle){
          if(req.query.id){
            meetups.getMeetupById(req.query.id)
            .then((meetup)=>{
              console.log(meetup)
                if(!meetup.LeftReview && handle.handle){
                  res.render('UserLoggedIn/LeaveAReview', {
                    qs: req.query,
                    session: req.session,
                    params: req.params
                 });
                }
                else {
                  res.redirect("/")
                }
            })
          }
          else{
            res.redirect("/")

          }
        })
        .catch((err)=>{
          console.log(err)
          res.redirect("/")

        })
       }

});

router.get('/FeedbackLeft', function (req, res) {
  if (req.session.userId) {
    res.render('UserLoggedIn/FeedbackLeft', {
      session: req.session,
    });
  } else {
    res.redirect('/login?message=Session%20Ended');
  }

});
//review post route
router.post('/LeaveAReview', function (req, res) {
  reviews.addReview(req.session.handle, req.session.img, req.body.tutor, req.body.course, req.body.star, req.body.message)
  .then(function(){
    meetups.updateLeftReview(req.body.meetupId);
    res.redirect("/FeedbackLeft");
  })
  .catch((err)=>{
    console.log(err)
  })
});


module.exports = router;