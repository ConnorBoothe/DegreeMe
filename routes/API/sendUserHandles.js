var express = require('express');
var router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var UserDB = require('../../models/Database/UserDB');
var users = new UserDB();

//send list of all users
router.get('/API/Users', function(req, res){
    users.getAllUsers().exec((err,docs)=>{
        var userHandles = [];
        var userEmails = [];
        for(x in docs){
            userHandles.push(docs[x].handle.toLowerCase());
            userEmails.push(docs[x].email.toLowerCase())
        }
        res.json([userHandles, userEmails]);
    });
});
module.exports = router;