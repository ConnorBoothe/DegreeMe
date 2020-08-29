//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const sgTransport = require('nodemailer-sendgrid-transport');
var unirest = require('unirest');
//DBs used
const userDB = require('../../models/Database/UserDB');
const { unstable_renderSubtreeIntoContainer } = require('react-dom');
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

//render the update password page
router.get('/UpdatePassword', function(req, res){
     res.render('UserNotLoggedIn/UpdatePassword',{session:req.session, qs:req.query});

});
//render enter new pw page
router.get('/EnterNewPassword', function(req, res){
    if(req.query.email){
        UserDB.getUserByEmail(req.query.email).exec((err, docs)=>{
            if(docs.length > 0){
                res.render('UserNotLoggedIn/EnterNewPassword',{session:req.session, qs:req.query});
            }
            else{
                res.redirect("/");
            }
        })
    }
    else{
        res.redirect("/UpdatePassword");
    }
});
//reset user pw
router.post("/updatePassword", function(req, res){

    UserDB.getActivationCode(req.body.email).exec((err,docs)=>{ //get pw activation code
        if(err){
            res.redirect("/");
        }
        if(req.body.code === docs.activationCode){ //match
            //encrypt pw and save it to DB
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, 8, function(err, hash) {
                    if(err){
                        res.redirect("/EnterNewPassword?err=An%20Error%20Occurred")
                    }
                    UserDB.updatePassword(req.body.email, hash);
                    res.redirect("/Login?error=Password%20Updated");
                });
            });
        }
        else{
            res.redirect("/EnterNewPassword?email="+req.body.email+"&err=Verification Code Incorrect");
        }
    });
})
//send update pw email
router.post("/sendPWEmail", function(req, res){
    //generate random code and update DB
    var activationCode = Math.floor(Math.random() * 10000);
    UserDB.updateActivationCode(req.body.email,  activationCode);
    UserDB.getUserByEmail(req.body.email).exec((err, docs1)=>{
        if(docs1.length > 0 ){

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
                                            "email": "chrisbred4s@gmail.com",
                                            "name": "Christian Hithe"
                                        }
                                ],
                                    "dynamic_template_data": {
                                        "subject": "Password Reset",
                                        "code": activationCode,
                                        "email": req.body.email,
                                
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
                                "template_id": "d-6be9fa55611049c6b6222d345b1ea2ac"
                            });

                            mail.end(function (res) {
                                // if (res.error) throw new Error(res.error);

                            console.log(res.body);
                            });
            //  var options = {
            //     auth: {
            //         api_key: process.env.SENDGRID_API_KEY
            //     }
            // }
            // var mailer = nodemailer.createTransport(sgTransport(options));
            // var email = {
            //     to: 'chrisbred4s@gmail.com',
            //     from: 'notifications@degreeme.io',
            //     subject: 'Password Reset',
            //         attachments: [{
            //             filename: 'lock.png',
            //             path: 'assets/img/lock.png',
            //             cid: 'myimagecid'
            //         }],
            //         html: "<div style='width:100%; background-color:#18191a; text-align:center'><div style='background-color:#18191a;margin-left:auto;margin-right:auto;width:100%;padding-bottom:20px; padding-top:20px'><h1 class='text-light' style='color:white;'>Password Reset Tool</h1><img src='cid:myimagecid' alt='secure'/><h3 class='text-light' style='color:white; font-size:17px;'>Click update password, then enter the below code and your new password.</h3><h1 style='color:white; font-size:30px;'><strong>" + activationCode + "</strong></h1><br><a href='http://127.0.0.1:3000/EnterNewPassword?email=" + req.body.email + "'><button style='width:300px; font-size:20px; color:white; background-color:#007bff;" +
            //                 "border:none; border-radius:10px; font-family:Open Sans, sans-serif; width:50%;padding:5px; cursor:pointer;'>Update Password</button></a></div></div>",
            // };
            // mailer.sendMail(email, function(err, res) {
            //     if (err) { 
            //         console.log(err);
            //     }
            //     console.log(res);
            // });
            res.redirect("/UpdatePassword?message=%20Email%20Sent");
        }
        else{
            res.redirect("/UpdatePassword?message=%20Email%20does%20not%20exist");
        }
    })
    
});
module.exports = router;