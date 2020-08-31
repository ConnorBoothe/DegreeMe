//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const unirest = require("unirest");
const mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
var stripe = require('stripe')(process.env.STRIPE_KEY);
//DBs used
const userDB = require('../../models/Database/UserDB');
//instantiate DBs
const UserDB = new userDB();
//use session and body parser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

//render the verify account page
router.get('/VerifyAccount', function(req, res){
    if(req.query.email){
        UserDB.getUserByEmail(req.query.email).exec((err,docs)=>{
            //if the email exists render the page and the account is inactive
            if(docs.length > 0 && docs[0].status != "Active"){
                res.render('UserNotLoggedIn/verifyAccount',{session:req.session, qs:req.query});
            }
            else{
                res.redirect("/");
            }
        })
       
    }
    else{
        res.redirect('/');
    }
   
});

//confirm user account
router.post("/updateStatus", function(req, res){
    UserDB.getActivationCode(req.body.email).exec((err,docs)=>{
        if(err){
            res.redirect("/");
        }
        if(req.body.code === docs.activationCode){
            //update status
            UserDB.updateStatus(req.body.email);
            UserDB.getUserByEmail(req.body.email).exec((err,docs) => {
                stripe.customers.create({
                    email:docs[0].email,
                    name:docs[0].first_name + " " + docs[0].last_name,
                    metadata:{
                        school:docs[0].school,
                        subscription:docs[0].subscription,
                    }
                },function(err, customer){
                    if (err!=null){
                        console.log(err);
                    }else{
                        //console.log(customer);
                        //console.log(docs[0].id);
                        UserDB.setCustomerId(docs[0].id,customer.id).then(function(data){
                        }).catch(function(err){
                            console.log(err);
                        });    
                    }
                })    
            })
            res.redirect("/Login?error=Account Confirmed");
        }
        else{
            res.redirect("/VerifyAccount?error=Confirmation Code Incorrect");
        }
    });
   
})

//resend account verification code
router.post("/sendEmail", function(req, res){
    //generate random code and save it to the DB
    var activationCode = Math.floor(Math.random() * 10000);
    UserDB.updateActivationCode(req.body.email1,  activationCode);
    UserDB.getUserByEmail(req.body.email1).exec((err, docs)=>{
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
                            "email": docs[0].email,
                        }
                ],
                    "dynamic_template_data": {
                        "subject": "Account Confirmation",
                        "name": docs[0].first_name,
                        "code": activationCode,
                        "email": docs[0].email,
                
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
                "template_id": "d-e54827ff53514c15969d2e52db32e13d"
            });
        
            mail.end(function (res) {
                // if (res.error) throw new Error(res.error);
        
            console.log(res.body);
            });
    })

   
    res.redirect("/login?message=New Email Sent");
});
module.exports = router;