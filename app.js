require('dotenv').config();
const express = require('express');
const helmet = require("helmet");
const csp = require("helmet-csp");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){

});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);

var app = module.exports = express(); 
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
app.set('trust proxy', 1) // trust first proxy
//classes used
const MessageDB = require('./models/Database/MessagesDB');
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
app.use(
    csp({
      directives: {
        defaultSrc: ["'self'", "https://js.stripe.com/",  "ws://degreeme.io/socket.io/" ],
        connectSrc:["'self'", "ws://degreeme.io/socket.io/","wss://degreeme.io/socket.io/", "https://firebasestorage.googleapis.com/"],
        frameSrc:["https://firebasestorage.googleapis.com"],
        fontSrc:["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://use.fontawesome.com"],
        styleSrc:["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdnjs.cloudflare.com/", "https://use.fontawesome.com"],
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com/", "https://js.stripe.com/", "https://www.gstatic.com", "https://firebase.googleapis.com/", "https://*.googleapis.com", "https://cdn.jsdelivr.net/"],
        imgSrc:["'self'", "data:", "https://storage.googleapis.com/", "https://firebasestorage.googleapis.com", "https://cdnjs.cloudflare.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    })
  );
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
app.use([
 require('./routes/UserNotLoggedIn/rIndex'),
 require('./routes/UserNotLoggedIn/rAbout'),
 require('./routes/Websockets/MessageSocket.js'),
 require('./routes/UserNotLoggedIn/rJobs'),
 require('./routes/UserNotLoggedIn/rSignUp'),
 require('./routes/UserNotLoggedIn/rPrivacy'),
 require('./routes/UserNotLoggedIn/rPolicies'),
 require('./routes/UserLoggedIn/rMeeting.js'),
 require('./routes/UserNotLoggedIn/rContact.js'),
 require('./routes/UserNotLoggedIn/rCourseSearch.js'),
 require('./routes/UserNotLoggedIn/rSearchStudents.js'),
 require('./routes/UserNotLoggedIn/rVerify.js'),
 require('./routes/UserNotLoggedIn/rUpdatePassword.js'),
]); 
//UserLoggedIn routes
app.use([
  require('./routes/UserLoggedIn/rSettings.js'),
  require('./routes/UserLoggedIn/rMyConnections.js'),
  require('./routes/UserLoggedIn/Messages/rMessages.js'),
  require('./routes/UserLoggedIn/Messages/rMessageMembers.js'),
  require('./routes/UserLoggedIn/Messages/rGetThreadImages.js'),
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
let server = app.listen(8080, function(){
  console.log("Connected!")
});

const io = require('socket.io')(server);
const rooms = {};
let broadcaster;
//create a websocket connection
io.sockets.on('connection', function (socket) {
  //catch the emitted 'send message' event
  socket.on('send message', function (data) {
    console.log("Adding message")
      //add message to the db
      messages.addMessage(data.id, data.sender, data.senderImg, data.content, data.date, "text")
      .then(function(message){
        io.sockets.emit('new message', {
          msg: message
      });
      })
      
  });
  socket.on('send image', function (data) {
  //   add message to the db
  //  add image to message DB
  //  (data.id, data.sender, data.senderImg, data.message, data.date, "text")
   messages.addMessage(data.id, data.sender, data.senderImg, data.content, data.date, "file")
   .then(function(success){
     if(success){
      socket.emit("append image", {image:data.content});
     }
   })
   .catch(function(error){
     console.log(error)
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
});


