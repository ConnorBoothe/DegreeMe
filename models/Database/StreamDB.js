require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
//chat schema
var chatSchema = new Schema({
    sender:{type:String, required:true},
    senderImg:{type:String},
    message: {type:String, required:true},
    time: {type:Number, required:true},
});

//stream schema
var streamSchema = new Schema({
    host:{type:String, required:true},
    hostId: {type:String, required:true},
    hostImage: {type:String, required:true},
    title: {type:String},
    groupId: {type:String},
    chat: [chatSchema],
    members: [{type:String, required:true}]
}, {collection: 'StreamDB'});

//instantaiate streamDB model
var streamDB = mongoose.model('StreamDB',streamSchema);

module.exports = class Stream {
    //get user schedule
    addStream(host, hostId, hostImg, title, groupId){
        var stream = new streamDB({host: host, hostId: hostId,
            hostImage:hostImg, title:title, groupId: groupId, members: [host]});
        return stream.save();
    }
    addChat(id, sender, msg, img){
        console.log("ID: "+ id)
        return new Promise((resolve, reject) => {
            streamDB.findOne({_id: id})
            .then(function(stream){
                console.log("APPENDG CHAT: ", sender, msg, img)
                var chat = {sender:sender, message: msg, senderImg: img, time: new Date()};
                stream.chat.push(chat);
                stream.save();
                resolve(chat)
            })
            .catch((err)=>{
                reject(err)
                console.log(err)
            })
        })
    }
    getStreamByHostId(hostId){
        return streamDB.findOne({hostId: hostId});
    }
    getStreamHost(id){
        return streamDB.findOne({_id: id});
    }
    //get host of the stream
    getHostByStreamId(id){
        return streamDB.findOne({_id: id}, "host");
    }
     //get stream
     getStreamById(id){
        return streamDB.findOne({_id: id});
    }
    //return the host and the chat
    getChatByStream(id){
        return streamDB.findOne({_id: id}, "host chat");
    }
    //return the host and the chat
    addMember(id, userId){
        return new Promise(function(resolve, reject){
            streamDB.findOne({_id: id})
            .then(function(data){
                data.members.push(userId);
                data.save();
                resolve(data);
            })
    })
    }z
    //remove member from the stream
    removeMember(id, userId){
        return new Promise(function(req, res){
            streamDB.findOne({_id: id})
            .then(function(data){
                for(var i = 0; i < data.members.length; i++) {
                    if(data.members[i] == userId) {
                        console.log("REMOVE THIS MEMBER")
                        data.members.pull(members[i]);
                        data.save();
                    }
                    
                }
                
            })
    })
    }
    //leave the stream when the user disconnects
    leaveStream(roomId, userId){
        return new Promise(function(resolve, reject){
            streamDB.findOne({_id: roomId})
            .then(function(stream){
                var target  = "";
                for(var i = 0; i < stream.members.length; i++){
                    if(stream.members[i].userId == userId){
                        target = stream.members[i];
                    }
                }
                if(target != "") {
                    console.log("REMOVED")
                    stream.members.pull(target);
                    stream.save();
                }
                resolve(stream);
               
            })
        })
        
    }
    clearAllMembers(id){
        return streamDB.findOne({_id: id})
        .then(function(stream){
            stream.members = [];
            stream.save()
        })

    }

}