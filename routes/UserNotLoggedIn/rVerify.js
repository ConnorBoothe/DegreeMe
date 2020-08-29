//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
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

    let testAccount =  nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "connorboothe@gmail.com", // generated ethereal user
          pass: "Niner96**" // generated ethereal password
        }
      });
    transporter.sendMail({
        from: '"CollegeTutor Team" <connorboothe@gmail.com>', // sender address
        to: "emendel@uncc.edu", // list of receivers
        subject: "Account Confirmation", // Subject line
        html: "<h3>Follow the link below and enter code <strong>"+activationCode+"</strong> to confirm your account</h3><a href='http://127.0.0.1:3000/VerifyAccount?email="+req.body.email1+"'><button style='width:300px; font-size:20px; color:white; background-color:#007bff;"+
        "border:none; border-radius:5px; font-family:Helvetica Neue, Helvetica, sans-serif; cursor:pointer;'>Confirm</button></a>"// html body
      }, function(err,info){
        if(err){
            console.log(err)
        }
        else{
            console.log(info)
        }
      });
    res.redirect("/login?message=New Email Sent");
});
module.exports = router;