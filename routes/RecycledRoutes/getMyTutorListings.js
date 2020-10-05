const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var ListingsDB = require('../../models/Database/ListingsDB');
var listings = new ListingsDB();
//send user's listings
router.get('/API/myListings', function(req, res){
    if(req.session.email){
        listings.getListingsByUserID(req.session.userId).exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            var currListings = [];
            for(x in docs){
                if(docs[x].Schedule.length > 0){
                    currListings.push(docs[x])
                }
            }
            res.json(currListings)
        });
    }
    else{
        res.json("User not logged in");
    } 
});
module.exports = router;