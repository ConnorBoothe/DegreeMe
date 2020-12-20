//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
//DBs used
const Messages = require('../../../models/Database/Messages');
var messages = new Messages();
router.get("/threadImages/:threadId", function(req, res) {
    if (req.params.threadId) {
        messages.getThreadImagesPreview(req.params.threadId)
        .then(function(images){
            res.json({images: images});
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