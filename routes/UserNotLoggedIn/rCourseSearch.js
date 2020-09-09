//not currently using this
//packages used
var express = require('express');
var router = express.Router();
var session = require('express-session');
const bodyParser = require("body-parser");
//classes used
var ListingsDB = require('../../models/Database/ListingsDB');
var Tutor = require('../../models/classes/Tutor');

//instantiate DBs for use
var connectionsDB = new ListingsDB();

//use the session and bodyParser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/courseSearch', function (req, res) {
    connectionsDB.getTutorArrayByCourse(req.query.course.trim()).exec((err, docs) => { //Get tutor list for the inputted course
        var tutorArray = new Array;
        if (docs) {
            for (x in docs) {
                //Create temp tutor object from DB and push it to the arr
                var temp = new Tutor(docs[x]._id, docs[x].UserID, docs[x].Name, docs[x].Handle, docs[x].Subject, docs[x].Grade, docs[x].HourlyRate, docs[x].NumHours, docs[x].School, docs[x].Type, docs[x].Time,
                    docs[x].Date, docs[x].MinStudents, docs[x].MaxStudents, docs[x].Building, docs[x].Room, docs[x].StudentsAttending, docs[x].Image);
                tutorArray.push(temp);
            }
            res.render('UserNotLoggedIn/connections', {
                qs: req.query,
                tutorArray: tutorArray
            });
        } else {
            res.render('/', {
                qs: req.query,
                session: req.session,
                tutorArray: tutorArray,
                subjectArray: subjectArray,
                subjectGroups: subjectGroups,
                tutorCount: tutorCount,
                schoolArray: schoolArray,
                querySchool: querySchool,
                subject: "No tutors for this course"
            });
        }
    });

});
//post route that handles course search on index page
router.post('/SearchCourses', function (req, res) {
    res.redirect("/courseSearch?course=" + req.body.course);

});
module.exports = router;