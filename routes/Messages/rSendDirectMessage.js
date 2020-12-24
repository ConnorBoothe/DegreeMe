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
const Messages = require('../../models/Database/Messages');
const Threads = require('../../models/Database/Threads');
//instantiate DBs
const users = new UserDB();
const messages = new Messages();
const threads = new Threads();

//send direct message controller
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
    //create a new thread for the conversation
    threads.newThread(req.session.handle, req.session.img, [
            [req.session.handle, req.session.img],
            [req.body.receiver, req.body.receiverImg]
        ],
        new Date(), req.body.host + ", " + req.body.receiver)
        .then(function (data) {
        //save the id
        messageId = data._id;
        //add first user to thread
        users.addThread(req.session.handle, req.session.img, req.session.handle + 
            ", " + req.body.receiver, data._id, req.body.host).then(function(){
                //add second user to thread
                users.addThread(req.session.handle, req.session.img, req.session.handle 
                    + ", " + req.body.receiver, data._id, req.body.receiver).then(function(){
                        //add the message to message DB
                        messages.addMessage(data._id, req.session.handle, req.session.img, 
                            req.body.message, data.datetime, "text")
                            .then(function(){
                                //send response containing threadIdto the frontend
                                res.status(202).json({
                                    messageId: messageId
                                })
                            })
                    })
            })
    })
    .catch((err)=>{
        console.log(err)
    })
})
module.exports = router;