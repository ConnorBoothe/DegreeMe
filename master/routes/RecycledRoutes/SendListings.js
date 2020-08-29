const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const ListingsDB = require('../../models/Database/ListingsDB');
var listings = new ListingsDB();
//send users listings
router.get('/API/Listings', function(req, res){
    if(req.session.userId){
        listings.getListingsByHandle(req.session.handle).exec((err,docs)=>{
            if(err){
                res.send("An error occurred.")
            }
            res.send(docs);
        });
    }
    else{
        res.send("User not logged in.")
    }
});
module.exports = router;