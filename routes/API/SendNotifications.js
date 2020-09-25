const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const NotificationsDB = require('../../models/Database/NotificationDB');
var notifications = new NotificationsDB();
//send user's notifications
router.get('/API/Notifications', function(req, res){
    if(req.session.userId){
        notifications.getAll(req.session.handle).exec((err,docs)=>{
            if(err){
                res.json("An error occurred.")
            }
            res.json(docs);
        });
    }
    else{
        res.json("User not logged in.")
    }
});
module.exports = router;