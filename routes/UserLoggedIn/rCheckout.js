//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();

const session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var unirest = require('unirest');
const {
    check,
    validationResult
} = require('express-validator');
const stripe = require('stripe')('sk_test_KLmOibLZEyhi7d6RA7CA42Bf00ZifUQEt7');
//DBs used
const ListingsDB = require('../../models/Database/ListingsDB');
const Listing = require('../../models/classes/Tutor');
const MeetupsDB = require('../../models/Database/MeetupsDB.js');
const NotificationDB = require('../../models/Database/NotificationDB');
const UserDB = require('../../models/Database/UserDB');
const BidsDB = require('../../models/Database/BidsDB');
const MessagesDB = require("../../models/Database/MessagesDB");
const TimelineDB = require("../../models/Database/TimeLineDB");
const AcceptedBidsDB = require("../../models/Database/AcceptedBidsDB");
//classes used
var Connection = require('../../models/classes/Connection');
var DateFunctions = require('../../models/classes/DateFunctions');
//instantiate classes
var dateFunctions = new DateFunctions();
//instantiate DBs for use
var notifications = new NotificationDB();
var meetups = new MeetupsDB();
var listings = new ListingsDB();
var users = new UserDB();
var bids = new BidsDB();
var messages = new MessagesDB();
var timeline = new TimelineDB();
var acceptedBids = new AcceptedBidsDB();

//use session and bodyParser 
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection
       }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
  }));

//render the checkout page
router.get('/Checkout', function (req, res) {
    if (req.session.userId) {
        var qs = req.query;
        listings.getListingById(qs.id).exec((err, docs) => {
            if (docs[0]._id) {
                //(id,UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, StudentsAttending, img, Virtual)
                var listing = new Listing(docs[0]._id, docs[0].UserID, docs[0].Handle, docs[0].Name, docs[0].CourseCode, docs[0].Grade, docs[0].HourlyRate, docs[0].NumHours, docs[0].School, docs[0].Type,
                    docs[0].Schedule, docs[0].MaxStudents, docs[0].StudentsAttending, docs[0].Image, docs[0].Virtual);
                    console.log("rCheckout", listing)
                users.getUserByHandle(docs[0].Handle).exec((err, tutor) => {
                    var StripeId = tutor[0].StripeId;
                    listings.getAllListings().exec((err, docs) => {
                        var tutorCount = 0;
                        for (x in docs) {
                            tutorCount++;
                        }
                        res.render('UserLoggedIn/Checkout', {
                            session: req.session,
                            tutor: listing,
                            tutorCount: tutorCount,
                            StripeId: StripeId,
                            formatDate: dateFunctions.displayDate,
                            formatTime: dateFunctions.formatTimeFromDate
                        });
                    });
                });
            } else {
                //display "No tutor found message"
            }
        })
    } else {
        res.redirect('/login?error=Session%20Ended');
    }
});
//render the checkout page
router.get('/bids/:timelineId', function (req, res) {
    if (req.session.userId) {
        bids.getBidsByTimelineId(req.params.timelineId)
            .then(function (bids) {
                timeline.getTimelineById(req.params.timelineId)
                    .then(function (timeline) {
                        console.log(bids)
                        res.render('UserLoggedIn/bids', {
                            session: req.session,
                            bids: bids,
                            dueDate: timeline[0].date,
                            bidOpen: timeline[0].BidOpen,
                            params: req.params
                        });
                    })
                    .catch(function (err) {
                        res.redirect("/home")
                    })
            })
    } else {
        res.redirect('/login?error=Session%20Ended');
    }
});
//render the checkout page
router.post('/bids/chargeHelp',
    check('handle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/home');
        }
        //charge the person who started the help request
        //send funds to the bidder
        users.getUserByHandle(req.body.handle).exec((err, docs) => {
            var userData = docs;
            const paymentIntent = stripe.paymentIntents.create({
                        payment_method_types: ['card'],
                        amount: parseInt(req.body.price * 100),
                        currency: 'usd',
                        //taking 5%
                        application_fee_amount: parseInt(req.body.price * 5),
                        capture_method: 'manual',
                        metadata: {
                            integration_check: 'accept_a_payment',
                            for: "Help Request",
                            winningBidder: req.body.handle,
                        },
                    },
                    //get the proper stripe id
                    {
                        stripeAccount: docs[0].StripeId
                    })
                .then(function (paymentIntent) {
                    console.log("INTENT", paymentIntent)
                    //generate message thread here
                    //// newThread(host, hostImg, userHandles, datetime, subject)
                    // bidder, bidderImg, userHandle, price, timelineId, BidId, StripeId, intent
                   
                    messages.newThread(req.session.name, req.session.img, [
                            [req.session.handle, req.session.img],
                            [userData[0].handle, userData[0].img]
                        ], new Date(), "Help Request")
                        .then(function (thread) {
                            //(id,sender, senderImg, msg,  dateTime
                            acceptedBids.addAcceptedBid(userData[0].handle, userData[0].img, req.session.handle, req.body.price, req.body.dueDate, req.body.description,
                                thread._id,req.body.timelineId, req.body.bidId, docs[0].StripeId, paymentIntent.id )
                            messages.addMessage(thread._id, req.session.handle, req.session.img, "Congrats on winning the bid! This task must be completed by " +
                                req.body.timelineDate, new Date());
                            users.addThread(req.session.handle, req.session.img, "Help Request", thread._id, userData[0].handle);
                            users.addThread(req.session.handle, req.session.img, "Help Request", thread._id, req.session.img);
                            //(userHandle ,name,type, img, url)
                            notifications.addNotification(userData[0].handle, req.session.name, "Congrats! Your bid was selected", userData[0].img, "/messages?messageId=" + thread._id);
                            users.incrementNotificationCount(userData[0].handle);
                            //close the bid
                            timeline.closeBid(req.body.timelineId).exec();
                            var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

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
                                                        "email": req.session.email,
                                                        "name": req.session.name
                                                    }
                                            ],
                                                "dynamic_template_data": {
                                                    "subject": "Congrats, you won the bid!",
                                                    "name": userData[0].handle,
                                                    "bids": req.body.bidId,
                                                    "dueDate": req.body.timelineDate, 
                                                    
                                                 
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
                                            "template_id": "d-37b6e94e459c458fafb3dd1a7018f896"
                                        });
                                        mail.end();
                            res.status(202).json({
                                StripeId: docs[0].StripeId,
                                secret: paymentIntent.client_secret,
                                student: req.session.name,
                                winningBidder: req.body.name,
                                threadId: thread._id
                            }).end();
                        })


                })
        })

    });

