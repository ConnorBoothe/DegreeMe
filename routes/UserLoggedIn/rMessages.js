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
const UserDB = require('../../models/Database/UserDB');
const MessageDB = require('../../models/Database/MessagesDB');
//classes used
const DateFunctions = require('../../models/classes/DateFunctions');
//instantiate DBs
var users = new UserDB();
var messages = new MessageDB();
//instantiate classes
var dateFunctions = new DateFunctions();
//get route to render the messages page

router.get('/messages', function (req, res) {
    //if the use is logged in, give user access
    if (req.session.userId) {
        //if a messageId is passed as a query string, proceed
        if (req.query.messageId) {
            //get messages by thread id
            messages.getAllMsg(req.query.messageId).exec((err, docs) => { //retrieve messages from DB
                if(docs){
                    var messages = docs[0]; //document containing messages
                    var userHandles = []; //store userhandles for the current thread
                    for (x in messages.userHandles) {
                        userHandles.push(docs[0].userHandles[x]);
                    }
                    //users.unreadCountToZero(req.session.handle.substr(1), req.query.messageId);
                    var userInThread = false;
                    for (x in userHandles) {
                        if (userHandles[x][0] === req.session.handle) {
                            userInThread = true;
                        }
                    }
                    if (userInThread) {
                        users.unreadCountToZero(req.query.messageId, req.session.handle, req, res, messages, dateFunctions.formatMessageCreatedDate, dateFunctions.displayTimeSince);
                    } else {
                        res.redirect('/Home')
                    }
                }
                else{
                    res.redirect('/Home'); //redirect docs is null, redirect
 
                }
            })
        } else {
            res.redirect('/Home'); //redirect if no query string is given
        }
    } else {
        res.redirect('/login?error=Session%20Ended'); //redirect if user is not logged in

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
            res.redirect('/Home');
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
            messages.newThread(req.body.host, req.body.hostImg, userHandleArray, new Date(req.body.date), req.body.subject).then(function (data1) {
                    var threadId = data1._id;
                    for (x in userHandleArray) {
                        users.addThread(req.body.host, req.body.hostImg, req.body.subject, threadId, userHandleArray[x][0]);
                    }
                    res.status(202).json({
                        messageId: data1._id
                    }).end();
                })
                .catch(function (err) {
                    console.log(err)
                })
        });

    });
module.exports = router;