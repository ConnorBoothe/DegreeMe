//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
router.use(session({
    secret:'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the about page
router.get('/contact', function(req, res){
    res.render('UserNotLoggedIn/contact',{session:req.session});
});
module.exports = router;