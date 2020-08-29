//packages used
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
var CourseDB = require("../../models/Database/UNCC_CoursesDB");
const userDB = require('../../models/Database/UserDB');
//instantiate DBs
var users = new userDB();
var courses = new CourseDB();
//register the session and use bodyParser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
//add course to My Courses from Course Profile Page
router.post('/Course/addCourse',
    check('courseName').isString().trim().escape(),
    function (req, res) {
        //stores validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/');
        }
        courses.getCourseByName(req.body.courseName).then(function (data) {
                courses.incrementStudents(data[0].CourseName).exec();
                users.addCourse(req.session.handle, data[0].CourseName, data[0]._id, data[0].Department + " " + data[0].CourseCode)
                courses.addStudent(data[0].CourseName, req.session.img, req.session.handle, req.session.name)
                res.redirect("/Home");
            })
            .catch(function (error) {
                console.log(error)
                console.log("Add course threw an error")
                res.redirect("/Home")
            })

    });
module.exports = router;