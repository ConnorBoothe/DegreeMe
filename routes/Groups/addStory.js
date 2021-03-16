//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StoryDB = require('../../models/Database/StoryDB.js');
const stories = new StoryDB();

router.post("/addStory", (req, res)=>{
    console.log(req.body)
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
        textObject = {}
        linkObject = {}
        //add poll story with no text and no link
        if(req.body.text != undefined) {
            textObject = {
                text: req.body.text,
                text_styles: ["margin-top:"+req.body.textPositionTop+"px;", 
                "margin-left:"+req.body.textPositionLeft+"px;", "color:"+req.body.textColor+";", 
                "font-size:"+req.body.fontSize+ ";"]
            }
        }
        if(req.body.link != undefined) {
            linkObject = { 
                link: req.body.link,
                link_styles: ["margin-top:"+req.body.linkOffsetTop+"px;", 
                "margin-left:"+req.body.linkOffsetLeft+"px;", "color:"+req.body.textColor+";",
                 "font-size:"+req.body.linkFontSize+ ";"]
            }
        }
        var poll_styles = ["margin-top:"+req.body.pollPositionTop+"px;", 
        "margin-left:"+req.body.pollPositionLeft+"px;"]
        
        stories.addPollStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(),  req.body.duration, req.body.text, req.body.question, 
            [req.body.option1, req.body.option2], req.body.backgroundColor, req.body.textColor,
            textObject, linkObject, poll_styles)
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
        textObject = {}
        linkObject = {}
        //add poll story with no text and no link
        if(req.body.text != undefined) {
            textObject = {
                text: req.body.text,
                text_styles: ["margin-top:"+req.body.textPositionTop+"px;", 
                "margin-left:"+req.body.textPositionLeft+"px;", "color:"+req.body.textColor+";", 
                "font-size:"+req.body.fontSize+ ";"]
            }
        }
        if(req.body.link != undefined) {
            linkObject = { 
                link: req.body.link,
                link_styles: ["margin-top:"+req.body.linkOffsetTop+"px;", 
                "margin-left:"+req.body.linkOffsetLeft+"px;", "color:"+req.body.textColor+";",
                 "font-size:"+req.body.linkFontSize+ ";"]
            }
        }
        console.log("linkObje:", linkObject)
        stories.addMultipleChoiceStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(),  req.body.duration, req.body.question, 
            [req.body.option1, req.body.option2,req.body.option3, req.body.option4 ], 
            req.body.correct, req.body.textColor, textObject, linkObject)
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
    else if (req.body.type == "text") {
        console.log("Body", req.body)
        stories.addTextStory(req.body.groupId, req.session.handle, req.session.img,
            new Date(), req.body.duration, req.body.text, req.body.textPositionTop,
             req.body.textPositionLeft, req.body.linkOffsetTop, req.body.linkOffsetLeft,
             req.body.linkFontSize, req.body.textColor, req.body.fontSize,
            req.body.backgroundColor, req.body.link)
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