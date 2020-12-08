//This is the controller for the Events Functionality
//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const unirest = require('unirest');
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

});
//add a new event to the calendar
router.post('/addEvent', function (req, res) {

});
//remove event from calendar
router.post('/removeEvent', function (req, res) {

});
//add member to event
router.post('/addMemberToEvent', function (req, res) {

});
module.exports = router;


