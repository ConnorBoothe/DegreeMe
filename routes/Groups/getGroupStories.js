//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const StoryDB = require('../../models/Database/StoryDB.js');
const stories = new StoryDB();
router.post("/getStory", (req, res)=>{

        stories.getGroupStory(req.body.groupId)
        .then((stories)=>{
            res.status(202).json({
                stories: stories
            }).end();
        })
        .catch((err)=> {
          res.json("An error occurred")
        })
    
  })
  module.exports = router;