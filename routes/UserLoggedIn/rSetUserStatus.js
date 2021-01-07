//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));
//DBs used
var UserDB = require("../../models/Database/UserDB.js");
//instantiate DBs
var users = new UserDB();
//render the create connection page
router.post('/setActiveTimestamp', function (req, res) {
    console.log(req.body)
    users.setUserStatus(req.session.userId, req.body.ActiveTimestamp)
    .then((result)=>{
        console.log(result)
        console.log("Set user active timestamp")
        res.status(202).json({
            status: "Complete",
        }).end();

    })
    .catch((err)=>{
        console.log(err)
    })
});


module.exports = router;