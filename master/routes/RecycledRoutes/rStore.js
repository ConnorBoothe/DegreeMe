var express = require('express');
var router = express.Router();
var session = require('express-session');
var subjectList = require("../../models/subjectList");


router.use(session({
  secret: 'iloveu',
  resave: true,
  saveUninitialized: true
}));

//render the create connection page
router.get('/Store', function(req, res){
  if(req.session.userId){
    
    res.render('UserLoggedIn/store', {qs:req.query,session:req.session,schoolArray:subjectList.schoolArray, querySchool: subjectList.querySchool,qs:req.query});
  }
  else{
    res.redirect('/login?error=Session%20Ended');
  }
    
});


module.exports = router;