const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var UserDB = require('../../models/Database/UserDB');
var users = new UserDB();
//send list of my courses
router.get('/API/MyCourses', function(req, res){
    if(req.session.email){
        users.getUserByEmail(req.session.email).exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            res.json(docs[0].myCourses);
        });
    }
    else{
        res.json("User not logged in");
    } 
});
module.exports = router;