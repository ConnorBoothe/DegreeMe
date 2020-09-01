require('dotenv').config();
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const stripe = require('stripe')(process.env.STRIPE_KEY);

//DBs used
const userDB = require('../../models/Database/UserDB');

//classes used
const dateFunctions = require('../../models/classes/DateFunctions');
var df = new dateFunctions();
var {
  check,
  validationResult
} = require('express-validator');
//use the session and bodyParser
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true,
      maxAge:  6*60*60*1000 },
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
var users = new userDB();

//render the create connection page
router.get('/MyFinances', function (req, res) {
  if (req.session.userId) {
    // if(typeof req.query.errmsg!="undefined"){
    //   errmsg=req.query.errmsg;
    // }else{

    // }
    users.getUserByEmail(req.session.email).exec((err, user) => {
      //console.log(user[0]);
      if (user[0].StripeId != "none") {
        stripe.balance.retrieve({}, {
          stripeAccount: user[0].StripeId
        }).then(function (balance) {
          new Promise((resolve, reject) => {
            stripe.balanceTransactions.list({
              //stripe_account: user[0].stripeId,
              //customer: user[0].stripeId,
              //type:"charge",
              //limit:99,
            }, {
              stripeAccount: user[0].StripeId
            }, function (err, charges) {
              if (err != null) {
                console.log(err);
                reject(err);
              } else {
                resolve(charges);
              }
            })
          }).then(function (charges) {
            console.log(charges.data);
            //change to get userbyId
            users.getUserByHandle(req.session.handle).exec((err, docs) => {
              res.render('UserLoggedIn/myFinances2', {
                balance: balance,
                history: charges.data,
                qs: req.query,
                session: req.session,
                qs: req.query,
                StripeId: docs.StripeId,
                formatDate: df.displayDate
              });
            });
          });
        });
      } else {
        users.getUserByHandle(req.session.handle).exec((err, docs) => {
          res.render('UserLoggedIn/MyFinances', {
            qs: req.query,
            session: req.session,
            qs: req.query,
            StripeId: docs.StripeId,
            error: req.query.errmsg,
            formatDate: df.displayDate
          });
        });
      }
    })
  } else {
    res.redirect('/login?error=Session%20Ended');
  }
});

module.exports = router;