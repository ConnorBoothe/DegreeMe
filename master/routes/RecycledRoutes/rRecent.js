var express = require('express');
var router = express.Router();
var session = require('express-session');
var subjectList = require("../../models/subjectList");
var userDB = require('../../models/classes/UserDB');
var Connection = require('../../models/classes/Connection');
var userConnection = require('../../models/classes/UserConnection');

var connectionsDB = require('../../models/classes/connectionsDB');
const NotificationList = require('../../models/classes/NotificationList');
var bodyParser = require('body-parser');
var session = require('express-session');
var Student = require("../../models/classes/Student");
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var {check, validationResult} = require('express-validator');
var userDB1 = new userDB();
var TutorDB = new connectionsDB();

var notifications = new NotificationList();

//render the create connection page
router.get('/Recent', function(req, res){
  if(req.session.userId){
    notifications.getAll(req.session.userId).exec((err,docs)=>{
      for( var x=0; x<20;x++){
   
      }
   
      res.render('Recent', {qs:req.query,session:req.session,schoolArray:subjectList.schoolArray, querySchool: subjectList.querySchool,qs:req.query, notifications:docs});
    })
  
  }
  else{
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In');
  }
    
});


module.exports = router;