//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const TutorSchedule = require("../../models/Database/TutorSchedule");
var schedule = new TutorSchedule();
router.post("/addTimeslot", function(req, res){
    console.log("adding time slot")
    schedule.addTimeslot(req.session.userId, req.body.day, req.body.time)
    .then(function(){
        res.status(202).json({
            status:"success",
        }).end();
    })
    .catch(function(err){
        console.log(err);
    })
})
router.post("/removeTimeslot", function(req, res){
    console.log("removing time slot")
    schedule.removeTimeslot(req.session.userId, req.body.day, req.body.time)
    .then(function(){
        res.status(202).json({
            status:"success",
        }).end();
    })
    .catch(function(err){
        console.log(err);
    })
})
router.post("/getScheduleByDay", function(req, res){
    console.log("Day: " ,req.body.day)
    schedule.getUserScheduleByDay(req.session.userId, req.body.day)
    .then(function(data){
        var times = [];
        for(var i = 0; i < data.length; i++){
            times.push(data[i].time);
        }
        console.log(times)
        res.status(202).json({
            data:times,
        }).end();
    })
    .catch(function(err){
        console.log(err)
    })
})
module.exports = router;