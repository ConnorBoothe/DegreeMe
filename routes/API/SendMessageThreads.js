const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const UserDB = require('../../models/Database/UserDB');
var users = new UserDB();
//send user's message threads
router.get('/API/Threads', function(req, res){
    if(req.session.email){
        users.getThreads(req.session.userId).exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            res.json(docs.threads);
        });
    }
    else{
        res.json("User not logged in");
    }  
});
module.exports = router;