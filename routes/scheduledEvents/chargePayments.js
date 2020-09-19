//Charge payment after service is rendered
//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
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
// var connections = new ConnectionsDB();
var acceptedBids = new AcceptedBidsDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
function hourDifference(date){
  var diffTime = date - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}
//job runs every night at midnight
var job = new CronJob('0 * * * * *', function() {
      console.log("RUNNING")
      meetups.getMeetupsWherePaymentDue().exec((err,docs)=>{
        var curTime = new Date();
        for(var i in docs){
            var meetupId = docs[i]._id;
            console.log("i", i)
            //if date is in the past
          //  if(curTime > docs[i].date){
             //get tutor doc from UserDB
            // users.getUserByHandle(docs[i].tutorHandle)
            // .then(function(tutor){
              // if(false){
              //   console.log("something broke in capturing intents")
              // }else{
                console.log("I: ", i)
                console.log("MEMS", docs[i].Members)
                for(var j in docs[i].Members){
                 console.log("J: ", docs[i].Members[j].intent)
                  if(docs[i].Members[j].role === "Student"){
                     stripe.paymentIntents.capture(
                      docs[i].Members[j].intent,
                      { stripeAccount:"acct_1HSVm2GfoT5Q4SAQ"}
                      ).then(function(intent){
                        //remove the payment intent
                        console.log("THEN RAN MEETUPS")
                         meetups.setIntentToNone(meetupId, j);
                        // mail.headers({
                        //   "content-type": "application/json",
                        //   "authorization": process.env.SENDGRID_API_KEY,
                        //   });
                        //   mail.type("json");
                        //   mail.send({
                        //   "personalizations": [
                        //       {
                        //           "to": docs[i].email,
                        //           "dynamic_template_data": {
                        //               "subject": "You just got paid",
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
                        //       "template_id": "d-8f8c5a2da15a4775b54b84a50b64066d"
                        //   });
              
                        //   mail.end(function (res) {
                        //       // if (res.error) throw new Error(res.error);
                        //   console.log(res.body);
                        //   })
                    })
                    .catch(function(err){
                      //  console.log(err)
                    })
                  }
                 
                }    
                //set to paid if successful to avoid future processing
               
              // }
          // }
      // })
      meetups.setToPaid(docs[i]._id);
      }
      })
      // //capture bid payment intents
      acceptedBids.getAllIntents().exec((err, docs)=>{
        for(x in docs){
            stripe.paymentIntents.capture(
              docs[x].Intent,
              { stripeAccount: docs[x].StripeId}
              ).then(function(intent){
                 //set payment intent to none 
                 console.log(docs[x]._id);
                 console.log("THEN RAN HOE")
                  // acceptedBids.setIntentToNone(docs[x]._id);
                  // users.getUserByHandle(docs[x].Bidder).exec((err, docs1)=>{
                    // mail.headers({
                    //   "content-type": "application/json",
                    //   "authorization": process.env.SENDGRID_API_KEY,
                    //   });
                    //   mail.type("json");
                    //   mail.send({
                    //   "personalizations": [
                    //       {
                    //           "to": docs1[0].email,
                    //           "dynamic_template_data": {
                    //               "subject": "You just got paid",
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
                    //       "template_id": "d-e54827ff53514c15969d2e52db32e13d"
                    //   });
          
                    //   mail.end(function (res) {
                    //       // if (res.error) throw new Error(res.error);
          
                    //   console.log(res.body);
                    //   })
                  // })
                 
            })
            .catch(function(err){
              // console.log(err)
              console.log("HELP REQ ERROR")
            })
          // if date is in the future and less than or equal to 24 hours away
          // this needs its own function in acceptedBids DB
          // if(new Date() > docs[x].DueDate && hourDifference(docs[x].DueDate) <= 24){
          //   users.getUserByHandle(docs[x].Bidder).exec((err, docs1)=>{
          //   mail.headers({
          //     "content-type": "application/json",
          //     "authorization": process.env.SENDGRID_API_KEY,
          //     });
          //     console.log("new emails2", docs1[0].email)
          //     mail.type("json");
          //     mail.send({
          //     "personalizations": [
          //         {
          //             "to": docs1[0].email,
          //             "dynamic_template_data": {
          //                 "subject": "The due date for your bid is approaching!",
          //                 "name": "Name",
                  
          //         },
          //     }
          //     ],
          //         "from": {
          //             "email": "notifications@degreeme.io",
          //             "name": "DegreeMe"
          //     },
          //         "reply_to": {
          //             "email": "noreply@degreeme.io",
          //             "name": "No Reply"
          //     },
          //         "template_id": "d-cae3a6aefa6149b193da1998269ccc16"
          //     });
  
          //     mail.end(function (res) {
          //         // if (res.error) throw new Error(res.error);
  
          //     console.log("due date", res.body);
          //     })
          //   });
          // }
        }

      })
}, null, true, 'America/Los_Angeles');
job.start();
module.exports = router;