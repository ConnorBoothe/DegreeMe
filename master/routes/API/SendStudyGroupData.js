var express = require('express');
var router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var StudyGroupsDB = require('../../models/Database/StudyGroupsDB');
var StudyGroups = new StudyGroupsDB();

//send list of all users to the browser
router.get('/API/StudyGroups', function(req, res){
    StudyGroups.getAllStudyGroups().exec((err,docs)=>{
        res.send(docs);
    });
});
module.exports = router;