//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
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
const UserDB = require('../../models/Database/UserDB');
const users = new UserDB();
//log the user out when they click logout on the user dropdown menuA
router.post('/updateImageURL', function (req, res) {
    users.updateImageUrl(req.session.userId, req.body.imgLink)
    .then((data)=>{
        req.session.img = req.body.imgLink;
        console.log("Update Image")
        res.status(202).json({
           img: req.body.imgLink
       }).end();
    })
     
   
});
module.exports = router;