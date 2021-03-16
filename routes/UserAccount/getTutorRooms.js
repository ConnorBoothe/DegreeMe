//packages used
require('dotenv').config();
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
const mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);

const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const TutorDB = require("../../models/Database/TutorDB");
const UserDB = require('../../models/Database/UserDB');
const ScheduleDB = require('../../models/Database/TutorSchedule');

//instantiate DBs
const users = new UserDB();
const tutor = new TutorDB();
const schedule = new ScheduleDB();
//register the session and use bodyParser
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
//add course to My Courses from Course Profile Page
router.post('/getTutorRooms',
    function (req, res) {
        var courseArray = [];
        for(var i = 0; i < req.session.myCourses.length; i++){
            courseArray.push(req.session.myCourses[i].courseName);
        }
        var courseName = "";
        var day = "";
        var time = "";
        console.log("Getting tutor rooms")
        if(req.body.course != undefined) {
            courseName = req.body.course;
            day = req.body.day;
            time =req.body.time

        }
        else {
            courseName = req.session.myCourses[0].courseCode;
            day = new Date().getDay();
            time = new Date().getHours();           
        }
        tutor.getAvailableTutorsByCourse(req.session.handle, courseName, day, time)
        .then((result)=> {
            console.log(result)
                res.status(202).json({
                    tutors:result.finalTutors,
                    reservedStatus: result.reservedStatus,
                    courses: req.session.myCourses,
                    times: result.times
               })
            })
            .catch(function (error) {
                console.log(error)
            })

    });
    router.post('/getTutorRoomsUserProfile',
    function (req, res) {
      
        //getUserScheduleByDay(userId, day, time,
        // userHandle, courseCode){
            
        schedule.getUserScheduleByDay(req.body.userId,
            req.body.day, req.body.userHandle,
            req.body.courseCode)
            .then((schedule)=>{
                res.status(202).json({
                    schedule:schedule.schedule,
                    courses: req.session.myCourses
               })
            })
            .catch(function (error) {
                console.log(error)
            })
    });
module.exports = router;