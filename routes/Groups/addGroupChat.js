//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const ThreadsDB = require('../../models/Database/Threads.js');
const groups = new StudyGroupDB();
const threads = new ThreadsDB();

router.post("/addGroupChat", (req, res)=>{
    //get group handles
    groups.getGroupMembers(req.body.groupId)
    .then((group)=>{
        //format to be inserted into threads db
        var userHandles = [];
        for(var i = 0; i < group.Members.length; i++) {
            userHandles.push([group.Members[i].MemberHandle, 
                group.Members[i].MemberImage]);
        }
        //add new thread
        threads.newThread(req.session.handle, req.session.img, userHandles, new Date(), req.body.name)
        .then((thread)=>{
            //add the thread to the group
            groups.addGroupChat(req.body.groupId, thread._id, 
                req.body.name, "General")
            .then((group)=>{
                res.status(202).json({
                    group: group
                }).end();
            })
        })
    })
    .catch((err)=> {
        console.log(err)
    })
  })
  module.exports = router;