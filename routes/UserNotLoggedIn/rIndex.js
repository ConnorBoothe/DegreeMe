//packages
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){

});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);
router.use(session({
    store: new MongoStore({
       mongooseConnection: mongoose.connection
      }),
      secret: 'toolbox1217!',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false,
          maxAge:  6*60*60*1000 },
    }));
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