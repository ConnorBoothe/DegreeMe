require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const csp = require("helmet-csp");
const https = require('https');
const fs = require('fs');
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){

});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);
var app = module.exports = express(); 
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

//set cookie to secure to true for production
app.use(session({
  store: new MongoStore({
     mongooseConnection: mongoose.connection
    }),
    secret: 'toolbox1217!',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false,
        maxAge:  6*60*60*1000 },
  }));
//middleware to make userId available in all templates
/*
app.use(function(req, res, next) {
  res.locals.userId = req.session.userId;
  res.locals.handle = req.session.handle;
  next();
});
*/
app.set('trust proxy', 1) // trust first proxy
//classes used
const StreamDB = require('./models/Database/StreamDB');
const NotificationsDB = require('./models/Database/NotificationDB');
const UserDB = require('./models/Database/UserDB');
var users = new UserDB();
var stream = new StreamDB();
var notifications = new NotificationsDB();

// const { resolve } = require('path');
const Threads = require('./models/Database/Threads');
const Messages = require('./models/Database/Messages');

//instantiate DBs for use
var messages = new Messages();
// var messages = new MessageDB();
var threads = new Threads();
//set limit size of file upload
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended:true
}));
// set the Content Security Policy of the app
// app.use(
//     csp({
//       directives: {
//         defaultSrc: ["'self'", "https://js.stripe.com/",  "ws://degreeme.io/socket.io/" ],
//         connectSrc:["'self'", "ws://degreeme.io/socket.io/","wss://degreeme.io/socket.io/", "https://firebasestorage.googleapis.com/", "https://www.googleapis.com/"],
//         frameSrc:["https://firebasestorage.googleapis.com"],
//         fontSrc:["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com"],
//         styleSrc:["'self'", "https://maxcdn.bootstrapcdn.com", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdnjs.cloudflare.com/", "https://use.fontawesome.com"],
//         scriptSrc: ["'self'", "https://cdnjs.cloudflare.com/","https://maxcdn.bootstrapcdn.com", "https://js.stripe.com/", "https://www.gstatic.com", "https://firebase.googleapis.com/", "https://*.googleapis.com", "https://cdn.jsdelivr.net/"],
//         imgSrc:["'self'", "https://i.ytimg.com/", "data:", "https://storage.googleapis.com/", "https://firebasestorage.googleapis.com", "https://cdnjs.cloudflare.com"],
//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: [],
//       },
//       reportOnly: false,
//     })
//   );
// add additional layers of security
// app.use(helmet({
//     contentSecurityPolicy:false //security policy already set above
// }));
app.set('view engine', 'ejs'); //set the view engine to ejs
app.use('/assets', express.static('assets')); //use assets folder for static files
//events scheduled to run on the server
app.use(require('./routes/scheduledEvents/updateListings.js')); 
app.use(require('./routes/scheduledEvents/chargePayments.js')); 
//User Account Routes
app.use([
  require('./routes/UserAccount/rSignUp'),
  require('./routes/UserAccount/rVerify.js'),
  require('./routes/UserAccount/rUpdatePassword.js'),
  require('./routes/UserAccount/rLogout.js'),
  require('./routes/UserAccount/rLogin.js'),
  require('./routes/UserAccount/SendEmailInvite.js'),
])
//Message routes
app.use([
  require('./routes/Messages/rMessages.js'),
  require('./routes/Messages/rMessageMembers.js'),
  require('./routes/Messages/rGetMessageSet.js'),
  require('./routes/Messages/rGetThreadImages.js'),
  require('./routes/Messages/rSendDirectMessage.js')
])
//User not logged in routes
app.use([
 require('./routes/UserNotLoggedIn/rIndex'),
 require('./routes/UserNotLoggedIn/rAbout'),
 require('./routes/UserNotLoggedIn/rJobs'),
 require('./routes/UserNotLoggedIn/rPrivacy'),
 require('./routes/UserNotLoggedIn/rPolicies'),
 require('./routes/UserLoggedIn/rMeeting.js'),
 require('./routes/UserNotLoggedIn/rContact.js'),
 require('./routes/UserNotLoggedIn/rCourseSearch.js'),
 require('./routes/UserNotLoggedIn/rSearchStudents.js'),
]); 
//UserLoggedIn routes
app.use([
  require('./routes/UserLoggedIn/rSettings.js'),
  require('./routes/UserLoggedIn/rSetUserStatus.js'),
  require('./routes/UserLoggedIn/rMyFinances.js'),
  require('./routes/UserLoggedIn/rStudyGroups.js'),
  require('./routes/UserLoggedIn/rMeetups.js'),
  require('./routes/UserLoggedIn/rCheckout.js'),
  require('./routes/UserLoggedIn/rEvents.js'),
  require('./routes/UserLoggedIn/rConnectByMajor.js'),
  require('./routes/UserLoggedIn/rReview.js'),
  require('./routes/UserLoggedIn/rCourseProfile.js'),
  require('./routes/UserLoggedIn/rUserProfile.js'),
  require('./routes/UserLoggedIn/rAddZoomMeeting.js'),
  require('./routes/UserAccount/rHome.js'),
  require('./routes/UserLoggedIn/rTutorSchedule.js'),
  require('./routes/UserLoggedIn/rStudyGroupProfile.js'),
  require('./routes/UserLoggedIn/rMeetupProfile.js'),
  require('./routes/UserAccount/rAddCourse.js'),
  require('./routes/UserLoggedIn/rComments.js'),
  require('./routes/UserLoggedIn/rAdmin.js'),
  require('./routes/UserLoggedIn/rAskQuestion.js'),
  require('./routes/Video/rVideoChat.js')
]); 
 
