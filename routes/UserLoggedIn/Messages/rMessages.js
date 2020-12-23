//packages used
require('dotenv').config();
const express = require('express');
const {
    check,
    validationResult
} = require('express-validator');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require("express-session");
const mongoose = require("mongoose");
var MongoStore = require('connect-mongo')(session);
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
//use session and bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
}));
//DBs used
const UserDB = require('../../../models/Database/UserDB');
const Messages = require('../../../models/Database/Messages');
const Threads = require('../../../models/Database/Threads');
//classes used
const DateFunctions = require('../../../models/classes/DateFunctions');
const UnescapeString = require('../../../models/classes/UnescapeString');

//instantiate DBs
var users = new UserDB();
var messages = new Messages();
var threads = new Threads();
//instantiate classes
var dateFunctions = new DateFunctions();
var unescapeString = new UnescapeString();

//get route to render the messages page

router.get('/messages/:threadId', function (req, res) {
    //if the use is logged in, give user access
    if (req.session.userId) {
        //if a messageId is passed as a query string, proceed
        if (req.params.threadId) {
            console.log("Thread running")
            //get messages by thread id
            messages.getAllMsg(req.params.threadId).then((messages) => { 
                //retrieve user handles for the current thread
                threads.getUserHandles(req.params.threadId).then(function(thread){
                    console.log(thread)
                    //check if the current user exists in the 2d array
                    if(thread.userHandles.some(row => row.includes(req.session.handle))){
                        res.render('UserLoggedIn/messages', {
                            session: req.session,
                            threadId: req.params.threadId,
                            messages: messages,
                            subject: thread.subject,
                            formatDate: dateFunctions.formatMessageCreatedDate,
                            formatTime: dateFunctions.displayTimeSince,
                            unescapeApostrophe: unescapeString.unescapeApostrophe
                        });
                        // users.unreadCountToZero(req.params.threadId, req.session.userId, req, res, messages, 
                        //     dateFunctions.formatMessageCreatedDate, dateFunctions.displayTimeSince);
                    }
                    else {
                        res.redirect('/home');
                    }
                })
            })
        } else {
            //redirect if no parameter exists
            res.redirect('/home'); 
        }
    } else {
        //redirect if user is not logged in
        res.redirect('/login?message=Session%20Ended'); 

    }
});
router.post("/createThread",
    check('userHandles').isArray(),
    check('host').isString().trim().escape(),
    check('hostImg').isString().trim(),
    check('date').trim().escape(),
    check('subject').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        //host, hostImg, subject, threadId, handle, date
        users.getUserImgs(req.body.userHandles).then(function (data1) {
            var userHandleArray = [];
             //sort alphabetically
            for (x in data1) {
                var tempArr = [];
                //ensure the correct image is assigned to the user
                for (y in req.body.userHandles) {
                    if (req.body.userHandles[y] === data1[x].handle) {
                        tempArr.push(req.body.userHandles[y]);
                        tempArr.push(data1[x].img);
                    }
                }
                userHandleArray.push(tempArr);
            }
            //    newThread(host, hostImg, userHandles, datetime, subject){
            threads.newThread(req.session.handle, req.session.img, userHandleArray, new Date(req.body.date), req.body.subject).then(function (thread) {
                    for (x in userHandleArray) {
                        users.addThread(req.body.host, req.body.hostImg, req.body.subject, thread._id, userHandleArray[x][0]);
                    }
                    res.status(202).json({
                        messageId: thread._id
                    }).end();
                })
                .catch(function (err) {
                    console.log(err)
                })
        });

    });
module.exports = router;