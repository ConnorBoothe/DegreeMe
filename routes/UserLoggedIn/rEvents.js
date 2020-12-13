//This is the controller for the Events Functionality
//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const unirest = require('unirest');
const moment = require("moment");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);
const nodemailer = require("nodemailer");
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const EventsDB = require("../../models/Database/EventsDB");
const UserDB = require('../../models/Database/UserDB');

//classes used
var users = new UserDB();
var events = new EventsDB();

//use the session with session store
router.use(session({
    store: new MongoStore({
       mongooseConnection: mongoose.connection
      }),
      secret: 'toolbox1217!',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: true,
          maxAge:  6*60*60*1000 },
    }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
    resave: false,
    saveUninitialized: true
}));
//render the calendar view
router.get('/calendar', function (req, res) {
    //if user logged in, render calendarUI
    console.log("we're here");
    if(req.session.userId){
        res.render('UserLoggedIn/Calendar', {
            qs: req.query,
            session: req.session,
            params: req.params
        });
    }
    //redirect to index

});
router.get('/calendar/getEvents', function(req, res){
 events.getEventsByUserId(req.session.userId).exec(function(err,calendarEvents){

    if(err){
        console.log(err);
    }
    var formattedEvents = [];
     calendarEvents.map((e)=>{

        var formattedDate = moment(e.date).format("yyyy-MM-DDTHH:mm:ss");
        console.log(formattedDate);
        var newEvent = {...e, ...{date:formattedDate}}
        formattedEvents.push(newEvent);
    })
    console.log(formattedEvents);
    res.send(formattedEvents);
 });
 
})
//add a new event to the calendar
router.post('/calendar/addEvent', function (req, res) {
    var eventDoc = events.addEvent(req.session.userId,req.body.start,req.body.duration,req.body.title,req.body.description,req.body.type,req.session.streamId,req.body.location);

    eventDoc.save(function(err,event){
        if(err){
            console.log(err);
        }
        res.send(event);
    })
});
//remove event from calendar
router.delete('/calendar/removeEvent', function (req, res) {
events.deleteEvent(req.body.id).then(function(err,event){

    if(err){
        console.log(err);
    }
    res.send({message:"event deleted successfully!"});
    }).catch((err)=>{
    console.log(err);
    });
});

//update event
router.post('/calendar/updateEvent', function(req, res){
    events.updateEvent(req.body.id,req.body.start,req.body.duration,req.body.title,req.body.description,req.body.type,req.session.streamId,req.body.location).then(function(err,event){
        if(err){
            console.log(err);
        }
        res.send({message:"event edited successfully!"});
    }).catch((err)=>{
    console.log(err);
    });
});

//add member to event
router.post('/addMemberToEvent', function (req, res) {

});

module.exports = router;


