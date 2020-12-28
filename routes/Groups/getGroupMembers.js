//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const StudyGroupDB = require('../../models/Database/StudyGroupsDB.js');
const groups = new StudyGroupDB();
router.get("/groupMembers/:groupId", (req, res)=>{
    if(req.params.groupId) {
        groups.getGroupMembers(req.params.groupId)
        .then((groups)=>{
          res.json(groups)
        })
        .catch((err)=> {
          res.json("An error occurred")
        })
    }
    else {
        res.json("No group ID provided");
    }
    
  })
  module.exports = router;