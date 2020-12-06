require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require("helmet");
const csp = require("helmet-csp");
const ejs = require("ejs");
const path = require('path');
const {v4: uuidV4 } = require("uuid");
// const COURSES = require("./models/Database/UNCC_CoursesDB");
// var course = new COURSES();
// course.getAllCourses().exec((err, docs)=>{
//   for(x in docs){
//     console.log(docs[x]);
//     docs[x].students = [];
//     docs[x].studentCount = 0;
//     docs[x].save();
//   }
  
// })
var app = module.exports = express(); 
app.set('trust proxy', 1) // trust first proxy
//classes used
const MessageDB = require('./models/Database/MessagesDB');
const userDB = require('./models/Database/UserDB');
const streamDB = require('./models/Database/StreamDB');
const { arrayBufferToBinaryString } = require('blob-util');
//instantiate DBs for use
var messages = new MessageDB();
var users = new userDB();
var stream = new streamDB();
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
//         connectSrc:["'self'", "ws://degreeme.io/socket.io/","wss://degreeme.io/socket.io/", "https://firebasestorage.googleapis.com/"],
//         frameSrc:["https://firebasestorage.googleapis.com"],
//         fontSrc:["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
//         styleSrc:["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdnjs.cloudflare.com/"],
//         scriptSrc: ["'self'", "https://cdnjs.cloudflare.com/", "https://js.stripe.com/", "https://www.gstatic.com", "https://firebase.googleapis.com/", "https://*.googleapis.com", "https://cdn.jsdelivr.net/"],
//         imgSrc:["'self'", "data:", "https://storage.googleapis.com/", "https://firebasestorage.googleapis.com", "https://cdnjs.cloudflare.com"],
//         objectSrc: ["'none'"],
//         upgradeInsecureRequests: [],
//       },
//       reportOnly: false,
//     })
//   );
// add additional layers of security
app.use(helmet({
    contentSecurityPolicy:false //security policy already set above
}));
app.set('view engine', 'ejs'); //set the view engine to ejs
app.use('/assets', express.static('assets')); //use assets folder for static files
//events scheduled to run on the server
app.use(require('./routes/scheduledEvents/updateListings.js')); 
app.use(require('./routes/scheduledEvents/chargePayments.js')); 
//User not logged in routes
app.use(require('./routes/UserNotLoggedIn/rIndex')); 
app.use(require('./routes/UserLoggedIn/rConnections')); 
app.use(require('./routes/Websockets/MessageSocket.js')); 
app.use(require('./routes/UserNotLoggedIn/rAbout'));
app.use(require('./routes/UserNotLoggedIn/rJobs'));
app.use(require('./routes/UserNotLoggedIn/rSignUp')); 
app.use(require('./routes/UserNotLoggedIn/rPrivacy')); 
app.use(require('./routes/UserNotLoggedIn/rPolicies')); 
app.use(require('./routes/UserLoggedIn/rMeeting.js')); 
app.use(require('./routes/UserNotLoggedIn/rContact.js')); 
app.use(require('./routes/UserNotLoggedIn/rCourseSearch.js')); 
app.use(require('./routes/UserNotLoggedIn/rSearchStudents.js')); 
//User logged in routes
app.use(require('./routes/UserLoggedIn/rSettings.js')); 
app.use(require('./routes/UserLoggedIn/rMyConnections.js')); 
app.use(require('./routes/UserLoggedIn/rMessages.js')); 
app.use(require('./routes/UserLoggedIn/rMyFinances.js')); 
app.use(require('./routes/UserLoggedIn/rStudyGroups.js')); 
app.use(require('./routes/UserLoggedIn/rCreateTutorListing.js')); 
app.use(require('./routes/UserLoggedIn/rMeetups.js')); 
app.use(require('./routes/UserNotLoggedIn/rLogin.js'));
app.use(require('./routes/UserLoggedIn/rLogout.js')); 
app.use(require('./routes/UserLoggedIn/rCheckout.js')); 
app.use(require('./routes/UserNotLoggedIn/rVerify.js')); 
app.use(require('./routes/UserNotLoggedIn/rUpdatePassword.js')); 
app.use(require('./routes/UserLoggedIn/rReview.js')); 
app.use(require('./routes/UserLoggedIn/rConnectByMajor.js')); 
app.use(require('./routes/UserLoggedIn/rCourseProfile.js')); 
app.use(require('./routes/UserLoggedIn/rUserProfile.js')); 
app.use(require('./routes/UserLoggedIn/rAddZoomMeeting.js')); 
app.use(require('./routes/UserLoggedIn/rHome.js')); 
app.use(require('./routes/UserLoggedIn/rTutorSchedule.js')); 
app.use(require('./routes/UserLoggedIn/rEditListing.js')); 
app.use(require('./routes/UserLoggedIn/rStudyGroupProfile.js')); 
app.use(require('./routes/UserLoggedIn/rMeetupProfile.js')); 
app.use(require('./routes/UserLoggedIn/rAddCourse.js')); 
app.use(require('./routes/UserLoggedIn/rDisplayAllBids.js')); 
app.use(require('./routes/UserLoggedIn/rDisplaySingleAcceptedBid.js')); 
app.use(require('./routes/UserLoggedIn/rComments.js')); 
app.use(require('./routes/UserLoggedIn/rAdmin.js')); 
app.use(require('./routes/UserLoggedIn/rAskQuestion.js')); 
app.use(require('./routes/UserLoggedIn/rVideoChat.js')); 
//API Routes
app.use(require('./routes/API/SendStudyGroupData.js')); 
app.use(require('./routes/API/sendMeetups.js'));  
app.use(require('./routes/API/sendUserHandles.js')); 
app.use(require('./routes/API/SendNotifications.js'));   
app.use(require('./routes/API/sendTutors.js'));
app.use(require('./routes/API/getMyCourses.js')); 
app.use(require('./routes/API/SendDiscussion.js'));   
app.use(require('./routes/API/SendMessageThreads.js')); 
app.use(require('./routes/API/SendMajors.js')); 
app.use(require('./routes/API/sendNotificationCount.js')); 
app.use(require('./routes/API/sendSortedStudyGroups.js')); 
app.use(require('./routes/API/sendUsersAndImages.js')); 

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
        console.log("added userId: " + userId);
      })
      socket.on("disconnect", () => {
        console.log("Disconnecting")
        stream.leaveStream(roomId, userId)
        .then(function(){
          console.log("LEFT that hoe")
          socket.to(roomId).broadcast.emit("user-disconnected", peerId)
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
var empty = [];
//return 2
//return 1
var arr1 = [2,2];
//return 5
var arr2 = [3,3,3,1,6,9,5,9];
var arr3 = [5,6,7,5,4,4,3];
//seen [3]
function getUnique(arr){

  var unique = [];
  for(var x = 0; x < arr.length; x++) {
    var match = false;
    for(var y = x+1; y < arr.length; y++){
      if(arr[x] == arr[y]){
       match = true;
      }
    }
    if(!match){
      var found = false;

      for(var y = 0 ; y <  unique.length; y++){
        if(arr[x] == unique[y]){
          found = true;
        }
        
      }
      if(!found){
        unique.push(arr[x]);
      }
    }
  }
  return unique.length;
}
console.log(getUnique(arr3))
console.log(getUnique(arr3))


