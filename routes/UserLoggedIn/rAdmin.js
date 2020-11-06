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
const TutorDB = require("../../models/Database/TutorDB");
const UserDB = require("../../models/Database/UserDB");
var tutorDB = new TutorDB();
var users = new UserDB();
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
    cookie: {
        secure: true,
        maxAge: 6 * 60 * 60 * 1000
    },
}));
//render the admin page
router.get('/admin', function (req, res) {
    if (req.session.email == "cboothe1@uncc.edu" || req.session.email == "chithe@uncc.edu") {
        tutorDB.getAllPending()
            .then(function (data) {
                res.render('UserLoggedIn/Admin', {
                    session: req.session,
                    pendingTutors: data
                });
            })
    } else {
        res.redirect("/home");
    }
});
router.post("/removeTutorCourse", function (req, res) {
        tutorDB.rejectCourse(req.body.appId)
            .then(function () {
                        res.status(202).json({
                            status: "Rejected",
                        }).end();
                    })
        });
//add new tutoring course
router.post("/reviewTutorApplication", function (req, res) {
    if (req.body.status === "Reject") {
        tutorDB.rejectCourse(req.body.appId)
            .then(function () {
                users.getEmailById(req.body.userId)
                    .then(function (email) {
                        // add follow email here
                        console.log(req.body.userId)
                        console.log(email)
                        mail.headers({
                            "content-type": "application/json",
                            "authorization": process.env.SENDGRID_API_KEY,
                        });
                        mail.type("json");
                        mail.send({
                            "personalizations": [{
                                "to": [{
                                    "email": email.email,
                                }],
                                "dynamic_template_data": {
                                    "subject": "You're tutor application has been reviewed",
                                    "course": req.body.course,
                                    "status": "Rejected",
                                    "message": "We're sorry, but you do not meet the requirement of having a B or higher in this course. We encourage you to apply to be a tutor for a course that you have made at least a B in."
                                },
                                "subject": "You're tutor application has been reviewed"
                            }],
                            "from": {
                                "email": "notifications@degreeme.io",
                                "name": "DegreeMe"
                            },
                            "reply_to": {
                                "email": "noreply@degreeme.io",
                                "name": "No Reply"
                            },
                            "template_id": "d-27a4cc1006294aabbeb9b060f8c0df26"
                        });
                        mail.end(function (resp) {
                            if (resp.error) {
                                console.log("follow error: ", resp.error)
                                // res.redirect("/home")
                                // throw new Error(res.error);
                            } else if (resp.accepted) {
                                console.log("email was sent for follow")
                            }
                            console.log(resp.body);
                        });
                        res.status(202).json({
                            status: "Rejected",
                        }).end();
                    })

            });
    } else {
        tutorDB.acceptCourse(req.body.appId)
            .then(function () {
                users.getEmailById(req.body.userId)
                    .then(function (email) {
                        // add follow email here
                        mail.headers({
                            "content-type": "application/json",
                            "authorization": process.env.SENDGRID_API_KEY,
                        });
                        mail.type("json");
                        mail.send({
                            "personalizations": [{
                                "to": [{
                                    "email": email.email,
                                }],
                                "dynamic_template_data": {
                                    "subject": "You're tutor application has been reviewed",
                                    "course": req.body.course,
                                    "status": "Accepted",
                                    "message": "Congrats! While you are an active tutor, you will be discoverable as a tutor for the above course."
                                },
                                "subject": "You're tutor application has been reviewed"
                            }],
                            "from": {
                                "email": "notifications@degreeme.io",
                                "name": "DegreeMe"
                            },
                            "reply_to": {
                                "email": "noreply@degreeme.io",
                                "name": "No Reply"
                            },
                            "template_id": "d-27a4cc1006294aabbeb9b060f8c0df26"
                        });
                        mail.end(function (resp) {
                            if (resp.error) {
                                console.log("follow error: ", resp.error)
                                // res.redirect("/home")
                                // throw new Error(res.error);
                            } else if (resp.accepted) {
                                console.log("email was sent for follow")
                            }
                            console.log(resp.body);
                        });
                        res.status(202).json({
                            status: "Accepted",
                        }).end();
                    });
            });
    }
})

module.exports = router;