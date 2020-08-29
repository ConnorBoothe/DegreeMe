var express = require('express');
var router = express.Router();
var subjectList = require("../../models/subjectList");
var session = require('express-session');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the about page
router.get('/update', function(req, res){
    res.render('update',{session:req.session,schoolArray:subjectList.schoolArray});
});

module.exports = router;