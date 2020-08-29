const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var TimelineDB = require('../../models/Database/TimeLineDB');
var timeline = new TimelineDB();
//send list of my courses
// router.get('/API/UserTimeline', function(req, res){
//     if(req.session.email){
//         timeline.getUserTimeline(req.session.following).exec((err,docs)=>{
//             if(err){
//                 console.log(err)
//                 res.send(err)
//             }
//             else{
//                 res.send(docs);
//             }
            
//         });
//     }
//     else{
//         res.send("User not logged in");
//     } 
// });
module.exports = router;