require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
//use body parser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
    resave: false,
    saveUninitialized: true
}));
const {
    check,
    validationResult
} = require('express-validator');
const EmailFunction = require('../../models/classes/EmailFunction');
const emailFunction = new EmailFunction();
router.post("/sendPlatformInvite",
    check('emails').isArray().trim().escape(),
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors)
      }
    //   console.log("Group Name", req.body.groupName)
      var splitEmails = req.body.emails.split(",");
      var toEmails = [];
      for(x in splitEmails){
        if(splitEmails[x] != ""){
          toEmails.push({"email": splitEmails[x]});
        }
      }
      emailFunction.createEmail(toEmails, "invite", req)
      .then(()=>{
          console.log("email sent")
          res.status(202).json({
        }).end();
      })
      
    })
    module.exports = router;
