//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const UserDB = require('../../models/Database/UserDB.js');
const users = new UserDB();
const groups = new StudyGroupDB();
router.post("/updateGroupSettings", (req, res)=>{
        console.log(req.body.professor)
        console.log(req.body.course)

        groups.updateCourseSettings(req.body.groupId, req.body.course,
            req.body.professor)
        .then((group)=>{
                res.status(202).json({
                    groupId: req.body.groupId,
                    handle: req.body.handle
                }).end();
        })
        .catch((err)=> {
           console.log(err)
        })
    
    
  })
  module.exports = router;