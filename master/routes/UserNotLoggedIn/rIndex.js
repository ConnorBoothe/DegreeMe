//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the index page
router.get('/', function(req, res){
    res.render('UserNotLoggedIn/index');
});
module.exports = router;