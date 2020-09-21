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
var job = new CronJob('0 0 0 * * *', function() {
    listings.getListings().exec((err,docs)=>{

        for(x in docs){
          var meetup = docs[x];
          //if today's date is larger than expiration and listing is active
          if((docs[x].ExpirationDate < new Date()) && (docs[x].Active == true )){
            listings.disableListing(docs[x]._id);
           console.log(docs[x].Subject + " hosted by " + docs[x].Handle + " has expired")
           var listing = docs[x];
           users.getUserByHandle(docs[x].Handle).exec((err, user)=>{

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
        for(x in docs){
          var hourDiff = hourDifference(docs[x].date);
          console.log(hourDiff)
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
                        "subject": "Your tutoring session is approaching",
                        "classSubject": meeting.class,
                        "tutor": meeting.tutorHandle,
                        "student": meeting.userHandle,
                        "time": meeting.time,
                        "meeting": meeting._id,
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
                "template_id": "d-a07dc021e5634836bfc21bb866cf8fb5"
            });

            mail.end(function (res) {
              if (res.error){
                  console.log("this is the error for tutoring session coming", res.error);
                  console.log(res.body);
                  // throw new Error(res.error);
              } else if (res.accepted) {
                  console.log("email has sent for tutoring session coming");
              }
          });
        })
    }
    if(hourDiff < 0 && hourDiff > -24){
      var membersArr = [];
      for(i in docs[x].Members){
        if(docs[x].Members[i].role != "Host"){
          membersArr.push(docs[x].Members[i].handle);
        }
      }
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
  if(hourDiff < 72 && docs[x].ZoomLink == null && docs[x].Location == null){
    users.getUserByHandle(docs[x].tutorHandle).exec((err, user)=>{
      if(docs[x].Virtual){
 mail.headers({
        "content-type": "application/json",
        "authorization": process.env.SENDGRID_API_KEY,
        });
        mail.type("json");
        mail.send({
        "personalizations": [
            {
                "to": [{"email": user[0].email}],
                "dynamic_template_data": {
                    "subject": "You need to schedule your Zoom meeting for your tutoring session",
                    "classSubject": docs[x].class,
                    "location":docs[x]._id
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
      }
      else{
 mail.headers({
        "content-type": "application/json",
        "authorization": process.env.SENDGRID_API_KEY,
        });
        mail.type("json");
        mail.send({
        "personalizations": [
            {
                "to": [{"email": user[0].email}],
                "dynamic_template_data": {
                    "subject": "You need to set the location of your tutoring session",
                    "classSubject": docs[x].class,
                     "location":docs[x]._id
      
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
      }
     
    })
  }
}
});
        users.getAllUsers().exec((err,docs)=>{
          for(x in docs){
            if(docs[x].dateCreated){
              //send a reminder to verify account if its been 24 hours or less since creation
              //and account is still inactive
              if(docs[x].status == "Inactive"){
                //This is working
                mail.headers({
                  "content-type": "application/json",
                  "authorization": process.env.SENDGRID_API_KEY,
                  });
                  mail.type("json");
                  mail.send({
                  "personalizations": [
                      {
                          "to": [{ "email": docs[x].email}],
                          "dynamic_template_data": {
                              "subject": "You need to activate your account",
                              "name": docs[x].first_name + " " + docs[x].last_name,
                              "code": docs[x].activationCode,
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

}, null, true, 'America/New_York');
job.start();
module.exports = router;