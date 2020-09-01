//packages used
require('dotenv').config();
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require("multer");
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
var session = require('express-session');
const {
    check,
    validationResult
} = require('express-validator');
const fs = require("fs");
const stripe = require('stripe')(process.env.STRIPE_KEY);

//DBs used
var userDB = require('../../models/Database/UserDB');
//instantiate DBs
var users = new userDB();
//use the session and bodyParser
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
    store: new DatastoreStore({
        kind: 'express-sessions',
     
        // Optional: expire the session after this many milliseconds.
        // note: datastore does not automatically delete all expired sessions
        // you may want to run separate cleanup requests to remove expired sessions
        // 0 means do not expire
        expirationMs: 0,
     
        dataset: new Datastore({
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
          // project ID here:
          projectId: process.env.GCLOUD_PROJECT,
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
          // explicitly pass in that path to your key file here:
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        })
      }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
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
//render the settings page
router.get('/Settings', function (req, res) {
    if (req.session.userId) {
        res.render('UserLoggedIn/Settings', {
            qs: req.query,
            session: req.session,
            qs: req.query,
        });
    } else {
        res.redirect('/login?error=User%20Not%20Currently%20Logged%20In');
    }
});
//This route allows user to create a seller account with Stripe. Use input fields to accept info required by Stripe API
//use bodyParser package to read input field. Access fields by the req.body.inputFieldName command. Save info directly to Stripe. 
//Don't save sensitive credit card data in local DBs
//Don't worry about the styling of the settings page. Focus solely on registering the user to Stripe.
//Feel free to create additional files as needed.
router.post('/MakeStripeAccount',
    check('dob').trim().escape(),
    check('phone').trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        //logic goes here
        var namearr = (req.session.name).split(" ");
        var dob = (req.body.dob).split('-');
        var phone = (req.body.phone).replace(/-/g, "");
        //phone=phone.replaceAll("-","")
        stripe.account.create({
                type: 'custom',
                requested_capabilities: ['card_payments', 'transfers', ],
                business_type: 'individual',
                business_profile: {
                    mcc: '8299',
                    product_description: 'DegreeMe Contractor'
                },
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.connection.remoteAddress, //Assuming no proxy is being used
                },
                individual: {
                    first_name: namearr[0],
                    last_name: namearr[1],
                    dob: {
                        day: dob[2],
                        month: dob[1],
                        year: dob[0],
                    },
                    address: {
                        line1: req.body.street_number,
                        line2: req.body.route,
                        postal_code: req.body.postal_code,
                        city: req.body.locality,
                        state: req.body.administrative_area_level_1,
                        country: req.body.country, //need to convert to ISO 3166-1 alpha-2 code (Hardcoded to stay 'US' for now on views page)
                    },
                    email: req.session.email,
                    phone: phone,
                    ssn_last_4: req.body.ssn,
                },
                settings: {
                    payouts: {
                        schedule: {
                            //delay_days: 0,
                            interval: "weekly",
                            weekly_anchor: "friday",
                        }
                    }
                }
            },
            function (err, account) {
                if (err != null) {
                    console.log(err);
                    res.redirect('/MyFinances?errmsg=' + encodeURIComponent(err));
                    // some error
                    // res.redirect('/oops');<-This page needs to be made
                } else {
                    //add the stripeId to user's account
                    users.addStripeId(req.session.userId, account.id).then(function (data) {
                        console.log("StripeId added to user account");
                        //change tutor property to true in UserDB
                        users.becomeTutor(req.session.handle);
                    }).catch(function (error) {
                        console.log(error);
                    });
                    console.log(account.id);
                    //save account id to database
                    //create Bank Account
                    console.log('creating bank account');
                    stripe.accounts.createExternalAccount(
                        account.id, {
                            external_account: { //for attatching bank accounts/credit cards
                                object: 'bank_account',
                                country: 'US',
                                currency: 'usd',
                                routing_number: req.body.routNum,
                                account_number: req.body.accNum,
                            },
                        },
                        function (err, bankAccount) {
                            if (err != null) {
                                console.log(err);
                                res.redirect('/MyFinances?errmsg=' + encodeURIComponent(err));
                                //some error
                            } else {
                                console.log(bankAccount);
                                //update the session
                                req.session.tutor = true;
                                console.log(req.session.tutor)
                                res.redirect('MyFinances?msg=Seller%20Account%20Created!%20Create%20a%20Tutor%20Listing%20to%20Start%20Earning');
                            }
                        }
                    );
                }
            }
        );
    });
router.post("/Settings",
    check('img1').isString().trim(),
    check('handle').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        upload(req, res, (err) => {
            if (err) {
                res.redirect('/Settings?error=' + err);
            }
            let base64String = req.body.img1; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();
            fs.writeFile("assets/img/userImg/" + req.body.handle.substring(1) + ".jpg", base64Image, {
                encoding: 'base64'
            }, function (err, data) {
                if (!err) {
                    req.session.img = data;
                } else {
                    console.log(err)
                    res.redirect("/Home")
                }
            });
            res.redirect("/Home")
        });
    });
module.exports = router;