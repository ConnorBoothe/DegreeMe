//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);
const nodemailer = require("nodemailer");
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const ListingsDB = require("../../models/Database/ListingsDB");
const userDB = require('../../models/Database/UserDB');
const TimelineDB = require('../../models/Database/TimeLineDB');
const NotificationDB = require('../../models/Database/NotificationDB');
const CourseDB = require("../../models/Database/UNCC_CoursesDB");
const Groups = require("../../models/Database/StudyGroupsDB");
const AcceptedBids = require("../../models/RecycledClasses/AcceptedBidsDB");
const MeetupsDB = require("../../models/Database/MeetupsDB");
const StreamDB = require("../../models/Database/StreamDB");
//classes used
var TimeLine = require('../../models/classes/TimeLine');
var TimelinePost = require('../../models/classes/TimelinePost');
var DateFunctions = require('../../models/classes/DateFunctions');
var CommentsDB = require('../../models/Database/CommentsDB');

var unirest = require('unirest');
//instantiate classes
var tl = new TimeLine();
var dateFunctions = new DateFunctions();
//instantiate DBs
var courses = new CourseDB();
var listings = new ListingsDB();
var users = new userDB();
var timeline = new TimelineDB();
var notifications = new NotificationDB();
var groups = new Groups();
var acceptedBids = new AcceptedBids();
var meetups = new MeetupsDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
//register the session and use bodyParser

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
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
    resave: false,
    saveUninitialized: true
}));
//takes in an array of meetups as param and sorts by date
function sortMeetups(meetupArray) {
    meetupArray.sort(function (a, b) {
        if (a.meetupDate > b.meetupDate) return 1;
        if (a.meetupDate < b.meetupDate) return -1;
        return 0;
    });
    return meetupArray;
}
//sort tutoring sessions by date
function sortTutoringSessions(tutorSeshArray) {
    tutorSeshArray.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
    });
    return tutorSeshArray;
}
//render the home page
router.get('/home', function (req, res) {
    // stream.clearAllMembers("5fad920a6d292df74fb7493b");
    if (req.session.userId) {
        //get user timeline
       timeline.getUserTimeline(req.session.following, 0, req)
       .then(function(docs1){
                var timeLineArray = [];
                new Promise((resolve, reject) => {
                for (var x = 0; x < docs1.length; x++) {
                    // .then(function(data){
                        console.log(docs1[x].likers)
                        var hasLiked = tl.likedBoolean(req.session.handle, docs1[x].likers);
                        console.log(hasLiked)
                    //potentially removing this
                    if (docs1[x].type == "Tutor Listing") {
                        timeLineArray.push(new TimelinePost(docs1[x]._id, docs1[x].sendToHandle, docs1[x].type, docs1[x].userHandle, docs1[x].userName,
                            docs1[x].userImage, docs1[x].caption, docs1[x].likes, docs1[x].comments, dateFunctions.displayDate(new Date(docs1[x].date)),
                            docs1[x].name, docs1[x].course, docs1[x].price, docs1[x].url, hasLiked, docs1[x].commentCount));
                    }
                    if (docs1[x].type == "Study Group") {
                        timeLineArray.push(new TimelinePost(docs1[x]._id, docs1[x].sendToHandle, "Study Group", docs1[x].userHandle, docs1[x].userName,
                            docs1[x].userImage, docs1[x].caption, docs1[x].likes, docs1[x].comments, dateFunctions.displayDate(new Date(docs1[x].date)),
                            docs1[x].name, docs1[x].course, docs1[x].professor, docs1[x].url, hasLiked,  docs1[x].commentCount));
                    }
                    //removing this
                    if (docs1[x].type == "Status Update") {

                        timeLineArray.push(new TimelinePost(docs1[x]._id, docs1[x].sendToHandle, "Status Update", docs1[x].userHandle, docs1[x].userName,
                            docs1[x].userImage, docs1[x].caption, docs1[x].likes, "", dateFunctions.displayDate(new Date(docs1[x].date)),
                            "", "", "", "",  hasLiked, docs1[x].commentCount));
                    }
                    if (docs1[x].type == "Question") {

                        timeLineArray.push(new TimelinePost(docs1[x]._id, docs1[x].sendToHandle, "Question", docs1[x].userHandle, docs1[x].userName,
                            docs1[x].userImage, docs1[x].caption, docs1[x].likes, "", dateFunctions.displayDate(new Date(docs1[x].date)),
                            "", docs1[x].course, "", "",  hasLiked, docs1[x].commentCount, docs1[x].discussionId, docs1[x].files));
                    }
                }
                if(x === docs1.length){
                    resolve(true);
                }
                
            })
            .then(function(){
                users.getUserByEmail(req.session.email).exec((err, docs3) => {
                    //sort current sessions and past sessions
                    var currSessions = [];
                    var pastSessions = [];
                    for (x in docs3[0].TutoringSessions) {
                        if (new Date() > docs3[0].TutoringSessions[x].date) {
                            pastSessions.push(docs3[0].TutoringSessions[x]);
                        } else {
                            currSessions.push(docs3[0].TutoringSessions[x]);
                        }
                    }
                    if (docs1.length > 0) {
                        acceptedBids.getUserBids(req.session.handle).exec((err, bids)=>{
                        res.render('UserLoggedIn/Home', {
                            session: req.session,
                            qs: req.query,
                            timeline: timeLineArray,
                            currentTutoringSessions: sortTutoringSessions(currSessions),
                            pastTutoringSessions: sortTutoringSessions(pastSessions),
                            myCourses: docs3[0].myCourses,
                            myStudyGroups: docs3[0].StudyGroups,
                            meetups: sortMeetups(docs3[0].meetups),
                            formatDate: dateFunctions.displayDate,
                            bidsLength: bids.length
                    
                        });
                    })
                    }
                    //new view goes here
                    else {
                        acceptedBids.getUserBids(req.session.handle).exec((err, bids)=>{
                        res.render('UserLoggedIn/emptyHome', {
                            session: req.session,
                            qs: req.query,
                            timeline: timeLineArray,
                            currentTutoringSessions: sortTutoringSessions(currSessions),
                            pastTutoringSessions: sortTutoringSessions(pastSessions),
                            myCourses: docs3[0].myCourses,
                            myStudyGroups: docs3[0].StudyGroups,
                            meetups: sortMeetups(docs3[0].meetups),
                            formatDate: dateFunctions.displayDate,
                            bidsLength: bids.length
                        });
                    });
                    }

                })

            })
        })
    } else {
        res.redirect('/login?message=Session%20Ended')
    }
});
//post route that handles AJAX POST call to clear notifications
router.post("/zeroNotifications",
    check('handle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.clearNotificationCount(req.session.handle)
            .then(function (data) {
                res.status(202).json({
                    status:"success",
                }).end();
            })
            .catch(function (err) {
                console.log(err);
            })
    })
