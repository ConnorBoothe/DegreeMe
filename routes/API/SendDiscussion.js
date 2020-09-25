const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const DiscussionDB = require('../../models/Database/DiscussionBoardDB');
const discussion = new DiscussionDB();
//send list of all users to the browser
router.get('/API/Discussion', function(req, res){
        if(req.session.handle){
            discussion.getAllDiscussions().exec((err,docs)=>{
                res.json({discussion:docs, currHandle:req.session.handle});
            })
        }
        else{
            res.json("User not logged in")
        }  
});
module.exports = router;