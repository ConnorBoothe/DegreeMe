//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const groups = new StudyGroupDB();

router.post("/addBannerImage", (req, res)=>{
    //get group handles
    console.log("ADD banner image")
    console.log(req.body)
    groups.addBannerImage(req.body.groupId, req.body.url)
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