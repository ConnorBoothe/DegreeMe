require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const csp = require("helmet-csp");
var app = module.exports = express(); 
app.set('trust proxy', 1) // trust first proxy
//classes used
const MessageDB = require('./models/Database/MessagesDB');
const StreamDB = require('./models/Database/StreamDB');
const NotificationsDB = require('./models/Database/NotificationDB');
var stream = new StreamDB();
var notifications = new NotificationsDB();

// const { resolve } = require('path');
//instantiate DBs for use
var messages = new MessageDB();
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
//         connectSrc:["'self'", "http://127.0.0.1:3001/peerjs", "https://unpkg.com","ws://degreeme.io/socket.io/","wss://degreeme.io/socket.io/", "https://firebasestorage.googleapis.com/"],
//         frameSrc:["https://firebasestorage.googleapis.com"],
//         fontSrc:["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com"],
//         styleSrc:["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdnjs.cloudflare.com/", "https://use.fontawesome.com"],
//         scriptSrc: ["'self'", "https://unpkg.com", "https://cdnjs.cloudflare.com/", "https://js.stripe.com/", "https://www.gstatic.com", "https://firebase.googleapis.com/", "https://*.googleapis.com", "https://cdn.jsdelivr.net/"],
//         imgSrc:["'self'", "data:", "https://storage.googleapis.com/", "https://firebasestorage.googleapis.com", "https://cdnjs.cloudflare.com"],
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
//User not logged in routes
app.use([
 require('./routes/UserNotLoggedIn/rIndex'),
 require('./routes/UserNotLoggedIn/rAbout'),
 require('./routes/UserLoggedIn/rConnections'),
 require('./routes/Websockets/MessageSocket.js'),
 require('./routes/UserLoggedIn/rConnections'),
 require('./routes/UserNotLoggedIn/rJobs'),
 require('./routes/UserNotLoggedIn/rSignUp'),
 require('./routes/UserNotLoggedIn/rPrivacy'),
 require('./routes/UserNotLoggedIn/rPolicies'),
 require('./routes/UserLoggedIn/rMeeting.js'),
 require('./routes/UserNotLoggedIn/rContact.js'),
 require('./routes/UserNotLoggedIn/rCourseSearch.js'),
 require('./routes/UserNotLoggedIn/rCourseSearch.js'),
 require('./routes/UserNotLoggedIn/rSearchStudents.js'),
 require('./routes/UserNotLoggedIn/rVerify.js'),
 require('./routes/UserNotLoggedIn/rUpdatePassword.js'),
]); 
//UserLoggedIn routes
app.use([
  require('./routes/UserLoggedIn/rSettings.js'),
  require('./routes/UserLoggedIn/rMyConnections.js'),
  require('./routes/UserLoggedIn/rMessages.js'),
  require('./routes/UserLoggedIn/rMyFinances.js'),
  require('./routes/UserLoggedIn/rStudyGroups.js'),
  require('./routes/UserLoggedIn/rCreateTutorListing.js'),
  require('./routes/UserLoggedIn/rMeetups.js'),
  require('./routes/UserNotLoggedIn/rLogin.js'),
  require('./routes/UserLoggedIn/rLogout.js'),
  require('./routes/UserLoggedIn/rCheckout.js'),
  require('./routes/UserLoggedIn/rConnectByMajor.js'),
  require('./routes/UserLoggedIn/rReview.js'),
  require('./routes/UserLoggedIn/rCourseProfile.js'),
  require('./routes/UserLoggedIn/rUserProfile.js'),
  require('./routes/UserLoggedIn/rAddZoomMeeting.js'),
  require('./routes/UserLoggedIn/rHome.js'),
  require('./routes/UserLoggedIn/rTutorSchedule.js'),
  require('./routes/UserLoggedIn/rEditListing.js'),
  require('./routes/UserLoggedIn/rStudyGroupProfile.js'),
  require('./routes/UserLoggedIn/rMeetupProfile.js'),
  require('./routes/UserLoggedIn/rAddCourse.js'),
  require('./routes/UserLoggedIn/rComments.js'),
  require('./routes/UserLoggedIn/rAdmin.js'),
  require('./routes/UserLoggedIn/rAskQuestion.js'),
  require('./routes/UserLoggedIn/rVideoChat.js')
]); 
 //no longer using
// app.use(require('./routes/UserLoggedIn/rDisplayAllBids.js')); 
// app.use(require('./routes/UserLoggedIn/rDisplaySingleAcceptedBid.js')); 

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
let server = app.listen(3000);
const io = require('socket.io')(server);
// var members = [];
// let broadcaster;
//create a websocket connection
io.sockets.on('connection', function (socket) {
  console.log("Server socket connected")
  // //join video chat room
  socket.on('join-room', function (roomId, peerId, userHandle, userId) {
    //join the room
    socket.join(roomId);
    //send message to everyone in room, but don't send back to me
    socket.to(roomId).broadcast.emit("user-connected", peerId, userHandle);
      stream.addMember(roomId, userId)
      .then(function(userId){
        // console.log("added userId: " + userId._id);
      })
      socket.on("disconnect", () => {
        console.log("Disconnecting")
        // 
        console.log(peerId)
        console.log(userId)
        stream.getStreamHost(roomId).then(function(host){
          notifications.addNotification(userHandle ,userHandle,"Leave"+ host.host + "a review", "img", "/review/"+host.host)
        })
        socket.to(roomId).broadcast.emit("user-disconnected", peerId)

        stream.leaveStream(roomId, userId)
        .then(function(){
        })
      })
    });
    
  //catch the emitted 'send message' event
  socket.on('send message', function (data) {
      //add message to the db
      messages.addMessage(data.id, data.sender, data.senderImg, data.message, data.date);
      io.sockets.emit('new message', {
          msg: data
      });
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
});
});
