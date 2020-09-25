var express = require('express');
var router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var UserDB = require('../../models/Database/UserDB');
var users = new UserDB();

//send list of all users
router.get('/API/NewConversation', function(req, res){
    users.getAllUsers().exec((err,docs)=>{
        var users = [];
        for(x in docs){
            var userDetails = [];
            userDetails.push(docs[x].handle.toLowerCase());
            userDetails.push(docs[x].img)
            userDetails.push(docs[x].first_name + " " + docs[x].last_name)
            users.push(userDetails);
        }
        res.json(users);
    });
});
module.exports = router;