//not currently using
var express = require('express');
var router = express.Router();
var session = require('express-session');
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
var ListingsDB = require('../../models/Database/ListingsDB.js')
var Tutor = require('../../models/classes/Tutor.js')

//instantiate DB classes
var listings = new ListingsDB();
router.get('/findATutor', function (req, res) {
    
        //check query string for course
        if (req.query.course) {
            //get courses from DB that match course search
            listings.getTutorArrayByCourse(req.query.course.trim()).exec((err, docs) => {
                if (docs.length > 0) {
                    var numTutors = 0;
                    var courses = [];
                    for (x in docs) {
                        numTutors++;
                        //create tutor objects from DB results
                        //(id,UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, Building, Room, StudentsAttending, img, Rating)
                        var temp = new Tutor(docs[x]._id, docs[x].UserID, docs[x].Handle, docs[x].Name, docs[x].Subject, docs[x].Grade, 
                            docs[x].HourlyRate, docs[x].NumHours, docs[x].School, docs[x].Type, docs[x].Schedule, 
                            docs[x].MaxStudents, docs[x].Building, docs[x].Room, docs[x].StudentsAttending, docs[x].Image, 0);
                        courses.push(temp);
                    }
                    res.render('../UserNotLoggedIn/findATutor.ejs', {listings:courses, numTutors:numTutors, qs:req.query});
                    
                }
                else{
                    //if not tutors found, render search results not found
                    res.render('../UserNotLoggedIn/findATutor.ejs', {listings:"No tutors for this course", qs:req.query});
                            
               
                } 
            });
        } else {
            //count all tutors in DB and render searchResultsNotFound page
            listings.getAllListings().exec((err, docs) => {
                var courses = [];
                if( docs.length >= 20){
                    for (var x = 0; x < 20; x++) {
                        var temp = new Tutor(docs[x]._id, docs[x].UserID, docs[x].Handle, docs[x].Name, docs[x].Subject, docs[x].Grade, 
                            docs[x].HourlyRate, docs[x].NumHours, docs[x].School, docs[x].Type, docs[x].Schedule, 
                            docs[x].MaxStudents, docs[x].Building, docs[x].Room, docs[x].StudentsAttending, docs[x].Image, 0);
                        courses.push(temp);
                    }
                }
                else{
                    for (x in docs) {
                        var temp = new Tutor(docs[x]._id, docs[x].UserID, docs[x].Handle, docs[x].Name, docs[x].Subject, docs[x].Grade, 
                            docs[x].HourlyRate, docs[x].NumHours, docs[x].School, docs[x].Type, docs[x].Schedule, 
                            docs[x].MaxStudents, docs[x].Building, docs[x].Room, docs[x].StudentsAttending, docs[x].Image, 0);
                        courses.push(temp);
                    }
                }
                res.render('./UserNotLoggedIn/findATutor.ejs',{courses:courses, numTutors: "", qs:req.query});
               
            });

        }
        

    });

router.post('/findTutors', function(req, res){
    res.redirect('/findATutor?course=' + req.body.courseName);
})
    module.exports = router;
