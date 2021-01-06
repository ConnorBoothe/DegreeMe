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
const UserDB = require('../../models/Database/UserDB');
const users = new UserDB();
router.post("/updateImage", function(req, res){
    console.log("Update class")
    users.updateProfileImage(req.session.userId, req.body.imgLink)
    .then((imgLink)=>{
        res.status(202).json({
            img: imgLink
        }).end();
    })
})
module.exports = router;
