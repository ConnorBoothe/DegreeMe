const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const CoursesDB = require('../../models/Database/UNCC_CoursesDB');
var courses = new CoursesDB();

//send list of all users to the browser
router.get('/API/courses', function(req, res){

        courses.getAllCourses().exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            res.json(docs);
        });
});
module.exports = router;