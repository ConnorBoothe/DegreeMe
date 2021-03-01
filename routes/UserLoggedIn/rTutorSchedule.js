//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const unirest = require('unirest');
const bodyParser = require('body-parser');
const TutorSchedule = require("../../models/Database/TutorSchedule");
const TutorDB = require("../../models/Database/TutorDB");
const UserDB = require("../../models/Database/UserDB");
var tutorDB = new TutorDB();
var schedule = new TutorSchedule();
var users = new UserDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

router.post("/addTimeslot", function(req, res){
    console.log("adding time slot")
    console.log(req.body.day)
    schedule.addTimeslot(req.session.userId, req.body.day, req.body.time)
    .then(function(){
        res.status(202).json({
            status:"success",
        }).end();
    })
    .catch(function(err){
        console.log(err);
    })
})
router.post("/removeTimeslot", function(req, res){
    console.log("removing time slot")
    schedule.removeTimeslot(req.session.userId, req.body.day, req.body.time)
    .then(function(){
        res.status(202).json({
            status:"success",
        }).end();
    })
    .catch(function(err){
        console.log(err);
    })
})
router.post("/getScheduleByDay", function(req, res){
    console.log("Day: " ,req.body.day)
    schedule.getPersonalSchedule(req.session.userId, req.body.day)
    .then(function(data){
        var times = [];
        for(var i = 0; i < data.length; i++){
            times.push(data[i].time);
        }
        console.log(times)
        res.status(202).json({
            data:times,
        }).end();
    })
    .catch(function(err){
        console.log(err)
    })
})
router.post("/TestTutorDB", function(req, res){
    console.log("Day: " ,req.body.day)
    tutorDB.getAvailableTutorsByCourse(req.session.userId, "College Algebra");
})

//get courses tutoring by userId
router.post("/getTutoringCourses", function(req, res){
    tutorDB.getTutorByUserId(req.session.userId)
    .then(function(data){
        //send email to admin
       
        res.status(202).json({
            data:data,
        }).end();
    })
    .catch(function(err){
        console.log(err);
    })
})
//add new tutoring course
router.post("/addTutorCourse", function(req, res){
    // userId, course, courseCode, hourlyRate, transcriptImg
    // addTutor(userId, userName, handle, userImg, rating, course, courseCode, hourlyRate, transcriptImg, streamId)
    tutorDB.addTutor(req.session.userId, req.session.name, req.session.handle, req.session.img, 5, req.body.course, req.body.courseCode, req.body.transcriptImg, req.session.streamId)
    .then(function(data){
        mail.headers({
            "content-type": "application/json",
            "authorization": process.env.SENDGRID_API_KEY,
        });
        mail.type("json");
        mail.send({
            "personalizations": [{
                "to": [{
                    "email": req.session.email,
                
                }],
                "dynamic_template_data": {
                    "course": req.body.courseCode,
                    "userName":req.session.handle
                },
                "subject": ""
            }],
            "from": {
                "email": "notifications@degreeme.io",
                "name": "DegreeMe"
            },
            "reply_to": {
                "email": "noreply@degreeme.io",
                "name": "No Reply"
            },
            "template_id": "d-570fde84756a446c97c905181c7fc902"
        });
        mail.end(function (resp) {
            if (resp.error) {
                console.log(resp.error)
                // res.redirect("/home")
                // throw new Error(res.error);
            } else if (resp.accepted) {
                console.log("email was sent")
            }
            console.log(resp.body);
        });
        mail.headers({
            "content-type": "application/json",
            "authorization": process.env.SENDGRID_API_KEY,
        });
        mail.type("json");
        mail.send({
            "personalizations": [{
                "to": [{
                    "email": "cboothe1@uncc.edu",
                
                }],
                "dynamic_template_data": {
                    "message": "Someone wants to be tutor!",
                    "link":"link"
                },
                "subject": ""
            }],
            "from": {
                "email": "notifications@degreeme.io",
                "name": "DegreeMe"
            },
            "reply_to": {
                "email": "noreply@degreeme.io",
                "name": "No Reply"
            },
            "template_id": "d-789e8480f5954273a6e51814666d5da9"
        });
        mail.end(function (resp) {
            if (resp.error) {
                console.log(resp.error)
                // res.redirect("/home")
                // throw new Error(res.error);
            } else if (resp.accepted) {
                console.log("email was sent")
            }
            console.log(resp.body);
        });

        res.status(202).json({
            status:"success",
        }).end(); 
    })
    .catch(function(err){
        console.log(err)
        res.status(202).json({
            status:"fail",
        }).end(); 
    })
})
router.post("/getAvailableTutors", function(req, res){
    console.log("GETTTING available tutors")
    console.log(req.body.course)
    tutorDB.getAvailableTutorsByCourse(req.body.course)
    .then(function(data){
        console.log("RAN")
        res.status(202).json({
            tutors:data,
        }).end(); 
    })
    
})

module.exports = router;