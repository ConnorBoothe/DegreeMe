const express = require('express');
const router = express.Router();
const ListingsDB = require('../../models/Database/ListingsDB');
const {
    check,
    validationResult
  } = require('express-validator');

var listings = new ListingsDB();
//send list of study groups, courses,users, and tutor listings
router.get('/API/getAllListings', function(req, res){
    listings.getAllListings().exec((err, docs3)=>{
        res.send({Listings: docs3});
    })
});
module.exports = router;