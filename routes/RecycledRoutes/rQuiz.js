var express = require('express');
var {check, validationResult} = require('express-validator');
var router = express.Router();
var subjectList = require("../../models/RecycledClasses/subjectList");
var bodyParser = require('body-parser');
var session = require('express-session');
var connectionsDB = require("../../models/classes/connectionsDB");
//register the session
router.use(session({secret:'iloveu'}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  
  extended:true}));
const mongoose = require('mongoose');
var connections = new connectionsDB();

//render the create connection page
router.get('/KnowledgeCheck', function(req, res){
  if(req.session.userId){
    res.render('Quiz', {qs:req.query,session:req.session,schoolArray:subjectList.schoolArray, querySchool: subjectList.querySchool,qs:req.query});
  }
  else{
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In');
  }
    
});
router.get('/QuizResults', function(req, res){
  if(req.session.userId){
    res.render('QuizResults', {qs:req.query,session:req.session,schoolArray:subjectList.schoolArray, querySchool: subjectList.querySchool,qs:req.query});
  }
  else{
    res.redirect('/login?error=User%20Not%20Currently%20Logged%20In');
  }
    
});
router.post('/takeQuiz',function(req, res){
    
    
    res.redirect('/KnowledgeCheck?course='+req.body.subject);
});
router.post('/submitQuiz',function(req, res){
  
  res.redirect('/QuizResults?course=Math');
});


module.exports = router;