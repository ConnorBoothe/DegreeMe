//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
//DBs used
const Messages = require('../../models/Database/Messages');
var messages = new Messages();
router.post("/getMessageSet", function(req, res) {
        messages.getAllMsg(req.body.threadId, req.body.block)
        .then(function(messages){
            console.log(messages.length)
            res.status(202).json({
                messages: messages
            }).end();
        })
        .catch(function(error) {
            console.log(error)
        })
    });
module.exports = router;