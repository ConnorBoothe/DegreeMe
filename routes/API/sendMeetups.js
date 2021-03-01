var express = require('express');
var router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
var MeetupsDB = require('../../models/Database/MeetupsDB');
var EventsDB = require('../../models/Database/EventsDB');
var NotificationDB = require('../../models/Database/NotificationDB');
var UserDB = require('../../models/Database/UserDB');

var meetups = new MeetupsDB();
var events = new EventsDB();
var notifications = new NotificationDB();
var users = new UserDB();
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
router.post('/addMeetup', function(req, res){
    meetups.addTutorMeetup("Student", req.session.handle,
     req.body.hostHandle, req.body.hostId, req.body.date, 0, false, 
     req.body.course, req.body.streamId)
     .then(()=>{
         //add to calendar
         events.addEvent(req.session.userId, req.body.date,
            1,0, req.body.course + " tutoring", req.body.course + " tutoring",
            "tutoring", req.body.streamId, "NA" )
            .then(()=>{
                //add event to tutor's calendar
                events.addEvent(req.body.hostId, req.body.date,
                    1,0, req.body.course + " tutoring", req.body.course + " tutoring",
                    "tutoring", req.body.streamId, "NA" )
                    .then(()=>{
                        //add notification
                        notifications.addNotification(req.body.hostHandle, 
                            req.session.name," reserved you for "+ req.body.course + " tutoring",
                        req.session.img, "/meetups")
                        .then(()=>{
                            users.incrementNotificationCount(req.body.hostHandle)
                            .then(()=>{
                                res.status(202).json({success: true}) 
                            })
                        })
                    })
                
            })
       
    })
    .catch((err)=>{
        console.log(err)
        res.status(202).json({success: false}) 
    })
    
});
module.exports = router;