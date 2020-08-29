//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the Jobs page
router.get('/policies', function(req, res){
    res.render('UserNotLoggedIn/policies',{session:req.session});
});
module.exports = router;