//packages used
require('dotenv').config();
const express = require('express');

const router = express.Router();

//DBs used
const Threads = require('../../../models/Database/Threads');
var threads = new Threads();
router.get("/messageMembers/:threadId", function(req, res) {
    if (req.params.threadId) {
        threads.getUserHandles(req.params.threadId)
        .then(function(thread){
            res.json({members: thread.userHandles});
        })
        .catch(function(error) {
            console.log(error)
        })
    }
    else {
        res.json({userHandles: "Invalid"});
    }

});
module.exports = router;