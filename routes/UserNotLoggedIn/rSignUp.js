//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const sgMail = require('@sendgrid/mail');
const {
    Storage
} = require("@google-cloud/storage");

const path = require('path');
var unirest = require('unirest');
//const stripe = require('stripe')('sk_test_R9jRtcqaPjkvbrQkt7TaLIK8');
const {
    check,
    validationResult
} = require('express-validator');
//Dbs used
var UserDB = require('../../models/Database/UserDB');
//instantiate DB
var users = new UserDB();

//use session and body parser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

router.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

//render the signup page
router.get('/SignUp', function (req, res) {
    res.render('UserNotLoggedIn/signUp', {
        session: req.session,
        schools: ["University of North Carolina at Charlotte"],
        qs: req.query
    });
});
//POST route that handles user sign up
router.post('/SignUp', [
    check('first_name').isString().trim().escape(),
    check('last_name').isString().trim().escape(),
    check('handle').isString().trim().escape(),
    check('school').isString().trim().escape(),
    check('email').isEmail().normalizeEmail().trim().escape(),
    check('password').isString().trim().escape(),
    check('password').isLength({
        min: 6
    }),
    check('retypePW').isString().trim().escape(),
    check('retypePW').isLength({
        min: 6
    })
], function (req, res) {
    //default profile image array of urls
    const defaultImages = ["https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_4.png?alt=media&token=94de9ef2-573a-4b1f-a5c3-edf56c1855cc",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_2.png?alt=media&token=dc792ec6-9909-4ef8-ba6f-56b87818cdee",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_1.png?alt=media&token=2fa89c02-1341-414a-84a1-943ee00fde6b",
        "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo.png?alt=media&token=c56774ca-891b-47b9-9616-a3011347e78b"
    ];
    //query UserDB based on email input
    users.getUserByEmail(req.body.email).then((docs) => {
        //check if user with entered email already exists
        if (docs.length > 0) {
            //user exists, redirect with error message
            res.redirect("/SignUp?msg=Email%20Already%20In%20Use");
        }
        //check if handle already exists
        users.getUserByHandle(req.body.handle)
            .then(function (docs) {
                //redirect with error message
                if (docs.length > 0) {
                    res.redirect("/SignUp?msg=Handle%20Already%20In%20Use");
                } else {
                    var activationCode = Math.floor(Math.random() * 10000);
                    //get random number between 0-3 and select that index of defaultImages array
                    var randomNum = Math.floor(Math.random() * Math.floor(4));
                    var randomImg = defaultImages[randomNum];
                        var pw = req.body.password;
                        //encrypt password input. produces a hash that is saved to the DB
                        bcrypt.hash(pw, 8, function (err, hash) {
                            //the name field will coming from the request body will be a single value with the new UI
                            //Rather than calling req.body.first_name and req.body.lastName,
                            //split req.body.name by the space and save first index to first name, second to last name
                            //capitalize first letter of first name
                            var fNameLetter = req.body.first_name[0].substring(0, 1).toUpperCase();
                            var first_name = fNameLetter + req.body.first_name.substring(1);
                            //capitalize first letter of last name
                            var lNameLetter = req.body.last_name[0].substring(0, 1).toUpperCase();
                            var last_name = lNameLetter + req.body.last_name.substring(1);
                            users.addUser("@" + req.body.handle, first_name, last_name, req.body.school, req.body.email, hash,
                                randomImg, "Inactive", activationCode,
                                "None", req.body.major, req.body.classification).then(function(){
                                    //send account verification email
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
                                                    "email": req.body.email,
                                                    "name": first_name
                                                }
                                        ],
                                            "dynamic_template_data": {
                                                "subject": "Account Confirmation",
                                                "name": first_name,
                                                "code": activationCode,
                                                "email": req.body.email,

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
                                        if (res.error){
                                            console.log("this is the error for account confirmation", res.error);
                                            console.log(res.body);
                                            // throw new Error(res.error);
                                        } else if (res.accepted) {
                                            console.log("email has sent for account confirmation");
                                        }
                                    });
                                        res.redirect('/login?message=Account%20Successfully%20Created');
                                })
                                .catch(function(err){
                                    res.redirect("/?error=" + err)
                                });
                            // using Twilio SendGrid's v3 Node.js Library
                            // https://github.com/sendgrid/sendgrid-nodejs
                        });
                }
            })

    });
})
//POST route that handles mobile sign up
//This post route will no longer be used with the new UI
router.post('/SignUpMobile', [
    check('first_name').isString().trim().escape(),
    check('last_name').isString().trim().escape(),
    check('handle').isString().trim().escape(),
    check('school').isString().trim().escape(),
    check('email').isEmail().normalizeEmail().trim().escape(),
    check('password').isString().trim().escape(),
    check('password').isLength({
        min: 6
    }),
    check('retypePW').isString().trim().escape(),
    check('retypePW').isLength({
        min: 6
    })
], function (req, res) {
    // console.log("Uploading image");
    // upload(req, res, (err) => {
    // console.log("BYTE COUNT: " + req.socket.bytesRead)
    // if(req.socket.bytesRead > 1000000){
    //     res.redirect('/signUp?error=Image Too Large');
    // }
    // else if (err) {
    //     console.log(err)
    //     res.redirect('/signUp?error=Image Too Large');
    // } else {
    var emailExists = false;
    var handleExists = false;
    //will change to use function getUserByEmail()
    console.log("SIGN UP MOBILE")
    console.log(req.body)
    users.getStudents().exec((err, docs) => {
        console.log(req.body.email)
        for (x in docs) {
            if (req.body.email === docs[x].email) {
                emailExists = true;
            }
            if (req.body.handle1 === docs[x].handle) {
                handleExists = true;
            }
        }
        if (emailExists) {
            res.redirect("/SignUp?msg=Email%20Already%20In%20Use");
        } else if (handleExists) {
            res.redirect("/SignUp?msg=Handle%20Already%20In%20Use");
        } else {
            console.log("RUNNING sign up post MOBILE")
            console.log(req.body.screenSize)
            var activationCode = Math.floor(Math.random() * 10000);

            bcrypt.genSalt(10, function (err, salt) {
                var pw = req.body.password;
                var handle = req.body.handle;

                bcrypt.hash(pw, 8, function (err, hash) {

                    console.log("Mobile")
                    var fNameLetter = req.body.first_name.substring(0, 1);
                    fNameLetter = fNameLetter.toUpperCase();
                    var first_name = fNameLetter + req.body.first_name.substring(1);
                    var lNameLetter = req.body.last_name.substring(0, 1);
                    lNameLetter = lNameLetter.toUpperCase();
                    var last_name = lNameLetter + req.body.last_name.substring(1);
                    console.log(first_name)
                    console.log(last_name)
                    console.log("ADDDING USER")
                    users.addUser("@" + req.body.handle1, first_name, last_name, req.body.school, req.body.email, hash,
                            req.body.imageURL, "Inactive", activationCode,
                            "None", req.body.major, req.body.classification).then(function () {
                            res.redirect('/login?message=Account%20Successfully%20Created');
                            // https://github.com/sendgrid/sendgrid-nodejs
                            var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");

                            mail.headers({
                                "content-type": "application/json",
                                "authorization": process.env.SENDGRID_API_KEY,
                            });

                            mail.type("json");
                            mail.send({
                                "personalizations": [{
                                    "to": [{
                                        "email": req.body.email,
                                        "name": req.body.first_name
                                    }],
                                    "dynamic_template_data": {
                                        "subject": "Account Confirmation",
                                        "name": req.body.first_name,
                                        "code": activationCode,
                                        "email": req.body.email,

                                    },
                                }],
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
                                if (res.error) {
                                    console.log("this is the error for account confirmation", res.error);
                                    console.log(res.body);
                                    // throw new Error(res.error);
                                } else if (res.accepted) {
                                    console.log("email has sent for account confirmation");
                                }
                            });
                        })
                        .catch(function (err) {
                            res.redirect("/?error=" + err)
                        });
                    // using Twilio SendGrid's v3 Node.js Library

                });
            }, function (err) {
                console.log(err);
            });
            // });
        }
    })
    // }
    // })
})
module.exports = router;