//post route that handles AJAX POST call to to change notification to seen
router.post("/Seen",
    check('notifId').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        notifications.seenNotification(req.body.notifId)
            .exec((err, docs) => {
                res.status(202).json({
                    notifId: req.body.notifId,
                    url: req.body.url
                }).end();

            })
    })
router.post("/SeenMsg",
    check('handle').isString().trim().escape(),
    check('threadId').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        users.sawMessage(req.session.handle, req.body.threadId, res);
    })
router.post("/addCourse",
    check('handle').isString().trim().escape(),
    check('course').isString().trim().escape(),
    check('courseId').isString().trim().escape(),
    check('courseCode').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        if (!req.body.exist) {
            users.addCourse(req.session.handle, req.body.course, req.body.courseId, req.body.courseCode);
            // courses.incrementStudents(req.body.course).exec();
            courses.addStudent(req.body.course, req.session.img, req.session.handle, req.session.name, req.session.bio)
            res.status(202).json({
                course: req.body.course,
                code: req.body.courseCode
            }).end();
        } else {

        }
    })
router.post("/leaveCourse",
    check('course').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        //remove course from UserDB
        if (req.body.course.includes("+")) {
            var course = req.body.course.replace(/\+/g, " ");
            users.removeCourse(req.session.handle, course);
            courses.decrementStudents(course).exec();
            //remove student from course
            courses.removeStudent(req.session.handle, course);
            //need .then() here
            res.status(202).json({
                status: "left",
                course: course
            }).end();
        } else {
            users.removeCourse(req.session.handle, req.body.course);
            //decrement course studentCount
            // courses.decrementStudents(req.body.course).exec();
            //remove student from course
            courses.removeStudent(req.session.handle, req.body.course);
            //need .then() here
            res.status(202).json({
                status: "left",
                course: req.body.course
            }).end();
        }

    })
