//packages used
const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const io = require('socket.io').listen(4000);
//classes used
const MessageDB = require('../../models/Database/MessagesDB');
const userDB = require('../../models/Database/UserDB');
//instantiate DBs for use
var messages = new MessageDB();
var users = new userDB();
//use the session and bodyParser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true,
}));
//create a websocket connection
io.sockets.on('connection', function (socket) {
        //catch the emitted 'send message' event
        socket.on('send message', function (data) {
            //add message to the db
            messages.addMessage(data.id, data.sender, data.senderImg, data.message, data.date);
            messages.getConversation(data.id).exec((err, docs) => {
                for (x in docs.userHandles) {
                  //move thread to top of the list
                    users.moveThread(data.id, docs.userHandles[x][0], data.sender);
                    //mark as unread for the receiver
                    if(docs.userHandles[x][0] !== data.sender){
                        users.unseeMessage(docs.userHandles[x][0], docs._id)
                    }
                }
            })
            io.sockets.emit('new message', {
                msg: data
            });
        });
});



module.exports = router;