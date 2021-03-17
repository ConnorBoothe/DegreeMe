//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const StoryResponses = require('../../models/Database/StoryResponses.js');
const storyResponses = new StoryResponses();

router.post("/addStoryResponse", (req, res)=>{
    if(req.body.type == "poll") {
        storyResponses.addPollResponse(req.body.storyId, req.session.handle,
            req.body.answer)
            .then(()=>{
                storyResponses.getPollPercentage(req.body.storyId, req.body.answer)
                .then((percentage)=>{
                    res.status(202).json({
                        matchingPercentage: percentage.matchingAnswer,
                        otherPercentage: percentage.other,
                        answer: req.body.answer
                    }).end();
                })
            })
            .catch((err)=> {
                console.log(err)
            })
    }
    else if(req.body.type == "multiple") {
        storyResponses.addMultipleChoiceResponse(req.body.storyId, req.session.handle,
            req.body.answer)
            .then((response)=>{
                    res.status(202).json({
                        correct: response.correct,
                        answer: response.answer,
                        correctAnswer: response.correctAnswer
                    }).end();
            })
            .catch((err)=> {
                console.log(err)
            })
    }
    
    
  })
  router.post("/hasResponded", (req, res)=>{
    storyResponses.hasResponded(req.body.storyId, req.session.handle)
        .then((response)=>{
            if(response){
                res.status(202).json({
                   hasResponded:true,
                   answer:response.answer,
                   storyId:response.storyId,
                   correct: response.correct

                }).end();
            }
            else{
                res.status(202).json({
                    hasResponded:false
                 }).end();
            }
                
            
        })
        .catch((err)=> {
            console.log(err)
        })
    
  })
  router.post("/getPercentage", (req, res)=>{
    storyResponses.getPollPercentage(req.body.storyId, req.body.answer)
    .then((percentage)=>{
        res.status(202).json({
            matchingPercentage: percentage.matchingAnswer,
            otherPercentage: percentage.other,
            answer: req.body.answer
        }).end();
        })
})
  module.exports = router;