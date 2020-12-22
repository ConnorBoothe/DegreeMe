//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const TimelineDB = require("../../models/Database/TimeLineDB");
const UserDB = require("../../models/Database/UserDB");
const CommentsDB = require("../../models/Database/CommentsDB");
const NotificationDB = require("../../models/Database/NotificationDB");
//classes used
var DateFunctions = require('../../models/classes/DateFunctions');
var EmailFunction = require('../../models/classes/EmailFunction');
//instantiate classes
var dateFunctions = new DateFunctions();
var emailFunction = new EmailFunction();
//instantiate DBs for use
var timeline = new TimelineDB();
var comments = new CommentsDB();
var notifications = new NotificationDB();
var users = new UserDB();
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
    cookie: { secure: false,
        maxAge:  6*60*60*1000 },
  }));
//render the checkout page
router.get('/post/:timelineId', function (req, res) {
    console.log("RUNNING GET POST")
    if (req.session.userId) {
        timeline.getPostById(req.params.timelineId)
            .then(function (post) {
                comments.getCommentsByPostId(post._id)
                .then(function(comments){
                    if(comments){
                        res.render('UserLoggedIn/Comments', {
                            session: req.session,
                            post: post,
                            comments:comments,
                            formatDate:dateFunctions.displayTimeSince
                        });
                    }
                    else{
                        res.render('UserLoggedIn/Comments', {
                            session: req.session,
                            post: post[0],
                            comments:[],
                            formatDate:dateFunctions.displayTimeSince
                        });
                    }
                })
            })
            .catch(function (err) {
                console.log("Errror here")
                console.log(err)
                res.redirect("/home")
            })
    }
    else{
        res.redirect("/home");
    }            
});
router.post('/addComment', 
check('postId').isString().trim(),
check('message').isString().trim(),
function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //redirect to index if error
      res.redirect('/');
      console.log(errors)
    }
        //add comment to CommentsDB
        //if the post is a youtube link
        if(req.body.thumbnail){
            console.log(req.body.thumbnail)
            comments.addYTComment(req.body.postId, req.session.handle, req.session.img, req.body.message, req.body.attachments)
            .then(function(data){
                //add notification
                timeline.incrementCommentCount(req.body.postId)
                .then(function(){
                notifications.addNotification(req.body.handle ,req.body.name,"commented on your post", req.body.img, "/post/"+req.body.postId)
                .then(function(){
                    new Promise((resolve, reject) => {
                        users.incrementNotificationCount(req.body.handle);
                        resolve(true);
                    })
                    .then(function(){
                        //send email
                        users.getEmailByHandle(req.body.handle)
                        .then(function(data1){
                            emailFunction.createEmail(data1[0].email, "comment", req)
                            .then(()=>{
                                res.status(202).json({
                                    post:data,
                                }).end(); 
                            })
                        })
                    })
                })
                })
                .catch(function(err){
                    console.log(err)
                })
            })
            .catch(function(err){
                console.log(err);
                res.redirect("/");
            });
        }
        else{
            comments.addComment(req.body.postId, req.session.handle, req.session.img, req.body.message, req.body.attachments)
            .then(function(data){
                console.log("Commment added")
                //add notification
                timeline.incrementCommentCount(req.body.postId)
                .then(function(){
                notifications.addNotification(req.body.handle ,req.body.name,"commented on your post", req.body.img, "/post/"+req.body.postId)
                .then(function(){
                    new Promise((resolve, reject) => {
                        users.incrementNotificationCount(req.body.handle);
                        resolve(true);
                    })
                    .then(function(){
                        //send email
                        users.getEmailByHandle(req.body.handle)
                        .then(function(data1){
                            emailFunction.createEmail(data1[0].email, "comment", req)
                            .then(()=>{
                                res.status(202).json({
                                    post:data,
                                }).end(); 
                            })   
                        })
                    })
                })
                })
                .catch(function(err){
                    console.log(err)
                })
            })
            .catch(function(err){
                console.log(err);
                res.redirect("/");
            });
        }      
});
module.exports = router;