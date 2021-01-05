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
router.post("/updateClass", function(req, res){
    console.log("Update class")
    users.updateClass(req.session.userId, req.body.class)
    .then((classification)=>{
        res.status(202).json({
            class: classification
        }).end();
    })
})
module.exports = router;
