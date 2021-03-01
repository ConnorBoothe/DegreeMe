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
const NotificationsDB = require('../../models/Database/NotificationDB');
const GroupsDB = require('../../models/Database/StudyGroupsDB');

const emailFunction = new EmailFunction();
const notifications = new NotificationsDB();
const groups = new GroupsDB();
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
    router.post("/sendHandleInvite",
    function (req, res) {
    
      console.log("req handle invite: "+ req.body.handles)
      new Promise((resolve, reject)=>{
        for(var i = 0; i < req.body.handles.length; i++) {
          notifications.addNotification(req.body.handles[i],
          req.session.name, " invited you to join "+ req.body.group,
          req.session.img, "/Group/"+ req.body.groupId);
      }
      resolve();
      })
      .then(()=>{
        res.status(202).json({
        }).end();
      })
      .catch((err)=>{
        console.log(err)
      })
    })
    module.exports = router;
