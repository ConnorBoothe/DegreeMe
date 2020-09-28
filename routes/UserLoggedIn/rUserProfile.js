//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const UNCC_CoursesDB = require('../../models/Database/UNCC_CoursesDB');
const UserDB = require('../../models/Database/UserDB.js');
const MessagesDB = require('../../models/Database/MessagesDB');
const ListingsDB = require('../../models/Database/ListingsDB');
const ReviewsDB = require('../../models/Database/ReviewsDB');
//instantiate DBs used
var users = new UserDB();
var messages = new MessagesDB();
var courses = new UNCC_CoursesDB();
var listings = new ListingsDB();
var reviews = new ReviewsDB();
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
//render the UserProfile page
router.get('/user/:Handle', function (req, res) {
    if (req.session.userId) {
        var qs = req.query;
        
        users.getUserByHandle(req.params.Handle).exec((err, docs) => {
            if(docs.length > 0 ){
            var followerCount = 0;
            var followingCount = 0;
            //get followerCount
            for (x in docs[0].followers) {
                followerCount++;
            }
            //get followingCount
            for (x in docs[0].following) {
                followingCount++;
            }
            users.isFollowing(req.session.handle, docs[0], null, function (temp, folstat) {
                res.render('UserLoggedIn/UserProfile', {
                    qs: req.query,
                    session: req.session,
                    user: docs[0],
                    following: folstat,
                    followerCount: followerCount,
                    followingCount: followingCount
                });
            })
        }
        else{
            res.redirect("/home")
        }
        })

    } else {
        res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
    }
});
router.post("/setBio",
    check('handle').trim().escape(),
    check('zoomLink').trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.getUserByHandle(req.body.handle).then(function (docs) {
            console.log(req.body.handle)
            for (i in docs[0].myCourses) {
                courses.updateBio(req.body.handle, docs[0].myCourses[i].courseName, req.body.bio);
            }
        })
        users.setBio(req.body.handle, req.body.bio);
        res.status(202).json({
            bio: req.body.bio
        }).end();
    })
router.post("/sendDirectMessage",
    check('host').isString().trim(),
    check('hostImg').trim(),
    check('receiver').trim().escape(),
    check('receiverImage').trim(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        let messageId = "";
        messages.newThread(req.body.host, req.body.hostImg, [
                [req.body.host, req.body.hostImg],
                [req.body.receiver, req.body.receiverImg]
            ],
            new Date(), req.body.host + ", " + req.body.receiver).then(function (data) {
            //host, hostImg, subject, threadId, handle
            messageId = data._id;
            users.addThread(req.body.host, req.body.hostImg, req.body.host + ", " + req.body.receiver, data._id, req.body.host);
            users.addThread(req.body.host, req.body.hostImg, req.body.host + ", " + req.body.receiver, data._id, req.body.receiver);
            messages.addMessage(data._id, req.body.host, req.body.hostImg, req.body.message, data.datetime)
            setTimeout(function () {
                    res.status(202).json({
                        messageId: messageId
                    })

                }, 100)
        });
    })
router.post("/getCourses",
    check('userHandle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.getUserByHandle(req.body.userHandle).exec((err, docs) => {
            res.status(202).json({
                courses: docs[0].myCourses
            })
        })
    });
router.post("/getTutorListings",
    check('userHandle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        listings.getListingsByHandle(req.body.userHandle).exec((err, docs) => {
            res.status(202).json({
                tutoringSessions: docs
            })
        })
    });
router.post("/getReviews",
    check('userHandle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        reviews.getReviewsByHandle(req.body.userHandle).exec((err, docs) => {
            res.status(202).json({
                reviews: docs
            })
        })
    });
router.post("/getGroups",
    check('userHandle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.getUserByHandle(req.body.userHandle).exec((err, docs) => {
            res.status(202).json({
                groups: docs[0].StudyGroups
            })
        })
    });
module.exports = router;