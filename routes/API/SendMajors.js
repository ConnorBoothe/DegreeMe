const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const MajorsDB = require('../../models/Database/UNCC_Majors');
var majors = new MajorsDB()
//send list of all majors
router.get('/API/Majors', function(req, res){
    majors.getAllMajors().exec((err,docs)=>{
        if(err){
            res.send("An error occurred.")
        }
        res.send(docs);
    });
    
   
    
});
module.exports = router;