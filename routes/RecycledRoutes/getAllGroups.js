const express = require('express');
const router = express.Router();
const StudyGroupsDB = require('../../models/Database/StudyGroupsDB');
const {
    check,
    validationResult
  } = require('express-validator');
var StudyGroups = new StudyGroupsDB();

//send list of study groups, courses,users, and tutor listings
router.get('/API/getAllGroups', function(req, res){
    //add discussion board once DB created
    StudyGroups.getAllStudyGroups().exec((err,docs)=>{
         res.json({StudyGroups: docs});
    })
    })
module.exports = router;