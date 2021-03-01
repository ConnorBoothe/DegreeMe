//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const UserDB = require('../../models/Database/UserDB.js');
const users = new UserDB();
const groups = new StudyGroupDB();
router.post("/removeGroupMember", (req, res)=>{
        console.log("remove member")
        groups.removeMember(req.body.groupId, req.body.handle)
        .then((group)=>{
            console.log(group, req.body.handle, req.body.groupId)
            users.removeGroup(req.body.handle, req.body.groupId)
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
  module.exports = router;