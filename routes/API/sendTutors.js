const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const TutorDB = require('../../models/Database/TutorDB');
var tutors = new TutorDB();
//send list of tutors
router.get('/API/Tutors/:Course', function(req, res){
    if(req.params.Course) {
        tutors.getAvailableTutorsByCourse(req.params.course).then((docs)=>{
            console.log(docs)
            res.json(docs);
        })
        .catch(()=>{
            res.json("An error occurred")
        });
    }
    else {
        res.json("An error occurred.")
    }
        
   
});
module.exports = router;