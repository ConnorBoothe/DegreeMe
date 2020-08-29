const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var reviewsDB = require('../../models/Database/ReviewsDB');
var reviews = new reviewsDB();
//send list of my courses
router.get('/API/reviews', function(req, res){
    if(req.session.email){
        reviews.getReviewsByHandle(req.session.handle).exec((err,docs)=>{
            if(err){
                res.send("An error occurred.")
            }
            res.send(docs);
        });
    }
    else{
        res.send("User not logged in");
    } 
});
module.exports = router;