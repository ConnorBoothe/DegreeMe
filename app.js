const express = require('express');
const helmet = require("helmet");
const csp = require("helmet-csp");
const ejs = require("ejs");
var app = express();
//used to zero out courses in DB
// const CourseDB = require('./models/Database/UNCC_CoursesDB');
// var courses = new CourseDB();
// courses.getAllCourses().exec((err,docs)=>{
//   for(x in docs){
//     docs[x].students = [];
//         docs[x].studentCount  = 0;
//     docs[x].save();
//   }
// })
//set limit size of file upload
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
    limit: '50mb',
    extended:true
}));
//set the Content Security Policy of thhe app
app.use(
    csp({
      directives: {
        defaultSrc: ["'self'", "https://js.stripe.com/" ],
        connectSrc:["'self'", "ws://127.0.0.1:4000/socket.io/","127.0.0.1:4000"],
        fontSrc:["'self'", "https://fonts.gstatic.com"],
        styleSrc:["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        scriptSrc: ["'self'", , "https://js.stripe.com/"],
        imgSrc:["'self'", "data:"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    })
  );
//add additional layers of security
app.use(helmet({
    contentSecurityPolicy:false //security policy already set above
}));
app.set('view engine', 'ejs'); //set the view engine to ejs
app.use('/assets', express.static('assets')); //use assets folder for static files
//events scheduled to run on the server
app.use(require('./routes/scheduledEvents/updateListings.js')); 
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
app.use(require('./routes/UserLoggedIn/rEditListing.js')); 
app.use(require('./routes/UserLoggedIn/rStudyGroupProfile.js')); 
app.use(require('./routes/UserLoggedIn/rMeetupProfile.js')); 
app.use(require('./routes/UserLoggedIn/rAddCourse.js')); 
app.use(require('./routes/UserLoggedIn/rDisplayAllBids.js')); 
app.use(require('./routes/UserLoggedIn/rDisplaySingleAcceptedBid.js')); 

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
        res.redirect('/Home');
    }
    //redirect to index
    else{
        res.redirect('/');
    }
});
app.listen(8080);


