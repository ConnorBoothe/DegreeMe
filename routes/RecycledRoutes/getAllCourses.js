const express = require('express');
const router = express.Router();
const CourseDB = require('../../models/Database/UNCC_CoursesDB');
const {
    check,
    validationResult
  } = require('express-validator');
var courseDB = new CourseDB();
router.get('/API/getAllCourses', function(req, res){
    //add discussion board once DB created
    courseDB.getAllCourses().exec((err,docs1)=>{
        res.json({Courses: docs1});
    })       
});
module.exports = router;