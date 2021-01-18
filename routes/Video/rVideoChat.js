//packages
const express = require('express');
const router = express.Router();
const session = require('express-session');
const StreamDB = require("../../models/Database/StreamDB");
const MeetupDB = require("../../models/Database/MeetupsDB");
const UserDB = require("../../models/Database/UserDB");
var stream = new StreamDB();
var meetup = new MeetupDB();
var user = new UserDB();
router.use(session({
    secret:'iloveu',
    resave: true,
    saveUninitialized: true
}));
let caller = [];
let isHostIn;
router.get('/room/:id', function(req, res){
let referer = req.headers.referrer || req.headers.referer;
if(referer===undefined){
    res.redirect("/home");
    return;
}
let isInStream=false;  
console.log("this is the req.params.id "+req.params.id);
    stream.getStreamById(req.params.id)
    .then(function(stream){
        
        //check if user is already in room
        stream.members.push(req.session.userId);
        console.log(stream.members);
        if(req.session.userId===stream.hostId){
            isHostIn=true;
        }

        let count = stream.members.length;
            //render chat room
           if(req.session.userId===stream.hostId){
               user.setRoomActive(stream.host).then(function(active){
                   console.log("room is active!")
               }).catch((err)=>{
                   console.log(err);
               });
           }
            if(isHostIn||req.session.userId===stream.hostId){
                console.log("this is the instream "+req.session.isInStream);
                if(req.session.isInStream){
                    isInStream=true;
                }
                else{
                    req.session.isInStream = true;
                    req.session.previousStream = stream.id;
                }
                if(count<5){
            res.render('UserLoggedIn/Video/Viewer',{session:req.session, params: req.params, stream: stream, inStream:isInStream});
        }
        else{
            res.redirect("/home");
        }
        }
        else{
            res.render('UserLoggedIn/Video/StandBy',{session:req.session, params: req.params, stream: stream, inStream:isInStream});
        }
        // }
    })
    .catch(function(err){
         console.log(err)
    })

});
router.post("/videochat/updatehoststatus/", function(req, res){
    isHostIn=true;
    res.status(202).json({
        messages: "host is in"
    }).end();
})
router.get("/videochat/gethoststatus/", function(req, res){
    
    res.status(202).json({
        isHostIn: isHostIn
    }).end();
})
router.post("/videochat/postCallerHandle/:handle", function(req, res){
caller.push(req.params.handle);
console.log("this is the caller on post: "+caller)
res.status(202).json({
    message: "handle received"+caller
}).end();
})

router.get("/videochat/getCallerHandle/", function(req, res){
    let response;
    if(caller!=[]){
        response = caller[caller.length - 1];
    }
    caller.pop();
    console.log("this is the caller on get: "+caller)
    res.status(202).json({
        caller: response
    }).end();
})

router.post("/videoChat", function(req, res){
    stream.getChatByStream(req.body.streamId)
    .then(function(data){
        res.status(202).json({
            messages: data.chat,
            host: data.host
        }).end();
    })
})

router.post("/videochat/leaveStream/:roomID/:userId", function(req, res){
    if(req.body.duration!==undefined){
    meetup.addMeetup(req.body.role, req.body.userHandle, req.body.host, req.body.date, req.body.duration, req.body.LeftReview).
    then(function(meetup){
        console.log("meetup added to DB with id: "+meetup.id);
    }).catch((err)=>{
        console.log(err);
    })}
   req.session.isInStream = false;
   var streamHostId;
   
   console.log("formdata : "+req.params.roomID+"  "+req.params.userId);
   stream.getStreamById(req.params.roomID)
   .then(function(stream){
       stream.members.pop(req.params.userId);
       console.log(stream.members);
    streamHostId = stream.hostId;
    if(req.params.userId=== streamHostId){
        isHostIn = false;
        console.log("host is out")
        user.deactivateRoom(stream.host).then(function(active){
            console.log("room is inactive!")
        }).catch((err)=>{
            console.log(err);
        });
    }

   }).catch((err)=>{
       console.log(err)
   })

   stream.leaveStream(req.params.roomID,req.params.userId).then((result)=>{
    res.send({message: "user left room"});
    console.log("user left the stream")
   }).catch((err)=>{
    console.log(err)
})

})
router.post("/leaveStream/:id", function(req, res){
    stream.clearAllMembers(req.params.id).then((result)=>{
        res.status(202).json({
            message: "cleared all members"
        }).end();
    }).catch((err)=>{
        console.log(err)
    })
 })

router.post("/toggleChat", function(req, res){
        req.session.showChat = req.body.showChat;
        res.status(202).json({
            chatStatus: req.session.showChat,
        }).end();
    
})
module.exports = router;