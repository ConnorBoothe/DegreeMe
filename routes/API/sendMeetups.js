var express = require('express');
var router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var MeetupsDB = require('../../models/Database/MeetupsDB');
var meetups = new MeetupsDB();
//send users meetups
router.get('/API/Meetups', function(req, res){
    if(req.session.userId){
        meetups.getMeetupsByHandle(req.session.handle).exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            res.json(docs);
        });
    }
    else{
        res.json("User not logged in")
    }
});
module.exports = router;