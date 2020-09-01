require('dotenv').config();
var express = require("express");
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const MeetupsDB = require('../../models/Database/MeetupsDB.js');
//Instantaiate DB
var meetups = new MeetupsDB();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
}));
//add zoom link via meeting page
router.post("/meeting/addZoom/",
    check('meetingId').isString().trim().escape(),
    check('zoomLink').isString().trim(),
    function (req, res) {
        //stores validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/');
        }
        meetups.addZoomLink(req.body.meetingId, req.body.zoomLink).exec((err, docs) => {
            res.redirect("/meeting/" + req.body.meetingId);
        })
    })
router.post("/addLocation",
    check('meetingId').isString().trim().escape(),
    check('building').isString().trim().escape(),
    check('room').isString().trim().escape(),
    function (req, res) {
        //stores validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //redirect to index if error
            res.redirect('/');
        }
        console.log("ADDING LOCATION")
            meetups.addLocation(req.body.meetingId, req.body.building, req.body.room);
            res.status(202).json({
                status: "Location Added"
            })

    })
module.exports = router;