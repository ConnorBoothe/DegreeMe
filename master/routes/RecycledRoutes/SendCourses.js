const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const CoursesDB = require('../../models/Database/UNCC_CoursesDB');
var courses = new CoursesDB();

//send list of all users to the browser
router.get('/API/Courses', function(req, res){

        courses.getAllCourses().exec((err,docs)=>{
            if(err){
                res.send("An error occurred.")
            }
            res.send(docs);
        });
});
module.exports = router;