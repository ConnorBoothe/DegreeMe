//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StoryDB = require('../../models/Database/StoryDB.js');
const stories = new StoryDB();

router.post("/addStory", (req, res)=>{
    console.log("Add Story Req: " + req.body.text)
    //add story
    stories.addStory(req.body.groupId, new Date(),  req.body.duration, req.body.text, req.body.url)
    .then((story)=>{
        console.log(story)
        console.log("Success")
        res.status(202).json({
            story: story
        }).end();

    })
    .catch((err)=> {
        console.log(err)
    })
  })
  module.exports = router;