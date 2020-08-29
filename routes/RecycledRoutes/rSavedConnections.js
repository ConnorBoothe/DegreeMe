// var express = require('express');
// var router = express.Router();
// var studentList = require("../../models/studentList");
// //var userProfile = require("../../models/classes/UserConnectionDB");

// var session = require('express-session');
// router.use(session({secret:'iloveu'}));

// //render the savedConnections page
// router.get('/savedConnections', function(req, res){
//     var user = new userProfile(req.session);
//     var userConnections = user.getConnections();
//     res.render('savedConnections',{userConnections: userConnections,session:req.session});
// });
// module.exports = router;