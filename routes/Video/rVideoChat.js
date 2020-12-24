//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
const StreamDB = require("../../models/Database/StreamDB");
var stream = new StreamDB();
router.use(session({
    secret:'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the about page
router.get('/broadcast', function(req, res){    
    res.render('UserLoggedIn/Video/Broadcaster',{session:req.session});
});
router.get('/room/:id', function(req, res){
    if(false){
        res.redirect("/home")
        console.log(req.session.inStream)
        
    }
    else {
        req.session.inStream = req.params.id;
        console.log(req.session.inStream)
        
  
    stream.getStreamById(req.params.id)
    .then(function(stream){
        //check if user is already in room
        // var inStream = false;
        // var count = 0;
        // for(var i = 0; i < stream.members.length; i++){
        //     if(stream.members[i].userId == req.session.userId){
        //         inStream = true;
        //         count++;
        //     }
        // }
        // if(inStream){
        //         //render 'already joined'
        //         res.redirect("/home");
           
        // }
        // else{
            //render chat room
            res.render('UserLoggedIn/Video/Viewer',{session:req.session, params: req.params, stream: stream});

        // }
    })
    .catch(function(err){
        // console.log(err)
    })
}
});

router.post("/videoChat", function(req, res){
    stream.getChatByStream(req.body.streamId)
    .then(function(data){
        res.status(202).json({
            messages: data.chat,
            host: data.host
        }).end();
    })
})
router.post("/leaveStream", function(req, res){
   console.log("leave stream")
})
router.post("/toggleChat", function(req, res){
        req.session.showChat = req.body.showChat;
        res.status(202).json({
            chatStatus: req.session.showChat,
        }).end();
    
})
module.exports = router;