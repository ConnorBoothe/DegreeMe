//Disable expiring listings at midnight
//packages used
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_KLmOibLZEyhi7d6RA7CA42Bf00ZifUQEt7');
const CronJob = require('cron').CronJob;
//require DBs
const ListingsDB = require('../../models/Database/ListingsDB');
const MeetupsDB = require('../../models/Database/MeetupsDB');
const UserDB = require('../../models/Database/UserDB');
const ConnectionsDB = require('../../models/Database/MeetupsDB');
const AcceptedBidsDB = require('../../models/Database/AcceptedBidsDB');
const Stripe = require('stripe');
// instantiate DBs
var listings = new ListingsDB();
var meetups = new MeetupsDB();
var users = new UserDB();
var connections = new ConnectionsDB();
var acceptedBids = new AcceptedBidsDB();
function hourDifference(date){
  var diffTime = date - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}
//job runs every night at midnight
var job = new CronJob('0 0 0 * * *', function() {
  console.log("Running")
    listings.getListings().exec((err,docs)=>{
        for(x in docs){
          //if today's date is larger than expiration and listing is active
          if((docs[x].ExpirationDate < new Date()) && (docs[x].Active == true )){
            listings.disableListing(docs[x]._id);
           console.log(docs[x].Subject + " hosted by " + docs[x].Handle + " has expired")
          }
          //if session is less than 24 hours away, send email to all parties involved
          else if((docs[x].ExpirationDate - new Date() ) ){
          //   listings.disableListing(docs[x]._id);
          //  console.log(docs[x].Subject + " hosted by " + docs[x].Handle + " has expired")
          }
        }

    })
      meetups.getAllMeetups().exec((err,docs)=>{
        for(x in docs){
          var hourDiff = hourDifference(docs[x].date);

          //send email reminder to all members
          if(hourDiff > 0 && hourDiff < 24){
            for(i in docs[x].Members){
              //console.log(docs[x].Members[i]);
            }
          }
          //if session has already occurred, send email to all non-host members asking them to leave a review
          else if(hourDiff < 0 && Math.abs(hourDiff) < 24){
            for(i in docs[x].Members){
              if(docs[x].Members.role != "Host"){
                //console.log(docs[x].Members[i]);
              }
             
            }
          }
        }

    })
        users.getAllUsers().exec((err,docs)=>{
          for(x in docs){
            
            if(docs[x].dateCreated){
              var hourDiff = Math.abs(hourDifference(docs[x].dateCreated));
              //send a reminder to verify account if its been 24 hours or less since creation
              //and account is still inactive
              if(hourDiff < 24 && docs[x].status == "Inactive"){
                
              }
            }
          }
        })
      //capture payment intents after the tutoring session has occurred
      meetups.getAllMeetups().exec((err,docs)=>{
        var curTime = new Date();
        for(var i in docs){
           if(curTime>docs[i].date){
            users.getUserByHandle(docs[i].tutorHandle).exec((err,tutor)=>{
              if(err){
                console.log("something broke in capturing intents")
              }else{
                for(var j in docs[i].Members){
                  if(docs[i].Members[j].role === "Host" && docs[i].Members[j].intent != "none" ){
                  
                    stripe.paymentIntents.capture(
                      docs[i].Members[j].intent,
                      { stripeAccount: tutor[0].StripeId}
                      ).then(function(intent){
                        //remove the payment intent
                        meetups.setIntentToNone(docs[i]._id);
                    })
                    .catch(function(err){
                      console.log(err)
                    })
                  }
                 
                }    
              }
            })
          }
        }
      })
      //capture bid payment intents
      acceptedBids.getAll().exec((err, docs)=>{
        //  console.log(docs)
        for(x in docs){
          //if due date is in the past, capture the payment intent
          if(new Date() > docs[x].DueDate && docs[x].Intent != "none"){
            //charge the intent
            stripe.paymentIntents.capture(
              docs[x].Intent,
              { stripeAccount: docs[x].StripeId}
              ).then(function(intent){
                 //set payment intent to none
                  acceptedBids.setIntentToNone(docs[x]._id);
            })
            .catch(function(err){
              console.log(err)
            })
          }
        }

      })
      console.log("REACHED END")
}, null, true, 'America/Los_Angeles');
job.start();
module.exports = router;