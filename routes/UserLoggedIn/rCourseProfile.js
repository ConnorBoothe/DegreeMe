//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const UNCC_CoursesDB = require('../../models/Database/UNCC_CoursesDB');
const UserDB = require('../../models/Database/UserDB.js');
const DiscussionBoardDB = require('../../models/Database/DiscussionBoardDB');
const NotificationDB = require('../../models/Database/NotificationDB');
//classes used
const Student = require('../../models/classes/Student');
const DateFunctions = require('../../models/classes/DateFunctions');
var unirest = require('unirest');
//instantiate classes used
var coursesDB = new UNCC_CoursesDB();
var users = new UserDB();
var discussionBoard = new DiscussionBoardDB();
var dateFunctions = new DateFunctions();
var notifications = new NotificationDB();
//use session and bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
//render the course profile page
router.get('/Course/:CourseName', function (req, res) {
    //attempt to decode the param.
    try {
        decodeURIComponent(req.path)
    }
    catch(e) {
        console.log(e)
        console.log("TITS")
       res.redirect("/Home")
    }
    if(req.session.userId){
        if (req.query.discussion) {
            if(req.params.CourseName.includes("+")){
                var course = req.params.CourseName.replace(/\+/g, ' ');
                console.log(course)
                coursesDB.getCourseByName(course).exec((err, docs) => {
                    if(docs){
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
                        res.redirect("/Home")
                    }
                   
                })
            }
            else{
                coursesDB.getCourseByName(req.params.CourseName).exec((err, docs) => {
                    if(docs.length > 0){
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
                        res.redirect("/Home")
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
                        res.redirect("/Home")
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
//add new discussion post to course
router.post('/Course/newDiscussion',
    check('userHandle').isString().trim().escape(),
    check('userName').isString().trim().escape(),
    check('userImg').isString().trim(),
    check('anonymous').isString().trim().escape(),
    check('course').isString().trim().escape(),
    check('post').isString().trim(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/Home');
        }
        discussionBoard.postDiscussion(req.body.userHandle, req.body.userName, req.body.userImg, req.body.anonymous, req.body.course, new Date(), req.body.post);
        res.redirect("/Course/" + req.body.course);

    });
//add comment to discussion post
router.post('/Course/addComment',
    check('discId').isString().trim().escape(),
    check('commentImg').isString().trim(),
    check('commentHandle').isString().trim().escape(),
    check('commentMessage').isString().trim(),
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/Home');
        }
        if(req.session.userId){
        discussionBoard.addComment(req.body.discId, req.body.commentImg, req.body.commentHandle, req.body.commentMessage, new Date()).then(function(){
            discussionBoard.getAllDiscussionById(req.body.discId).exec((err, discussion)=>{
            
                notifications.addNotification(discussion[0].userHandle ,req.body.commentHandle," answered your question", req.body.commentImg, "/Course/"+req.body.course+"?discussion="+req.body.discId)
                users.incrementNotificationCount(discussion[0].userHandle);
                users.getUserByHandle(discussion[0].userHandle).exec((err, user)=>{
                    var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

                    mail.headers({
                        "content-type": "application/json",
                        "authorization": process.env.SENDGRID_API_KEY,
                    });
                    mail.type("json");
                    mail.send({
                    "personalizations": [
                        {
                            "to": [
                                {
                                    "email": user[0].email,
                                    "name": user[0].first_name + " " + user[0].last_name
                                }
                        ],
                            "dynamic_template_data": {
                                "subject": req.body.commentHandle + " answered your question.",
                                "handle": req.body.commentHandle,
                                "message": req.body.commentMessage,
                                "discid": req.body.discId,
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
                        "template_id": "d-82f62439c48d4ca39527f769641396d0"
                    });
                    mail.end(function (res) {
                    if (res.error){
                        console.log(res);
                        // throw new Error(res.error);
                    } 
                });
                })
                
            })

          
            
           
                            // var options = {
                            //     auth: {
                            //         api_key: process.env.SENDGRID_API_KEY
                            //     }
                            // }
            // var mailer = nodemailer.createTransport(sgTransport(options));
            //   var email = {
            //     to: "connorboothe@gmail.com",
            //     from: 'degreeMe <notifications@degreeme.io>',
            //     subject: 'Your question has been answered!',
            //     attachments: [{
            //         filename: 'cheers.png',
            //         path: 'assets/img/cheers.png',
            //         cid: 'myimagecid'
            //     },
            //     {
            //         filename: req.body.commentImg,
            //         path: req.body.commentImg,
            //         cid: 'commentImg'
            //     }
            // ],
            //     html: "<div style='width:100%; text-align:center'><div style='margin-left:auto;margin-right:auto;width:100%;padding-bottom:20px; padding-top:20px'><h2 class='text-light'><img width='50' src='cid:commentImg' alt='cheers' />"+req.body.commentHandle+" commented on your discussion board post.<p>"+req.body.commentMessage+"</p></h2><img width='' src='cid:myimagecid' alt='cheers' /><br><a href='http://127.0.0.1:3000/Course/"+req.body.course+"?discussion=" + req.body.discId+"'><button style='width:200px; font-size:20px; color:white; background-color:#007bff;" +
            //     "border:none; border-radius:10px; font-family:Open Sans, sans-serif;padding:5px; cursor:pointer;margin-top:20px; '>View post</button></a></div></div>",
            // }
            // mailer.sendMail(email, function(err, result) {
            //     if (err) { 
            //         console.log(err)
            //     }
               
            // });
            res.redirect("/Course/" + req.body.course + "?discussion=" + req.body.discId);
        })
    }
    else{
        res.redirect("/");
    }
    });
//delete discussion post
router.post('/Course/removeDiscussion',
    check('discId').isString().trim().escape(),
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to home if error
            res.redirect('/Home');
        }
        discussionBoard.deleteQuestion(req.body.discId).then(function (data) {
            res.redirect("/Course/" + req.body.course);
        })
    });
//get student list for course
router.post('/getStudentsByCourse',
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/Home');
        }
        coursesDB.getCourseByName(req.body.course).then(function (data) {
            console.log(data)
            var numInMajor = 0;
            var students = [];
            console.log(data)
            new Promise((resolve, reject) => {
                if(data[0].students.length === 0){
                    res.status(202).json({
                        students: ""
                    })
                }
                for (var i in data[0].students) {
                    if (data[0].students[i].id != req.session.userId) {
                        numInMajor++;
                        users.getUserByHandle(data[0].students[i].Handle).then(function (docs) {
                            //create tutor objects from DB results
                            //constructor(userId,first_name,last_name,school,email,password,img,theme,handle, mySchedule, status, subscription, creditHours, threads, major) {
                            var temp = new Student(docs[0]._id, docs[0].first_name, docs[0].last_name, docs[0].school,
                                docs[0].email, docs[0].password, docs[0].img, docs[0].theme, docs[0].handle, docs[0].myCourses,
                                docs[0].status, docs[0].subscription, null, docs[0].threads, docs[0].Major, docs[0].bio);
                            //console.log("calling isFollowing:"+docs[x].handle);
                            users.isFollowing(req.session.handle, docs[0], temp, function (student, folstat) {
                                students.push([student, folstat]);
                                if (students.length == numInMajor) {
                                    resolve(students);
                                }
                            });
                        })
                    }
                }
            }).then(function (students) {
                console.log(students);
                res.status(202).json({
                    students: students
                })
            })
            .catch(function(err){
                console.log(err)
            })
        })


    });
module.exports = router;