router.post("/addLike",
    check('handle').isString().trim().escape(),
    check('postId').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        timeline.hasLiked(req.body.postId, req.session.handle)
            .then(function (data1) {
                console.log(data1)
                //determine if the user has liked the post
                var hasLiked = false;
                for (x in data1.likers) {
                    if (data1.likers.likerHandle === req.session.handle) {
                        console.log("Found liker")
                        hasLiked = true;
                    }
                }
                //if user has not liked the post
                if (!hasLiked) {
                    //increment like count
                    timeline.incrementLikes(req.body.postId)
                    .then(function (data) {
                    //add handle to liker array
                    new Promise((resolve, reject) => {
                            timeline.addLiker(req.body.postId, req.session.handle);
                            resolve();
                        })
                        .then(function () {
                            notifications.addNotification(req.body.postHandle ,req.session.name,"liked your post", req.session.img, "/")
                            .then(function(){
                                users.incrementNotificationCount(req.body.postHandle);
                                timeline.getTimelineById(req.body.postId)
                                .then(function (data) {
                                    res.status(202).json({
                                        status: "liked",
                                        likeCount: data[0].likes
                                    }).end();
                                })
                            })
                            
                        })
                    });

                }
            });
    });
    
router.post("/removeLike",
    check('postId').isString().trim().escape(),
    check('handle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        timeline.decrementLikes(req.body.postId)
            .then(function () {
                timeline.removeLiker(req.body.postId, req.session.handle)
                timeline.getTimelineById(req.body.postId)
                    .then(function (data) {
                        res.status(202).json({
                            status: "unliked",
                            likeCount: data[0].likes
                        }).end();
                    })
            })
            .catch(function (error) {
                console.log(error)
            })
    });
//update profile pic in settings route
router.post("User/Settings",
    check('img1').isString().trim().escape(),
    check('handle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        upload(req, res, (err) => {
            if (err) {
                res.redirect('/Settings?error=' + err);
            }
            let base64String = req.body.img1; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();
            fs.writeFile("assets/img/userImg/" + req.body.handle.substring(1) + ".jpg", base64Image, {
                encoding: 'base64'
            }, function (err, data) {
                if (!err) {
                    req.session.img = data;
                } else {
                    console.log(err)
                }
            });
        });
    });
//load more timeline items
router.post("/loadMore",
    check('blockNum').trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        timeline.getUserTimeline(req.session.following, req.body.blockNum, req).exec((err, docs) => {
            if (err) {
                console.log(err)
                res.json(err)
            } else {
                res.status(202).json({
                    newItems: docs,
                    stripeId: req.session.stripeId
                }).end();
            }
        });
    });
    //post route that handles site-wide search backend functionality
