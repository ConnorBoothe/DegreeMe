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
    if(req.session.userId){
        console.log(req.session.userId)
        users.getUserById(req.session.userId).exec((err,user)=>{
            if(err){
                console.log(err);
            }
            res.json(user.myCourses);
        });
    }
    else{
        res.json("User not logged in");
    } 
});
module.exports = router;