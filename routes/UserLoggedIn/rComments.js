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
//classes used
var DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes
var dateFunctions = new DateFunctions();
//instantiate DBs for us
var timeline = new TimelineDB();
var comments = new CommentsDB();
var notifications = new NotificationDB();
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
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
  }));
//render the checkout page
router.get('/post/:timelineId', function (req, res) {
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

        comments.addComment(req.body.postId, req.session.handle, req.session.img, req.body.message)
        .then(function(data){
            //add notification
            notifications.addNotification(req.body.handle ,req.body.name,"commented on your post", req.body.img, "/post/"+req.body.postId)
            .then(function(){
                console.log("NOTIF added")
                new Promise((resolve, reject) => {
                    users.incrementNotificationCount(req.body.handle);
                    resolve(true);

                })
                .then(function(){
                    //send email
                    console.log("sending email")
                    console.log(req.body.postId)
                    users.getEmailByHandle(req.body.handle)
                    
                    .then(function(data1){
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
                                            "email": data1[0].email,
                                        }
                                ],
                                    "dynamic_template_data": {
                                        "subject": req.body.name + " commented on your post!",
                                        "handle": req.body.handle,
                                        "postId": req.body.postId,
                                        "message":req.body.message
                                },
                                    "subject": "You have a new follower!"
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
                                "template_id": "d-293c46ac8fbb4242ba5d755baa045572"
                            });
                            mail.end(function (resp) {
                            if (resp.error){
                                console.log("follow error: ", resp.error)
                                // res.redirect("/home")
                                // throw new Error(res.error);
                            } else if (resp.accepted){
                                console.log("email was sent for follow")
                            }
                        console.log(resp.body);
                        res.redirect("/post/"+req.body.postId)
                        })
                    })
                })
            })
            .catch(function(){
                res.redirect("/post/"+req.body.postId)     
             })
           
        })
        .catch(function(err){
            console.log(err);
            res.redirect("/post/"+req.body.postId);
        });       
});
module.exports = router;