const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const UserDB = require('../../models/Database/UserDB');
var users = new UserDB();
//send user's notification count
router.get('/API/notificationCount', function(req, res){
    if(req.session.handle){
        users.getUserByHandle(req.session.handle).exec((err,docs)=>{
            res.send(docs[0].notificationCount.toString());
        });
    }
    else{
        res.send("User not logged in")
    }
});
module.exports = router;