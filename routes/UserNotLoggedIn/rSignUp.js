//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const sgMail = require('@sendgrid/mail');
const stream = require('stream');
const {Storage} = require("@google-cloud/storage");
var multer = require("multer");
const path = require('path');
const nodemailer = require("nodemailer");
const fs = require("fs");
var unirest = require('unirest');
//const stripe = require('stripe')('sk_test_R9jRtcqaPjkvbrQkt7TaLIK8');
const {
    check,
    validationResult
} = require('express-validator');
//Dbs used
var UserDB = require('../../models/Database/UserDB');
//instantiate DBs
var users = new UserDB();

const gc = new Storage({
    keyFilename: path.join(__dirname,"../../degreeme1-727d561034e0.json"),
    projectId:"degreeme1"
  });
//image bucket
const degreemeImages = gc.bucket("degreeme-images");
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

//multer package used for storing user profile photos. Not currently in use
const storage = multer.diskStorage({
    destination: './assets/img/userImg',
    filename: function (req, file, callback) {
        console.log("File" + file)

        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 25 * 1024 * 1024
    },
    fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
    }

}).single('userImage');

//Check file type function
function checkFileType(file, callback) {
    //Allowed Extensions
    const filetypes = /jpeg|jpg|png|gif/;
    //Check Extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //Check Mimetype
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        callback(null, true);
    } else {
        callback('Error: Images Only!');
    }
}
//render the signup page
router.get('/SignUp', function (req, res) {
    res.render('UserNotLoggedIn/signUp', {
        session: req.session,
        schools: ["University of North Carolina at Charlotte"],
        qs: req.query
    });
});

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
    upload(req, res, (err) => {
        if (err) {
            res.redirect('/signUp?error=' + err);
        } else {

            var emailExists = false;
            var handleExists = false;
            //will change to use function getUserByEmail()
            users.getStudents().exec((err, docs) => {
                for (x in docs) {
                    if (req.body.email === docs[x].email) {
                        emailExists = true;
                    }
                    if (req.body.handle === docs[x].handle) {
                        handleExists = true;
                    }
                }
                if (emailExists) {
                    res.redirect("/SignUp?msg=Email%20Already%20In%20Use");
                } else if (handleExists) {
                    res.redirect("/SignUp?msg=Handle%20Already%20In%20Use");
                } else {
                    var activationCode = Math.floor(Math.random() * 10000);

                    bcrypt.genSalt(10, function (err, salt) {
                        var pw = "";
                        var handle = ""
                        if(req.body.screenSize === "Desktop"){
                            pw = req.body.password[0];
                            handle = req.body.handle[0];
                        }
                        else{
                            pw = req.body.password[1];
                            handle = req.body.handle[1];
                        }
                        bcrypt.hash(pw, 8, function (err, hash) {
                            let base64String = req.body.img1; // Not a real image
                            // Remove header
                            let base64Image = base64String.split(';base64,').pop();
                            var bufferStream = new stream.PassThrough();
                            bufferStream.end(Buffer.from(base64Image, 'base64'));
                            var file = degreemeImages.file(handle + '.jpg');
                            bufferStream.pipe(file.createWriteStream({
                                metadata: {
                                  contentType: 'image/jpeg',
                                  metadata: {
                                    custom: 'metadata'
                                  }
                                },
                                public: true,
                                validation: "md5"
                              }))
                              .on('error', function(err) {
                                  console.log(err)
                              })
                              .on('finish', function(data) {
                                console.log("File uploaded")
                                if(req.body.screenSize === "Desktop"){
                                    var fNameLetter = req.body.first_name[0].substring(0,1);
                                    fNameLetter = fNameLetter.toUpperCase();
                                    var first_name = fNameLetter + req.body.first_name[0].substring(1);
                                    var lNameLetter = req.body.last_name[0].substring(0,1);
                                    lNameLetter = lNameLetter.toUpperCase();
                                    var last_name = lNameLetter + req.body.last_name[0].substring(1);
                                    users.addUser("@" + req.body.handle[0], first_name, last_name, req.body.school[0], req.body.email[0], hash,
                                        "https://storage.googleapis.com/degreeme-images/" + req.body.handle[0] + ".jpg", "Inactive", activationCode,
                                        "None", req.body.major[0]);
                            // thiis is a real comment *************** using Twilio SendGrid's v3 Node.js Library
                            //  this is a real comment ***************** https://github.com/sendgrid/sendgrid-nodejs
                            var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
                            console.log("this is the valid email 1", req.body.email[0]);
                            mail.headers({
                            "content-type": "application/json",
                            "authorization": process.env.SENDGRID_API_KEY,
                            });

                            mail.type("json");
                            mail.send({
                            "personalizations": [
                                {
                                    "to":[
                                        {
                                            "email": req.body.email[0],
                                            "name": req.body.name
                                        }
                                    ],
                                    "dynamic_template_data": {
                                        "subject": "Account Confirmation",
                                        "name": req.body.first_name,
                                        "code": activationCode,
                                        "email": req.body.email[0],
                                
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
                                }
                                else if(req.body.screenSize === "Mobile") {
                                    var fNameLetter = req.body.first_name[1].substring(0,1);
                                    fNameLetter = fNameLetter.toUpperCase();
                                    var first_name = fNameLetter + req.body.first_name[1].substring(1);
                                    var lNameLetter = req.body.last_name[1].substring(0,1);
                                    lNameLetter = lNameLetter.toUpperCase();
                                    var last_name = lNameLetter + req.body.last_name[1].substring(1);
                                    users.addUser("@" + req.body.handle[1], first_name, last_name, req.body.school[1], req.body.email[1], hash,
                                        "https://storage.googleapis.com/degreeme-images/" + req.body.handle[1] + ".jpg", "Inactive", activationCode,
                                        "None", req.body.major[1]);
                                           // thiis is a real comment *************** using Twilio SendGrid's v3 Node.js Library
                            //  this is a real comment ***************** https://github.com/sendgrid/sendgrid-nodejs
                            var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
                            console.log("this is the valid email 2", req.body.email[1]);
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
                                            "email": req.body.email[1],
                                            "name": req.body.name
                                        }
                                    ],
                                    "dynamic_template_data": {
                                        "subject": "Account Confirmation",
                                        "name": req.body.first_name,
                                        "code": activationCode,
                                        "email": req.body.email[1],
                                
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
                           }
                        });
                        fs.writeFile("assets/img/userImg/" + req.body.handle + ".jpg", base64Image, { encoding: 'base64' }, function (err, data) {
                           
                            });
                           
                        });
                    });
                    res.redirect('/login?error=Account%20Successfully%20Created. Check your email to confirm your account.');
                }
            })
        }
    })
})
module.exports = router;