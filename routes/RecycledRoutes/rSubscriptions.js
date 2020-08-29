var express = require('express');
var router = express.Router();
var session = require('express-session');
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the about page
router.get('/Subscriptions', function(req, res){
    res.render('subscriptions',{session:req.session});
});
module.exports = router;