//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
var stripe = require('stripe')(process.env.STRIPE_KEY);
//DBs used
const userDB = require('../../models/Database/UserDB');
const StreamDB = require('../../models/Database/StreamDB');
const EmailFunction = require('../../models/classes/EmailFunction');
//instantiate DBs
const UserDB = new userDB();
const emailFunction = new EmailFunction();
const stream = new StreamDB();
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
        UserDB.getUserByEmail(req.query.email).then((docs)=>{
            //if the email exists render the page and the account is inactive
                if(docs.length > 0){
                    
                        res.render('UserNotLoggedIn/verifyAccount',{session:req.session, qs:req.query});
                    
                }
                else{
                    res.redirect("/");
                }
        })
        .catch((err)=>{
            console.log(err)
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
                if(docs.length > 0){
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
                                stream.addStream(docs[0].handle, docs[0]._id,docs[0].img)
                                    .then((stream)=>{
                                     UserDB.addStreamId(docs[0]._id, stream._id)
                                res.redirect("/Login?message=Account Confirmed");
                             })
                            }).catch(function(err){
                                console.log(err);
                            });    
                        }
                    })    
                }
                else{
                    res.redirect("/Login?message=Account Confirmed");
                }
            })
        }
        else{
            res.redirect("/VerifyAccount?email="+req.body.email+"&error=Incorrect Confirmation Code");
        }
    });
})
//resend account verification code
router.post("/sendEmail", function(req, res){
    console.log("Send email")
    //generate random code and save it to the DB
    var activationCode = Math.floor(Math.random() * 10000);
    UserDB.updateActivationCode(req.body.email1,  activationCode)
    .then(()=>{
        UserDB.getUserByEmail(req.body.email1).then((user)=>{
            if(user.length > 0) {
                console.log("User: " +user[0])
                emailFunction.createEmail(user[0].email, "VerifyAccount",
                 [activationCode, user[0].first_name ])
                 .then(()=>{
                    res.redirect("/login?message=New Email Sent");
                 })
                 .catch((err)=>{
                    res.redirect("/login?message=There was a problem sending an email to your account. Try again!");
                     console.log(err)
                 })
            }
         })
    })
});
module.exports = router;