//API Routes
app.use([
  require('./routes/API/SendStudyGroupData.js'),
  require('./routes/API/sendMeetups.js'),
  require('./routes/API/sendUserHandles.js'),
  require('./routes/API/SendNotifications.js'),
  require('./routes/API/sendTutors.js'),
  require('./routes/API/getMyCourses.js'),
  require('./routes/API/SendDiscussion.js'),
  require('./routes/API/SendMessageThreads.js'),
  require('./routes/API/SendMajors.js'),
  require('./routes/API/sendNotificationCount.js'),
  require('./routes/API/sendSortedStudyGroups.js'),
  require('./routes/API/sendUsersAndImages.js')
]); 


//Wildcard route
app.get('*', function(req, res) {
    //if user logged in, redirect to home
    if(req.session.userId){
        res.redirect('/home');
    }
    //redirect to index
    else{
        res.redirect('/');
    }
});

let server = https.createServer(options, app).listen(3000);
const io = require('socket.io')(server);
var members = [];
let broadcaster;
//create a websocket connection
io.sockets.on('connection', function (socket) {
  console.log("Server socket connected")
  // //join video chat room
  socket.on('join-room', function (roomId, peerId, userHandle, userId) {

    socket.to(roomId).emit('user-joined',peerId);
    //join the room
    socket.join(roomId);
    //send message to everyone in room, but don't send back to me
    socket.to(roomId).broadcast.emit("user-connected", peerId);
  
      stream.addMember(roomId, userId)
      .then(function(userId){
        // console.log("added userId: " + userId._id);
      })
      socket.on("disconnect", () => {
        
        stream.getStreamHost(roomId).then(function(host){
          users.getUserImg(userHandle).then(function(user){
            notifications.addNotification(userHandle ,userHandle,"Leave "+ host.host + " a review", user.img, "/review/"+host.host)
            .then(()=>{
              users.incrementNotificationCount(userHandle);
            })

          })
        })
        socket.to(roomId).broadcast.emit("user-disconnected", peerId)

        stream.leaveStream(roomId, userId)
        .then(function(){
        })
      })
    });
    
  //catch the emitted 'send message' event
  socket.on('send message', function (data) {
    console.log("Adding message")
      //add message to the db
      console.log("Adding message")
      messages.addMessage(data.id, data.sender, data.senderImg, data.content, data.date, "text")
      .then(function(message){
        io.sockets.emit('new message', {
          msg: message
      });
      })
      
  });
  //handle new chat event
  socket.on('new chat', function (data) {
    //add message to the db
    stream.addChat(data.id, data.sender, data.message, data.img)
    .then(function(data){
      io.sockets.emit('append chat', {
        sender: data.sender,
        message: data.message,
        img: data.senderImg
    });
    })
  })
  socket.on('send image', function (data) {
  //   add message to the db
  //  add image to me   console.log("sending image")
  messages.addMessage(data.id, data.sender, data.senderImg, data.content, data.date, "file")
   .then(function(success){
     if(success){
      socket.emit("append image", {image:data.content, imageArray: data.imageArray });
     }
   })
   .catch(function(error){
     console.log(error)
   })
  
});
socket.on('send youtube link', function (data) {
  messages.addYoutubeData(data)
  .then(()=>{
    socket.emit("append youtube info", {
      video: data
    })
    .catch((err)=>{
      console.log(err)
    })
  })
  
  
});
  socket.on("broadcaster", () => {
    broadcaster = socket.id;
    socket.broadcast.emit("broadcaster");
  });

  socket.on("watcher", () => {
    socket.to(broadcaster).emit("watcher", socket.id);
  });

  socket.on("disconnect", () => {
    socket.to(broadcaster).emit("disconnectPeer", socket.id);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
});

socket.on("answer", (id, message) => {
  socket.to(id).emit("answer", socket.id, message);
});

socket.on("candidate", (id, message) => {
  socket.to(id).emit("candidate", socket.id, message);
});

})