//This route handles user payment, and adds a connection to the user's account
router.post("/charge",
    check('tutorSessionId').isString().trim().escape(),
    check('timeSlot').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/home');
        }
        if (req.session.userId) {

            listings.getStudentsAttending(req.body.tutorSessionId).exec((err, docs) => {
                //If the maximum student requirement has not been met, allow session to be added
                    users.getUserByHandle(docs.Handle).exec((err, tutor) => { //need to get tutor email
                        var intentId = "";
                        const paymentIntent = stripe.paymentIntents.create({
                            payment_method_types: ['card'],
                            amount: parseInt(docs.HourlyRate * docs.NumHours * 100),
                            currency: 'usd',
                            application_fee_amount: parseInt(docs.HourlyRate * docs.NumHours * 5),
                            capture_method: 'manual',
                            metadata: {
                                integration_check: 'accept_a_payment',
                                subject: docs.Subject,
                                timeSlot: req.body.timeSlot,
                                sessionId: req.body.tutorSessionId,
                                student: req.session.handle,
                            },
                        }, {
                            stripeAccount: tutor[0].StripeId,
                        }).then(function (paymentIntent) {
                            console.log("Payment intent", paymentIntent.id)
                            intentId = paymentIntent.id;
                            //(id, tutorHandle, date, subject
                            new Promise((resolve, reject) => {
                            meetups.meetupExists(docs.id, docs.Handle,req.body.timeSlot, docs.Subject ).exec((err, docs)=>{
                                //if group session and meetups exists, push to Members array
                               if(docs){
                                resolve(docs)
                               }
                               else{
                                resolve(false)
                               }
                            })
                        }).then(function(data){
                           if(!data){
                            var connection = new Connection("0", docs.id, docs.Handle, req.session.handle, docs.Subject, docs.CourseCode, req.body.timeSlot, req.body.timeSlot, docs.Building, docs.Room,
                            docs.HourlyRate, docs.NumHours, docs.StudentsAttending + 1, docs.Type, false, req.body.sessionNotes);
                        //if group session and no meetup exists, create a new meetup

                        meetups.addConnection(connection, [
                            {
                                role: "Host",
                                name: docs.Name,
                                handle: docs.Handle,
                                image: docs.Image,
                                intent: "none"
                            },
                            {
                                role: "Student",
                                name: req.session.name,
                                handle: req.session.handle,
                                image: req.session.img,
                                intent: intentId+" ASS"
                            } ], docs.Virtual)
                            .then(function (data) {
                                var meetingId = data._id;
                                for (x in data.Members) {
                                    //add tutoring session to user profile of all members
                                    users.addTutoringSession(data.Members[x].handle, data._id, data.courseCode, data.date, data.Members[1].image, data.userHandle, data.Members[x].role);
                                }
                                // listings.addStudentAttending(req.body.tutorSessionId).exec();
                                //Add a new notification
                                notifications.addNotification(docs.Handle, req.body.Name, ("Congrats! You made a sale to " + req.body.Name + " for <span class='text-success'>$" + parseInt(docs.HourlyRate * docs.NumHours) + "</span"),
                                    req.body.Image, ("/meeting/" + meetingId))
                                users.incrementNotificationCount(docs.Handle).then(function (data) {
                                    console.log(data)
                                });
                                //if individual, remove time slot. else increment student attending
                                 listings.incrementStudentsAttending(req.body.tutorSessionId, req.body.timeId);
                                    users.getUserByHandle(docs.Handle).exec((err, user)=>{
                                    //     var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
                                    //     mail.headers({
                                    //         "content-type": "application/json",
                                    //         "authorization": process.env.SENDGRID_API_KEY,
                                    //     });
                                    //     mail.type("json");
                                    //     mail.send({
                                    //     "personalizations": [
                                    //         {
                                    //             "to": [
                                    //                 {
                                    //                     "email": user[0].email,
                                    //                     "name": user[0].first_name + " " + user[0].last_name
                                    //                 }
                                    //         ],
                                    //             "dynamic_template_data": {
                                    //                 "subject": "Congrats, you made a sale to " + req.body.Name + ".",
                                    //                 "name": req.body.Name,
                                    //                 "price": "$" + parseInt(docs.HourlyRate * docs.NumHours),
                                    //                 "meeting": meetingId,
                                    //         },
                                    //             "subject": " "
                                    //         }
                                    //     ],
                                    //         "from": {
                                    //             "email": "notifications@degreeme.io",
                                    //             "name": "DegreeMe"
                                    //     },
                                    //         "reply_to": {
                                    //             "email": "noreply@degreeme.io",
                                    //             "name": "No Reply"
                                    //     },
                                    //         "template_id": "d-54ee1291c75f468cbe05c2d88ceaf4c2"
                                    //     });
                                    //     mail.end(function (res) {
                                    //     if (res.error) throw new Error(res.error);

                                    // });
                                    })
                                res.status(202).json({
                                    StripeId: tutor[0].StripeId,
                                    secret: paymentIntent.client_secret,
                                    student: req.session.name,
                                    meetingId: meetingId,
                                }).end();
                            }).catch(error => {
                                console.log(error.message)
                                res.status(500).json({
                                    err: error.message
                                })
                            });
                           }
                           else{
                           
                        //if group session and no meetup exists, create a new meetup
                        console.log("THIS SHOULD NOT RUN OF IND")
                        meetups.addMember(data._id, req.session.name, req.session.handle, req.session.img, paymentIntent.id)
                                var meetingId = data._id;
                                console.log(data)
                                for (x in data.Members) {
                                    //add tutoring session to user profile of all members
                                    users.addTutoringSession(data.Members[x].handle, data._id, data.courseCode, data.date, data.Members[1].image, data.userHandle, data.Members[x].role);
                                }
                               
                                // listings.addStudentAttending(req.body.tutorSessionId).exec();
                                //Add a new notification
                                notifications.addNotification(docs.Handle, req.body.Name, ("Congrats! You made a sale to " + req.body.Name + " for <span class='text-success'>$" + parseInt(docs.HourlyRate * docs.NumHours) + "</span"),
                                    req.body.Image, ("/meeting/" + meetingId))
                                users.incrementNotificationCount(docs.Handle).then(function (data) {
                                    console.log(data)
                                });
                                listings.incrementStudentsAttending(req.body.tutorSessionId, req.body.timeId);
                                users.getUserByHandle(docs.Handle).exec((err, user)=>{
                                    console.log("Get user by handle", user)
                                    // var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

                                    //     mail.headers({
                                    //         "content-type": "application/json",
                                    //         "authorization": process.env.SENDGRID_API_KEY,
                                    //     });
                                    //     mail.type("json");
                                    //     mail.send({
                                    //     "personalizations": [
                                    //         {
                                    //             "to": [
                                    //                 {
                                    //                     "email": user[0].email,
                                    //                     "name": user[0].first_name + " " + user[0].last_name
                                    //                 }
                                    //         ],
                                    //             "dynamic_template_data": {
                                    //                 "subject": "Congrats, you made a sale to " + req.body.Name + ".",
                                    //                 "name": req.body.Name,
                                    //                 "price": "$" + parseInt(docs.HourlyRate * docs.NumHours),
                                    //                 "meeting": meetingId,
                                    //         },
                                    //             "subject": " "
                                    //         }
                                    //     ],
                                    //         "from": {
                                    //             "email": "notifications@degreeme.io",
                                    //             "name": "DegreeMe"
                                    //     },
                                    //         "reply_to": {
                                    //             "email": "noreply@degreeme.io",
                                    //             "name": "No Reply"
                                    //     },
                                    //         "template_id": "d-54ee1291c75f468cbe05c2d88ceaf4c2"
                                    //     });
                                    //     mail.end(function (res) {
                                    //     // if (res.error) throw new Error(res.error);

                                    // console.log(res.body);
                                    // });
                                });
                                res.status(202).json({
                                    StripeId: tutor[0].StripeId,
                                    secret: paymentIntent.client_secret,
                                    student: req.session.name,
                                    meetingId: meetingId,
                                }).end();
                           }
                        })
                            
                        })
                    })
            })
        } else {
            res.redirect('/login?error=Session%20Ended');
        }
    });

module.exports = router;