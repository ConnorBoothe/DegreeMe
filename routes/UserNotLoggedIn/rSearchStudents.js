//Not currently being used

var express = require('express');
var router = express.Router();
var session = require('express-session');
const userDB = require('../../models/Database/UserDB');
var users = new userDB();
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));




//render the about page
router.get('/searchStudents/:major', function (req, res) {

    users.getUsersByMajor(req.params.major).exec((err, docs) => {
        res.render('UserNotLoggedIn/searchStudents', { students: docs, major: req.params.major });
    })

});
router.get('/searchStudents', function (req, res) {

    users.getAllUsers().exec((err, docs) => {

        res.render('UserNotLoggedIn/searchStudents', { students: docs, major: "" });
    })

});
module.exports = router;