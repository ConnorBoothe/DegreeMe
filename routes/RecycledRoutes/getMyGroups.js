const express = require('express');
const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator');
var UserDB = require('../../models/Database/UserDB');
var users = new UserDB();
//send user's listings
router.get('/API/myGroups', function(req, res){
    if(req.session.email){
        users.getUserByEmail(req.session.email).exec((err, user) => {
            if(err){
                res.json("An error occurred.")
            }
            res.json(user[0].StudyGroups)
        });
    }
    else{
        res.json("User not logged in");
    } 
});
module.exports = router;