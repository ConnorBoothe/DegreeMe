//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const UserDB = require('../../models/Database/UserDB.js');
const NotificationDB = require('../../models/Database/NotificationDB.js');

const users = new UserDB();
const groups = new StudyGroupDB();
const notifications = new NotificationDB();
router.post("/privateGroupRequest", (req, res)=>{
        console.log("remove member")
        groups.addMember(req.body.groupId, req.session.handle, req.session.img, "Pending")
        .then(()=>{
            notifications.addNotification(req.body.hostHandle, req.session.name, " wants to join "+req.body.groupName,
            req.session.img, "/approveMembers/"+req.body.groupId) 
            .then(()=>{
                res.status(202).json({
                    groupId: req.body.groupId,
                    handle: req.body.handle
                }).end();
            })
        })
        .catch((err)=> {
           console.log(err)
        })
    
    
  })
  router.post("/requestResponse", (req, res)=>{
      console.log(req.body.response)
      if(req.body.response == "Reject") {
        groups.removeMember(req.body.groupId, req.body.handle)
        .then(()=>{
            console.log("DONE REMOVE")
            res.status(202).json({
                groupId: req.body.groupId,
                handle: req.body.handle
            }).end();
        })
        .catch((err)=>{
            console.log(err)
        })

      }
      else {
        groups.approveMember(req.body.groupId, req.body.handle)
        .then(()=>{
            notifications.addNotification(req.body.handle, req.session.name, " approved you for "+req.body.groupName,
            req.session.img, "/Group/"+req.body.groupId) 
        .then(()=>{
            res.status(202).json({
                groupId: req.body.groupId,
                handle: req.body.handle
            }).end();
        })
        .catch((err)=>{
            console.log(err)
        })
        })
      }
           
    


})
  module.exports = router;