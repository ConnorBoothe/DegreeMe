//packages
const express = require('express');
const router = express.Router();

//render the index page
router.get('/', function(req, res){
    if(req.session.userId){
        res.redirect("/home")
    }
    else{
        res.render('UserNotLoggedIn/index',{session:req.session});
    }
    
});
module.exports = router;