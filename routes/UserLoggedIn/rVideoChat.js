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
router.get('/videoTest', function(req, res){
    console.log("VIdeo test")
    res.render('UserLoggedIn/Broadcaster',{session:req.session});
});
module.exports = router;