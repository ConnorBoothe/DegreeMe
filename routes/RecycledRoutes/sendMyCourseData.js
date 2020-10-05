var express = require('express');
var router = express.Router();
var ListingsDB = require('../../models/Database/ListingsDB');
var UserDB = require('../../models/Database/UserDB');
var listings = new ListingsDB();
var users = new UserDB();

//get a list of tutors and send them to the browser to be used in search tutors ajax request
router.get('/MyCourses', function(req, res){
    if(req.session.userId){
        users.getUserByEmail(req.session.email).exec((err,docs)=>{ //get array of tutors
            var courses = new Array;
            for(x in docs[0].myCourses){
                
                courses.push(docs[0].myCourses[x]);
            }
            res.json(courses);
        });
    }
    else{
        res.json("User Not Logged In");
    }
       
    

});
module.exports = router;