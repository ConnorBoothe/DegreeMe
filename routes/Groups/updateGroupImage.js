//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const groups = new StudyGroupDB();

router.post("/updateGroupImage", (req, res)=>{
    //get group handles
    console.log("ADD group image")
    console.log(req.body)
    groups.updateGroupImage(req.body.groupId, req.body.imgLink)
    .then((group)=>{
        res.status(202).json({
            group: group
        }).end();
    })
    .catch((err)=> {
        console.log(err)
    })
  })
  module.exports = router;