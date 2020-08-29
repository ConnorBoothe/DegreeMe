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
                res.send("An error occurred.")
            }
            res.send(docs[0].myCourses);
        });
    }
    else{
        res.send("User not logged in");
    } 
});
module.exports = router;