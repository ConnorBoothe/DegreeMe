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
//log the user out when they click logout on the user dropdown menuA
router.get('/logout', function (req, res) {
    //destroy the session
    req.session.destroy(function (err) {
        if (err) {
            res.negotiate(err);
        }
        else{
             //redirect to index
            res.redirect('/');
        }
    });
   
});
module.exports = router;