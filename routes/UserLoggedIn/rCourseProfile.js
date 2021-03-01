//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const nodemailer = require("nodemailer");
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const UNCC_CoursesDB = require('../../models/Database/UNCC_CoursesDB');
const UserDB = require('../../models/Database/UserDB.js');
const DiscussionBoardDB = require('../../models/Database/DiscussionBoardDB');
const TimelineDB = require('../../models/Database/TimeLineDB');
//classes used
const Student = require('../../models/classes/Student');
const DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes used
var coursesDB = new UNCC_CoursesDB();
var users = new UserDB();
var discussionBoard = new DiscussionBoardDB();
var dateFunctions = new DateFunctions();
var timeline = new TimelineDB();
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
//render the course profile page
router.get('/course/:CourseName', function (req, res) {
    //attempt to decode the param.
    try {
        decodeURIComponent(req.path)
    }
    catch(e) {
        console.log(e)
       res.redirect("/home")
    }
    if(req.session.userId){
        if (req.query.discussion) {
            if(req.params.CourseName.includes("+")){
                var course = req.params.CourseName.replace(/\+/g, ' ');
                coursesDB.getCourseByName(course).exec((err, docs) => {
                    if(docs){
                        timeline.getTimelineIdByDiscussionId(req.query.discussion).then(function(data){
                        console.log("DATA: " +data)
                        })
                        discussionBoard.getAllDiscussionById(req.query.discussion).exec((err, docs1) => {
                            res.render('UserLoggedIn/DiscussionPage', {
                                qs: req.query,
                                session: req.session,
                                params: req.params,
                                course: docs[0],
                                discussion: docs1[0],
                                formatDate: dateFunctions.displayDate
                            });
                        })
                    }
                    else{
                        res.redirect("/home");
                    }
                })
            }
            else{
                coursesDB.getCourseByName(req.params.CourseName).exec((err, docs) => {
                    if(docs.length > 0){
                       
                        console.log("YOO")
                        discussionBoard.getAllDiscussionById(req.query.discussion).exec((err, docs1) => {
                            res.render('UserLoggedIn/DiscussionPage', {
                                qs: req.query,
                                session: req.session,
                                params: req.params,
                                course: docs[0],
                                discussion: docs1[0],
                                formatDate: dateFunctions.displayDate
                            });
                        })    
                    }
                    else{
                        res.redirect("/home")
                    }
                    
                })
            }
            console.log(req.query.discussion);
            
        } else {
            if (req.session.userId) {
                var qs = req.query;
                console.log(req.params.CourseName)
                coursesDB.getCourseByName(req.params.CourseName).exec((err, docs) => {
                    if(docs.length > 0){
                        res.render('UserLoggedIn/CourseProfile', {
                            qs: req.query,
                            session: req.session,
                            params: req.params,
                            course: docs[0]
                        });
                    }
                    else{
                        res.redirect("/home");
                    }
                })
    
            } else {
                res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
            }
        }
    }
    else{
        res.redirect("/")
    }
    
});
//add comment to discussion post
//delete discussion post
router.post('/course/removeDiscussion',
    check('discId').isString().trim().escape(),
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to home if error
            res.redirect('/home');
        }
        //remove from discussionDB
        discussionBoard.deleteQuestion(req.body.discId).then(function (data) {
            //remove from timelineDB
            timeline.removeDiscussionPost(req.body.discId)
            .then(function(){
                res.redirect("/course/" + req.body.course);
            })
            
        })
        .catch(function(err){
            console.log(err)
        })
    });
//get students that have joined a given course. Displayed on Course Profile page
router.get('/getStudentsByCourse/:Course',
    function (req, res) {
        coursesDB.getCourseByName(req.params.Course).then(function (data) {
            console.log(data)
            res.json(data[0].students)
        })
        .catch(function(err){
            console.log(err)
        })

    });
module.exports = router;