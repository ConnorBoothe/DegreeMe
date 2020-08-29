const express = require('express');
const router = express.Router();
const UserDB = require('../../models/Database/UserDB');
var userDB = new UserDB();
const {
    check,
    validationResult
  } = require('express-validator');

router.get('/API/getAllUsers', function(req, res){
    userDB.getAllUsers().exec((err,docs2)=>{
        res.send({Users:docs2});
})
});
module.exports = router;