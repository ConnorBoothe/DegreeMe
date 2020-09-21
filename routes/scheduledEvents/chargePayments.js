//Charge payment after service is rendered
//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
var unirest = require('unirest');
const CronJob = require('cron').CronJob;
//require DBs
const PaymentsDB = require('../../models/Database/PaymentsDB');
//instantiate classes
var payments = new PaymentsDB();
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

//capture individual intent
async function capturePayments(intent, stripeAccount){
  return payment = await stripe.paymentIntents.capture(
    intent,
    { stripeAccount:stripeAccount}
    )
}
//job runs every night at midnight
var job = new CronJob('0 0 0 * * *', function() {
      payments.getIntentWherePaymentDue().exec((err,docs)=>{
        if(docs){
          for(var x = 0; x < docs.length; x++){
            var payment = docs[x];
            console.log(payment.email)
            payments.setPaid(docs[x]._id);
            capturePayments( docs[x].intent, docs[x].stripeId)
            .then(function(){
              payments.setPaid(payment._id);
              
              mail.headers({
                      "content-type": "application/json",
                      "authorization": process.env.SENDGRID_API_KEY,
                      });
                      mail.type("json");
                      mail.send({
                      "personalizations": [
                          {
                              "to":[
                                {"email": payment.Email}
                              ],
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
                          // if (res.error) throw new Error(res.error);
                      console.log(res.body);
                      })
  
            })
            .catch(function(err){
              console.log(err)
            })
          }
        }
      })
}, null, true, 'America/New_York');

//re-run payments job at 1
var job1 = new CronJob('0 0 1 * * *', function() {
  payments.getIntentWherePaymentDue().exec((err,docs)=>{
    if(docs){
      for(var x = 0; x < docs.length; x++){
        var payment = docs[x];
        console.log(payment.email)
        payments.setPaid(docs[x]._id);
        capturePayments( docs[x].intent, docs[x].stripeId)
        .then(function(){
          payments.setPaid(payment._id);
          
          mail.headers({
                  "content-type": "application/json",
                  "authorization": process.env.SENDGRID_API_KEY,
                  });
                  mail.type("json");
                  mail.send({
                  "personalizations": [
                      {
                          "to":[
                            {"email": payment.Email}
                          ],
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
                      // if (res.error) throw new Error(res.error);
                  console.log(res.body);
                  })

        })
        .catch(function(err){
          console.log(err)
        })
      }
    }
  })
}, null, true, 'America/New_York');
job.start();
job1.start();
module.exports = router;