router.post("/siteWideSearch",
    check('type').isString().trim().escape(),
    check('searchValue').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/home');
        }
        if (req.body.type == "Courses") {
            if (req.body.searchValue.split("")[4] == " " && parseInt(req.body.searchValue.split("")[5]) == "NAN") {
                courses.getCourseCodeAutocomplete(req.body.searchValue).exec((err, docs1) => {
                    res.status(202).json({
                        Courses: docs1,
                        type: req.body.type
                    }).end();
                })
            } else {
                courses.getCourseAutocomplete(req.body.searchValue).exec((err, docs) => {
                    if (err) {
                        console.log(err)
                    } else {
                        if(docs.length < 1){
                            courses.getCourseCodeAutocomplete(req.body.searchValue).exec((err, docs1) => {
                                res.status(202).json({
                                    Courses: docs1,
                                    type: req.body.type
                                }).end();
                            })
                        }
                        else{
                            res.status(202).json({
                                Courses: docs,
                                type: req.body.type
                            }).end();
                        }
                       
                    }
                })
            }
        } else if (req.body.type == "Users") {
            users.usersByNameAutocomplete(req.body.searchValue).exec((err, docs1) => {
                if(docs1){
                    if(docs1.length < 1){
                        console.log("Search by handle")
                        users.usersByHandleAutocomplete(req.body.searchValue).exec((err, docs) => {
                            res.status(202).json({
                                Users: docs,
                                type: req.body.type
                            }).end();
                        })
                    }
                    else{
                        res.status(202).json({
                            Users: docs1,
                            type: req.body.type
                        }).end();
                    }
                }
                else{
                    users.usersByHandleAutocomplete(req.body.searchValue).exec((err, docs) => {
                        if(docs)
                        res.status(202).json({
                            Users: docs,
                            type: req.body.type
                        }).end();
                    })
                }
                
                
        });
        } else if (req.body.type == "Tutors") {
            if (req.body.searchValue.split("")[4] == " ") {
                listings.listingsAutocompleteByCourseCode(req.body.searchValue).exec((err, docs) => {
                    res.status(202).json({
                        Listings: docs,
                        type: req.body.type
                    }).end();
                })
            } else {
                listings.listingsAutocompleteBySubject(req.body.searchValue).exec((err, docs) => {
                    res.status(202).json({
                        Listings: docs,
                        type: req.body.type
                    }).end();
                })
            }

        } else if (req.body.type == "Groups") {
            groups.groupsAutocomplete(req.body.searchValue).exec((err, docs) => {
                if(docs.length < 1){
                    groups.groupsAutocompleteByName(req.body.searchValue).exec((err, docs1)=>{
                        res.status(202).json({
                            Groups: docs1,
                            type: req.body.type
                        }).end();
                    })
                }
                else{
                    res.status(202).json({
                        Groups: docs,
                        type: req.body.type
                    }).end();
                }
            })
        }
    });
    //removing this b/c adding our own video solution
    router.post("/sendZoomReminder", function(req, res){
        users.getUserByHandle(req.body.handle)
        .then(function(data){
            meetups.getMeetupById(req.body.meetingId)
            .then(function(meetup){
                mail.headers({
                    "content-type": "application/json",
                    "authorization": process.env.SENDGRID_API_KEY,
                    });
        
                    mail.type("json");
                    mail.send({
                    "personalizations": [
                        {
                            "to": [
                                {
                                    "email": data[0].email,
                                    "name": data[0].first_name + " " + data[0].last_name
                                }
                        ],
                            "dynamic_template_data": {
                                "subject": "You need to schedule the Zoom session.",
                                "classSubject": meetup.class,
                                "location": meetup._id,
                        },
                            "subject": " "
                        }
                    ],
                        "from": {
                            "email": "notifications@degreeme.io",
                            "name": "DegreeMe"
                    },
                        "reply_to": {
                            "email": "noreply@degreeme.io",
                            "name": "No Reply"
                    },
                        "template_id": "d-bf2a062538504bd284437ee704207c0f"
                    });
                    mail.end(function (resp) {
                    if (resp.error){
                        console.log("this is the error for sending zoom reminder", resp.error)
                        // res.redirect("/home")
                        // throw new Error(res.error);
                    } else if (resp.accepted){
                        console.log("email SENT")
                        res.status(202).json({
                        }).end();
                    }
        
                console.log(resp.body);
                });
            })
            })
    });

    router.post("/getHandle", function(req, res){
        users.getUserByHandle("@"+req.body.handle).exec((err, docs)=>{
            if(docs.length > 0){
                res.status(202).json({
                    exists: true,
                }).end();
            }
            else{
                res.status(202).json({
                    exists: false,
                }).end();
            }

        })
    });
    //add status uppdate post
    //likely removing this
    router.post("/addStatus", function(req, res){
        //sendToHandle,userHandle, userName, type ,userImage,caption,date
       timeline.addStatusPost(req.session.handle, req.session.handle, req.session.name, req.body.type, req.session.img, req.body.status, new Date())
       .then(function(data){
            res.status(202).json({
                status: true,
                post:data
            }).end();
       });
    });

    router.post("/mobileCourses", function(req, res){
        users.getMyCourses(req.body.userId)
        .then(function(courses){
            res.status(202).json({
                courses: courses,
            }).end();
        })
        
    })
      router.post("/mobileGroups", function(req, res){
        users.getMyGroups(req.body.userId)
        .then(function(groups){
            res.status(202).json({
                groups: groups,
            }).end();
        })
        
    })
    router.post("/setActive", function(req, res){
        users.setActiveTutor(req.session.userId, req.body.value)
        .then(function(data){
            req.session.activeTutor = data.ActiveTutor;
            res.status(202).json({
                data: data,
            }).end();
        })
        
    })
module.exports = router;