//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    console.log(err);
});
var MongoStore = require('connect-mongo')(session);
router.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection
       }),
    secret: 'toolbox1217!',
    resave: true,
    saveUninitialized: true
}));
//render the index page
router.get('/', function(req, res){
    if(req.session.userId){
        res.redirect("/home")
    }
    else{
        res.render('UserNotLoggedIn/index');
    }
    
});
module.exports = router;