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
const ReviewsDB = require('../../models/Database/ReviewsDB');
const TutorDB = require('../../models/Database/TutorDB');
const { useReducer } = require('react');
//instantiate DBs used
var users = new UserDB();
var courses = new UNCC_CoursesDB();
var reviews = new ReviewsDB();
var tutors = new TutorDB();

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
    cookie: {
        secure: true,
        maxAge: 6 * 60 * 60 * 1000
    },
}));
//render the UserProfile page
router.get('/user/:Handle', function (req, res) {
    if (req.session.userId) {
        var qs = req.query;

        users.getUserByHandle(req.params.Handle).exec((err, docs) => {
            console.log("User: " + docs[0])
            if (docs.length > 0) {
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
                    //check if account is completed
                    let [percentComplete, toComplete] = getAccountCompletion(docs[0]);
                    res.render('UserProfile/UserProfile', {
                        qs: req.query,
                        session: req.session,
                        user: docs[0],
                        following: folstat,
                        followerCount: followerCount,
                        followingCount: followingCount,
                        percentComplete: percentComplete,
                        toComplete: toComplete
                    });
                })
            }
            else {
                res.redirect("/home")
            }
        })

    } else {
        res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
    }
});
function getAccountCompletion(user){
    const totalCount = 5;
    var completedCount = 1;
    var toComplete = [];
    if(user.Major){
        completedCount++;
    }else{
        toComplete.push(["Add Your Major", "addMajor"]);
    }
    if(user.classification){
        completedCount++;
    }else{
        toComplete.push(["Update Your Class Standing","addStanding"]);
    }
    const defaultImages = [
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_4.png?alt=media&token=94de9ef2-573a-4b1f-a5c3-edf56c1855cc",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_2.png?alt=media&token=dc792ec6-9909-4ef8-ba6f-56b87818cdee",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_1.png?alt=media&token=2fa89c02-1341-414a-84a1-943ee00fde6b",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo.png?alt=media&token=c56774ca-891b-47b9-9616-a3011347e78b",
    ];
    if(!defaultImages.includes(user.img)){
        completedCount++;
    }else{
        toComplete.push(["Add a Profile Image","addImg"]);
    }
    if(user.bio != "Tell the world a bit about yourself"){
        completedCount++;
    }else{
        toComplete.push(["Update Your Bio","addBio"]);
    }
    return [completedCount/totalCount*100, toComplete];
}
router.post("/setBio",
    check('handle').trim().escape(),
    check('zoomLink').trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.getUserByHandle(req.session.handle).then(function (docs) {
            console.log(req.session.handle)
            for (i in docs[0].myCourses) {
                courses.updateBio(req.session.handle, docs[0].myCourses[i].courseName, req.body.bio);
            }
        })
        users.setBio(req.session.handle, req.body.bio);
        res.status(202).json({
            bio: req.body.bio
        }).end();
    })

router.post("/getCourses",
    function (req, res) {
        console.log(req.body.handle)
        users.getUserByHandle(req.body.handle)
        .then((docs) => {
            res.status(202).json({
                courses: docs[0].myCourses
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    });
router.post("/getTutorListings",
    check('userHandle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        console.log("User handle: " + req.body.userHandle)
        tutors.getTutorByHandle(req.body.userHandle).exec((err, docs) => {
            console.log(docs)
            res.status(202).json({
                tutoringSessions: docs
            })
        })
    });
//get user reviews
router.post("/getReviews",
    function (req, res) {
        reviews.getReviewsByHandle(req.body.handle)
        .then((docs) => {
            console.log("Reviews: " +docs)
            res.status(202).json({
                reviews: docs
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    });
router.post("/getGroups",
    function (req, res) {
        users.getUserByHandle(req.body.handle).exec((err, docs) => {
            res.status(202).json({
                groups: docs[0].StudyGroups
            })
        })
    });
module.exports = router;