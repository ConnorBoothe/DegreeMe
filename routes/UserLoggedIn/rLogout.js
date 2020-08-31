//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
//log the user out when they click logout on the user dropdown menuA
router.get('/logout', function (req, res) {
    //destroy the session
    req.session.destroy(function (err) {
        if (err) {
            res.negotiate(err);
        }
    });
    //redirect to index
    res.redirect('/');
});
module.exports = router;