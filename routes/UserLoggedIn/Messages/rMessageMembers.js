//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
//DBs used
const Threads = require('../../../models/Database/Threads');
const UserDB = require('../../../models/Database/UserDB');
const users = new UserDB();
const threads = new Threads();
router.get("/messageMembers/:threadId", function(req, res) {
    if (req.params.threadId) {
        //get user handles for the thread
        threads.getUserHandles(req.params.threadId)
        .then(function(thread){
            //create an array of handles from the 2d array of [handles][avatars]
            var handles = [];
            for(var i = 0; i < thread.userHandles.length; i++ ){
                handles.push(thread.userHandles[i][0]);
            }
            //get user status of the members in the handles array
            users.getUserStatus(handles)
            .then((userStatuses=>{
                //send members and corresponding status
                res.json({members: thread.userHandles, statusArray: userStatuses});
            }))
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    else {
        res.json({userHandles: "Invalid"});
    }
});
module.exports = router;