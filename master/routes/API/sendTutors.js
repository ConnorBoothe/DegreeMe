const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const ListingsDB = require('../../models/Database/ListingsDB');
var listings = new ListingsDB();
//send list of tutors
router.get('/API/Tutors', function(req, res){
  
        listings.getAllListings().exec((err,docs)=>{
            if(err){
                res.send("An error occurred.")
            }
            res.send(docs);
        });
   
});
module.exports = router;