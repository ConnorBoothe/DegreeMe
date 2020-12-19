//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){

});
const session = require('express-session'); //used to manipulate the session
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser'); //used to read user input
const bcrypt = require('bcryptjs'); //used to decrypt password
const {
    check,
    validationResult
} = require('express-validator'); //validates user input
//DBs used
const userDB = require('../../models/Database/UserDB');
const MeetupsDB = require('../../models/Database/MeetupsDB.js');
const NotificationDB = require('../../models/Database/NotificationDB');
const ListingDB = require('../../models/Database/ListingsDB');
//classes used
const User = require("../../models/classes/Student");
const Connection = require('../../models/classes/Connection');
//use session and bodyParser
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
    extended: true
}));

//instantiate DB classes
var meetups = new MeetupsDB();
const users = new userDB();
const notifications = new NotificationDB();
const listings = new ListingDB();
//get the login page
router.get('/login', function (req, res) {
    res.render('UserNotLoggedIn/login', {
        qs: req.query
    });
});
//handle user login
router.post('/login', [
    check('email').isEmail().normalizeEmail().trim().escape(),
    check('password').isString().trim().escape(),
    check('password').isLength({
        min: 3
    })
], function (req, res) {
    const errors = validationResult(req); //store validation errors
    if (!errors.isEmpty()) {
        //redirect to index if error
        res.redirect('/');
    }
    //find the user associated with email input
    users.getUserByEmail(req.body.email).exec((err, docs1) => {
        if (docs1.length > 0) { //if email exists in the DB
            //create temporary user object from DB result
            var user = new User(docs1[0]._id, docs1[0].first_name, docs1[0].last_name, docs1[0].school, docs1[0].email, docs1[0].password,
                docs1[0].img, docs1[0].theme, docs1[0].handle, [], docs1[0].status, docs1[0].subscription, docs1[0].creditCount, docs1[0].threads, docs1[0].major,
                docs1[0].bio);
                bcrypt.compare(req.body.password, user.getPassword(), function (err, match) {
                if (match) {
                    //if account has been verified, start the session
                    if (user.status === "Active") {
                        // req.session.user = user;
                        req.session.userId = user.getId();
                        req.session.name = user.getName();
                        req.session.school = user.getSchool();
                        req.session.email = user.getEmail();
                        req.session.img = user.getImg();
                        req.session.theme = user.getTheme();
                        req.session.handle = user.getHandle();
                        req.session.major = docs1[0].Major;
                        req.session.bio = docs1[0].bio;
                        req.session.stripeId = docs1[0].StripeId;
                        req.session.following = docs1[0].following;
                        req.session.notificationCount = 0;
                        req.session.currentConnections = [];
                        req.session.pastConnections = [];
                        req.session.allConnections = [];
                        req.session.rating = 5;
                        req.session.mySchedule = user.getMySchedule();
                        req.session.myCourses = docs1[0].myCourses;
                        req.session.activeTutor = false;
                        if(docs1[0].streamId){
                            req.session.streamId = docs1[0].streamId;
                        }
                        if(docs1[0].StripeId === "none"){
                            req.session.tutor = false;
                        }
                        else{
                            req.session.tutor = true;
                        }
                        listings.getListingsByHandle(req.session.handle).exec((err, docs)=>{
                            if(docs.length > 0){
                                req.session.myListings = true;
                            }
                            else{
                                req.session.myListings = false;
                            }
                        })
                        //get the users connections
                        meetups.getConnectionsByHandle(req.session.handle).exec((err, docs) => {
                            for (x in docs) {
                                req.session.allConnections.push(new Connection(docs[x]._id, docs[x].sessionID, docs[x].tutorHandle,
                                    docs[x].userHandle, docs[x].class, docs[x].date, docs[x].time, docs[x].building, docs[x].room,
                                    docs[x].hourlyRate, docs[x].hours, docs[x].StudentsAttending, docs[x].Type,docs[x].Status, docs[x].LeftReview));
                                if (new Date(docs[x].date) < new Date()) {
                                    req.session.pastConnections.push(new Connection(docs[x]._id, docs[x].tutor, docs[x].img, docs[x].name,
                                        docs[x].class, docs[x].date, docs[x].time, docs[x].location));
                                } else {
                                    req.session.currentConnections.push(new Connection(docs[x]._id, docs[x].tutor, docs[x].img, docs[x].name,
                                        docs[x].class, docs[x].date, docs[x].time, docs[x].location));
                                }
                            }
                            res.redirect('/home');
                        })
                    } else {
                        console.log("Account Not Verified")
                        res.redirect('/login?message=Account%20Not%20Verified&email=' + req.body.email);
                    }
                } else {
                    console.log("PW Incorrect")
                    res.redirect('/login?message=Email%20or%20Password%20Incorrect');
                }
            });
        } else {
            res.redirect('/login?message=Email%20or%20Password%20Incorrect');
        }
    })
});
module.exports = router;