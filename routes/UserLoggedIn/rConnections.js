//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
const session = require('express-session');
const bodyParser = require("body-parser");
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const ListingsDB = require('../../models/Database/ListingsDB');
//classes used
const Tutor = require('../../models/classes/Tutor');
//instantiate DBs
var listings = new ListingsDB();
//use the session and bodyParser
router.use(session({
    store: new DatastoreStore({
        kind: 'express-sessions',
     
        // Optional: expire the session after this many milliseconds.
        // note: datastore does not automatically delete all expired sessions
        // you may want to run separate cleanup requests to remove expired sessions
        // 0 means do not expire
        expirationMs: 0,
     
        dataset: new Datastore({
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
          // project ID here:
          projectId: process.env.GCLOUD_PROJECT,
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
          // explicitly pass in that path to your key file here:
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        })
      }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
  }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post("/tutorResults/searchCourse",
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/Home');
        }
        res.redirect("/tutorResults/" + req.body.course);
    })
router.post("/searchCourse",
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/Home');
        }
        res.redirect("/tutorResults/" + req.body.course);
    })
router.get('/tutorResults/:Course', function (req, res) {
    //check if session has started
    if (req.session.userId) {
        console.log(req.params.Course)
        //check query string for course
        if (req.params.Course) {
            //get courses from DB that match course search
            listings.getTutorArrayByCourse(req.params.Course.trim()).exec((err, docs) => {

                if (docs.length > 0) {
                
                    var numTutors = 0;
                    var courses = [];
                    for (var x = docs.length - 1; x >= 0; x--) {
                        numTutors++;
                        //only return results with open timeslots
                        if (docs[x].Schedule.length > 0) {
                            //(id,UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, Building, Room, StudentsAttending, img, Rating)
                            var temp = new Tutor(docs[x]._id, docs[x].UserID, docs[x].Handle, docs[x].Name, docs[x].Subject, docs[x].Grade,
                                docs[x].HourlyRate, docs[x].NumHours, docs[x].School, docs[x].Type, docs[x].Schedule,
                                docs[x].MaxStudents, docs[x].StudentsAttending, docs[x].Image, 0, docs[x].CourseCode);
                            courses.push(temp);
                        }
                    }

                    res.render('UserLoggedIn/searchResults', {
                        course: req.params.Course,
                        session: req.session,
                        tutorCount: numTutors,
                        subject: courses,
                        subjectName: req.params.Course.trim(),
                        noSearch: false,
                        image: ""
                    });
                } else {
                    res.render('UserLoggedIn/searchResults', {
                        course: req.params.Course,
                        params: req.params,
                        session: req.session,
                        tutorCount: 0,
                        subject: [],
                        subjectName: req.params.Course.trim(),
                        noSearch: false,
                        //put image path here
                        image: "/assets/img/tutorNotFound3.svg"
                    });
                }

            });
        } else {
            res.render('UserLoggedIn/searchResults', {
                course: req.params.Course,
                params: req.params,
                session: req.session,
                tutorCount: 0,
                subject: [],
                subjectName: req.params.Course.trim(),
                noSearch: true,
                image: ""

            });
        }
    }

    //if session doesn't exist, redirect to login
    else {

        res.redirect('/login?error=Session%20Ended');
    }

});

router.get('/tutorResults/', function (req, res) {
    if(req.session.handle){
        res.render('UserLoggedIn/searchResults', {
            course: "",
            params: req.params,
            session: req.session,
            tutorCount: 0,
            subject: [],
            subjectName: "",
            noSearch: true,
            image: ""
        });
    }
    else{
        res.redirect("/");
    }
});


module.exports = router;