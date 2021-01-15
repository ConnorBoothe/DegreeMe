//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StoryDB = require('../../models/Database/StoryDB.js');
const stories = new StoryDB();

router.post("/addStory", (req, res)=>{
    console.log("Add Story Req: " + req.body.text)
    //add image to story
    if(req.body.type == "image") {
        stories.addImageStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(),  req.body.duration, req.body.text, req.body.url)
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
    }
    //add poll to story
    else if (req.body.type == "poll") {
        console.log(req.body)
        stories.addPollStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(),  req.body.duration, req.body.text, req.body.question, 
            [req.body.option1, req.body.option2])
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
    }
    else if (req.body.type == "multiple") {
        console.log("ADDING multiple")
        stories.addMultipleChoiceStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(),  req.body.duration, req.body.text, req.body.question, 
            [req.body.option1, req.body.option2,req.body.option3, req.body.option4 ], req.body.correct)
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
    }
    
  })
  module.exports = router;