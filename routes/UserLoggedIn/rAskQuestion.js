//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var unirest = require('unirest');
const {
    check,
    validationResult
} = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_KEY);
//DBs used
const TimelineDB = require("../../models/Database/TimeLineDB");
const UserDB = require("../../models/Database/UserDB");
const CommentsDB = require("../../models/Database/CommentsDB");
const NotificationDB = require("../../models/Database/NotificationDB");
const DiscussionDB = require("../../models/Database/DiscussionBoardDB");
//classes used
var DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes
var dateFunctions = new DateFunctions();
//instantiate DBs for us
var timeline = new TimelineDB();
var users = new UserDB();
var discussion = new DiscussionDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
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
//render the checkout page

router.post('/askQuestion', 
function (req, res) {
    //file to attach
    var fileAttachment = [];
    if(req.body.image != "none"){
        fileAttachment.push(req.body.image);
    }
    //post to group discussion board
    console.log(req.body)
    timeline.addQuestionPost(req.session.handle,req.session.handle, req.session.name, "Question" ,req.session.img,req.body.message,new Date(), fileAttachment, req.body.course )
    .then(function(data){
        console.log("DATA ID : " + data._id)
        //post to timeline
        discussion.postDiscussion(req.session.handle, req.session.name, req.session.img, false, req.body.course, new Date(), req.body.message, fileAttachment, data._id)
        .then(function(data1){
            res.status(202).json({
                result:data1,
            }).end(); 
        })
    })
    .catch(function(err){
        console.log(err)
    })
});
//get 
// user groups for tag group autocomplete
router.post('/userGroups', 
function (req, res) {
    users.getMyGroups(req.session.userId)
    .then(function(groups){
        console.log(groups)
        res.status(202).json({
            groups:groups,
        }).end(); 
    })
});
module.exports = router;