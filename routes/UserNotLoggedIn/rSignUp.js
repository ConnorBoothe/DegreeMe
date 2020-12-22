//packages used
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");
const { check, validationResult } = require("express-validator");

//Dbs used
const UserDB = require("../../models/Database/UserDB");
const EmailFunction = require("../../models/classes/EmailFunction");

//instantiate DB
const users = new UserDB();
const emailFunction = new EmailFunction();

//use session and body parser
router.use(
  session({
    secret: "iloveu",
    resave: true,
    saveUninitialized: true,
  })
);
router.use(
  bodyParser.json({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);
router.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: "50mb",
    extended: true,
  })
);

//render the signup page
router.get("/SignUp", function (req, res) {
  res.render("UserNotLoggedIn/signUp", {
    session: req.session,
    schools: ["University of North Carolina at Charlotte"],
    qs: req.query,
  });
});
//POST route that handles user sign up
router.post(
  "/SignUp",
  [
    check("first_name").isString().trim().escape(),
    check("last_name").isString().trim().escape(),
    check("handle").isString().trim().escape(),
    check("school").isString().trim().escape(),
    check("email").isEmail().normalizeEmail().trim().escape(),
    check("password").isString().trim().escape(),
    check("password").isLength({
      min: 6,
    }),
    check("retypePW").isString().trim().escape(),
    check("retypePW").isLength({
      min: 6,
    }),
  ],
  function (req, res) {
    //array of default profile image urls
    const defaultImages = [
      "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_4.png?alt=media&token=94de9ef2-573a-4b1f-a5c3-edf56c1855cc",
      "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_2.png?alt=media&token=dc792ec6-9909-4ef8-ba6f-56b87818cdee",
      "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo_1.png?alt=media&token=2fa89c02-1341-414a-84a1-943ee00fde6b",
      "https://firebasestorage.googleapis.com/v0/b/degreeme-bd5c7.appspot.com/o/default-profile-images%2Fcircle_degreeMe_logo.png?alt=media&token=c56774ca-891b-47b9-9616-a3011347e78b",
    ];
    //query UserDB based on email input
    users.getUserByEmail(req.body.email).then((docs) => {
      //check if user with entered email already exists
      if (docs.length > 0) {
        //user exists, redirect with error message
        res.redirect("/SignUp?msg=Email%20Already%20In%20Use");
      }
      //check if handle already exists
      users.getUserByHandle(req.body.handle).then(function (docs) {
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
            //capitalize first letter of first name
            var fNameLetter = req.body.first_name[0]
              .substring(0, 1)
              .toUpperCase();
            var first_name = fNameLetter + req.body.first_name.substring(1);
            //capitalize first letter of last name
            var lNameLetter = req.body.last_name[0]
              .substring(0, 1)
              .toUpperCase();
            var last_name = lNameLetter + req.body.last_name.substring(1);
            console.log("Adding user")
            users
              .addUser(
                "@" + req.body.handle,
                first_name,
                last_name,
                "University of North Carolina at Charlotte",
                req.body.email,
                hash,
                randomImg,
                "Inactive",
                activationCode,
                "None",
                req.body.major,
                req.body.classification
              )
              .then(() => {
                //send account verification email
                console.log("Sending email")
                var emailDetails = {
                  first_name: req.body.first_name
                }
                emailFunction.createEmail(req.body.email, "VerifyAccount",
                  [activationCode, emailDetails], first_name)
                  .then(() => {
                    console.log("Email sent")
                    res.redirect("/login?message=Account%20Successfully%20Created");
                  })
                  .catch(function (err) {
                    console.log(err)
                    res.redirect("/?error=" + err);
                  })
              })
          })
        }
      })
    })
  })
module.exports = router;
