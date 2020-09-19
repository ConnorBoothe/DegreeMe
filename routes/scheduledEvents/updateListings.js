//Disable expiring listings at midnight
//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const nodemailer = require("nodemailer");
var unirest = require('unirest');
const CronJob = require('cron').CronJob;
//require DBs
const ListingsDB = require('../../models/Database/ListingsDB');
const MeetupsDB = require('../../models/Database/MeetupsDB');
const UserDB = require('../../models/Database/UserDB');
const ConnectionsDB = require('../../models/Database/MeetupsDB');
const AcceptedBidsDB = require('../../models/Database/AcceptedBidsDB');
// instantiate DBs
var listings = new ListingsDB();
var meetups = new MeetupsDB();
var users = new UserDB();
var connections = new ConnectionsDB();
var acceptedBids = new AcceptedBidsDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
function hourDifference(date){
  var diffTime = date - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}
//job runs every night at midnight
var job = new CronJob('0 * * * * *', function() {
    listings.getListings().exec((err,docs)=>{
        for(x in docs){
          //if today's date is larger than expiration and listing is active
          if((docs[x].ExpirationDate < new Date()) && (docs[x].Active == true )){
            listings.disableListing(docs[x]._id);
           console.log(docs[x].Subject + " hosted by " + docs[x].Handle + " has expired")
           var listing = docs[x];
           users.getUserByHandle(docs[x].Handle).exec((err, user)=>{
             console.log("email", user[0].email);

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
                            "email": user[0].email,
                            "name": user[0].first_name + " " +user[0].last_name
                        }
                ],
                    "dynamic_template_data": {
                        "subject": "Your listing has expired",
                        "classSubject": listing.Subject,
                        "editListing": listing._id,
                },
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
                "template_id": "d-5d1e4b2173cd45658350f76d708e1f66"
            });

            mail.end(function (res) {
              if (res.error){
                  console.log("this is the error listing expired", res.error);
                  console.log(res.body);
                  // throw new Error(res.error);
              } else if (res.accepted) {
                  console.log("email has sent listing expired");
              }
          });
           })
           

          }
        }

    })

      meetups.getAllMeetups().exec((err,docs)=>{
        console.log(docs)
        for(x in docs){
          var hourDiff = hourDifference(docs[x].date);
          //send email reminder to all members
          if(hourDiff > 0 && hourDiff < 24){
            var membersArr = []
            for(i in docs[x].Members){
              membersArr.push(docs[x].Members[i].handle);
            }
            var meeting = docs[x];
            users.getUserEmailsByHandle(membersArr).exec((err, docs1)=>{
              var emailObjArray = [];
            for(x in docs1){
              emailObjArray.push({"email": docs1[x].email});
            }
          //   mail.headers({
          //   "content-type": "application/json",
          //   "authorization": process.env.SENDGRID_API_KEY,
          //   });
            
          //   mail.type("json");
          //   mail.send({
          //   "personalizations": [
          //       {
          //           "to": emailObjArray,
          //           "dynamic_template_data": {
          //               "subject": "Your tutoring session is approaching",
          //               "classSubject": meeting.class,
          //               "tutor": meeting.tutorHandle,
          //               "student": meeting.userHandle,
          //               "time": meeting.time,
          //               "meeting": meeting._id,
          //       },
          //   }
          //   ],
          //       "from": {
          //           "email": "notifications@degreeme.io",
          //           "name": "DegreeMe"
          //   },
          //       "reply_to": {
          //           "email": "noreply@degreeme.io",
          //           "name": "No Reply"
          //   },
          //       "template_id": "d-a07dc021e5634836bfc21bb866cf8fb5"
          //   });

          //   mail.end(function (res) {
          //     if (res.error){
          //         console.log("this is the error for tutoring session coming", res.error);
          //         console.log(res.body);
          //         // throw new Error(res.error);
          //     } else if (res.accepted) {
          //         console.log("email has sent for tutoring session coming");
          //     }
          // });
          
         
        
         //if session has already occurred, send email to all non-host members asking them to leave a review    
        })
    }
    if(hourDiff < 0 && hourDiff > -24){
      var membersArr = [];
      for(i in docs[x].Members){
        if(docs[x].Members[i].role != "Host"){
          membersArr.push(docs[x].Members[i].handle);
        }
      }
      console.log("this is the new docs", docs[x]);
      var occurred = docs[x];
      users.getUserEmailsByHandle(membersArr).exec((err, docs1)=>{
        var emailObjArray = [];
      for(x in docs1){
        emailObjArray.push({"email": docs1[x].email});
      }
 
      mail.headers({
      "content-type": "application/json",
      "authorization": process.env.SENDGRID_API_KEY,
      });

      mail.type("json");
      mail.send({
      "personalizations": [
          {
              "to": emailObjArray,
              "dynamic_template_data": {
                  "subject": "Leave your tutor a review",
                  "tutorName": occurred.tutorHandle,
                  "reviewID": occurred._id,
          },
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
          "template_id": "d-c1d0780dfbab4233ba376377a87b8b24"
      });

      mail.end(function (res) {
        if (res.error){
            console.log("this is the error leave a review ", res.error);
            console.log(res.body);
            // throw new Error(res.error);
        } else if (res.accepted) {
            console.log("email has sent leave a review");
        }
    });
    });
  }
  //send a reminder to set location/zoom link 3 days before session occurs
  if(hourDiff < 72 && !docs[x].ZoomLink && !docs[x].Location){
    users.getUserByHandle(docs[x].tutorHandle).exec((err, user)=>{
      console.log('yo this is docs', docs[x]);
      mail.headers({
        "content-type": "application/json",
        "authorization": process.env.SENDGRID_API_KEY,
        });
       
        mail.type("json");
        mail.send({
        "personalizations": [
            {
                "to": user[0].email,
                "dynamic_template_data": {
                    "subject": "You need to set the locatioin of your tutoring session",
                    "classSubject": "",
            },
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
  
        mail.end(function (res) {
          if (res.error){
              console.log("this is the error for set location", res.error);
              console.log(res.body);
              // throw new Error(res.error);
          } else if (res.accepted) {
              console.log("email has sent for set location");
          }
      });
    })
  }
}
});
        users.getAllUsers().exec((err,docs)=>{
          for(x in docs){
            if(docs[x].dateCreated){
              var hourDiff = Math.abs(hourDifference(docs[x].dateCreated));
              console.log('this is docs duhh', docs[x]);
              //send a reminder to verify account if its been 24 hours or less since creation
              //and account is still inactive
              if(hourDiff < 24 && docs[x].status == "Inactive"){
                mail.headers({
                  "content-type": "application/json",
                  "authorization": process.env.SENDGRID_API_KEY,
                  });
                  console.log("new emails", docs[x].email)
                  mail.type("json");
                  mail.send({
                  "personalizations": [
                      {
                          "to": docs[x].email,
                          "dynamic_template_data": {
                              "subject": "You need to activate your account",
                              "name": "Name",
                              "code": "activationCode",
                              "email": "req.body.email",
                      
                      },
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
                      "template_id": "d-a279f28d3ff74756b820258169c78c90"
                  });
      
                  mail.end(function (res) {
                    if (res.error){
                        console.log("this is the error for activate account", res.error);
                        console.log(res.body);
                        // throw new Error(res.error);
                    } else if (res.accepted) {
                        console.log("email has sent for activate account");
                    }
                });
              }
            }
          }
        })
      //capture payment intents after the tutoring session has occurred
      //get meetups where
      meetups.getAllMeetups().exec((err,docs)=>{
        console.log(docs)
        var curTime = new Date();
        for(var i in docs){
            //if date is in the paat
          //  if(curTime > docs[i].date){
             //get tutor doc from UserDB
            users.getUserByHandle(docs[i].tutorHandle).exec((err,tutor)=>{
              if(err){
                console.log("something broke in capturing intents")
              }else{
                console.log(docs[i].Members);
                for(var j in docs[i].Members){
                  if(docs[i].Members[j].role === "Student" && docs[i].Members[j].intent != "none" ){
                    console.log("HIT")
                    stripe.paymentIntents.capture(
                      docs[i].Members[j].intent,
                      { stripeAccount: tutor[0].StripeId}
                      ).then(function(intent){
                        console.log("intent", intent)
                        //remove the payment intent
                        // meetups.setIntentToNone(docs[i]._id);
                        mail.headers({
                          "content-type": "application/json",
                          "authorization": process.env.SENDGRID_API_KEY,
                          });
                          mail.type("json");
                          mail.send({
                          "personalizations": [
                              {
                                  "to": docs[i].email,
                                  "dynamic_template_data": {
                                      "subject": "You just got paid",
                              },
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
                              "template_id": "d-8f8c5a2da15a4775b54b84a50b64066d"
                          });
              
                          mail.end(function (res) {
                            if (res.error){
                                console.log("this is the error for you just got paid", res.error);
                                console.log(res.body);
                                // throw new Error(res.error);
                            } else if (res.accepted) {
                                console.log("email has sent for you just got paid");
                            }
                        });
                    })
                    .catch(function(err){
                      // console.log(err)
                    })
                  }
                 
                }    
                //set to paid if successful to avoid future processing
                meetups.setToPaid(docs._id);
              }
            })
          // }
        }
      })
      // //capture bid payment intents
      // acceptedBids.getAllIntents().exec((err, docs)=>{
      //   console.log("Intent",docs)
      //   for(x in docs){
      //     //if due date is in the past, capture the payment intent
      //     // if(new Date() > docs[x].DueDate && docs[x].Intent != "none"){
      //       //charge the intent
      //       stripe.paymentIntents.capture(
      //         docs[x].Intent,
      //         { stripeAccount: docs[x].StripeId}
      //         ).then(function(intent){
      //            //set payment intent to none
      //             acceptedBids.setIntentToNone(docs[x]._id);
      //             users.getUserByHandle(docs[x].Bidder).exec((err, docs1)=>{
      //               // mail.headers({
      //               //   "content-type": "application/json",
      //               //   "authorization": process.env.SENDGRID_API_KEY,
      //               //   });
      //               //   mail.type("json");
      //               //   mail.send({
      //               //   "personalizations": [
      //               //       {
      //               //           "to": docs1[0].email,
      //               //           "dynamic_template_data": {
      //               //               "subject": "You just got paid",
      //               //       },
      //               //   }
      //               //   ],
      //               //       "from": {
      //               //           "email": "notifications@degreeme.io",
      //               //           "name": "DegreeMe"
      //               //   },
      //               //       "reply_to": {
      //               //           "email": "noreply@degreeme.io",
      //               //           "name": "No Reply"
      //               //   },
      //               //       "template_id": "d-e54827ff53514c15969d2e52db32e13d"
      //               //   });
          
      //               //   mail.end(function (res) {
      //               //       // if (res.error) throw new Error(res.error);
          
      //               //   console.log(res.body);
      //               //   })
      //             })
                 
      //       })
      //       .catch(function(err){
      //         console.log(err)
      //         console.log("HELP REQ ERROR")
      //       })
      //     // }
      //     //if date is in the future and less than or equal to 24 hours away
      //     //this needs its own function in acceptedBids DB
      //     if(new Date() > docs[x].DueDate && hourDifference(docs[x].DueDate) <= 24){
      //       users.getUserByHandle(docs[x].Bidder).exec((err, docs1)=>{
      //       mail.headers({
      //         "content-type": "application/json",
      //         "authorization": process.env.SENDGRID_API_KEY,
      //         });
      //         console.log("new emails2", docs1[0].email)
      //         mail.type("json");
      //         mail.send({
      //         "personalizations": [
      //             {
      //                 "to": docs1[0].email,
      //                 "dynamic_template_data": {
      //                     "subject": "The due date for your bid is approaching!",
      //                     "name": "Name",
                  
      //             },
      //         }
      //         ],
      //             "from": {
      //                 "email": "notifications@degreeme.io",
      //                 "name": "DegreeMe"
      //         },
      //             "reply_to": {
      //                 "email": "noreply@degreeme.io",
      //                 "name": "No Reply"
      //         },
      //             "template_id": "d-cae3a6aefa6149b193da1998269ccc16"
      //         });
  
      //         mail.end(function (res) {
      //             // if (res.error) throw new Error(res.error);
  
      //         console.log("due date", res.body);
      //         })
      //       });
      //     }
      //   }

      // })
}, null, true, 'America/Los_Angeles');
job.start();
module.exports = router;