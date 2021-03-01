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
router.get('/about', function(req, res){
    res.render('UserNotLoggedIn/aboutUs',{session:req.session});
});
module.exports = router;