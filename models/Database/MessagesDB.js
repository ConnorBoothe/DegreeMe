require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

var messagesSchema = new Schema({
  sender:{type:String, required:true},
  senderImg: {type:String, required:true},
  message:{type:String, required:true},
  dateTime:{type:Date, required:true}
  
});
var thread = new Schema({
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    userHandles:{type:Array, required:true},
    datetime:{type:Date, required:true},
    messages:[messagesSchema],
    subject:{type:String}
    
}, {collection: 'MessagesDB'});
var msgDB = mongoose.model('MessagesDB',thread);

module.exports = class Messages {
    getAllThreads(){
      var msgDB = mongoose.model('MessagesDB',thread);
      return msgDB.find();
    }
    addMessage(id,sender, senderImg, msg,  dateTime){
      var msgDB = mongoose.model('MessagesDB',thread);
      msgDB.find({_id:id}).exec((err, docs)=>{
        if(docs[0]){
          console.log("From function :" +senderImg)
          docs[0].messages.push({sender:sender, senderImg:senderImg, message:msg, dateTime:dateTime });
          docs[0].save().then(function(data){
          });
          for(var x = 0; x < docs[0].userHandles.length; x++){
            if(docs[0].userHandles[x] != sender){
              // users.updateUnreadCount(docs[0].userHandles[x].substr(1), id);

            }
          }
        }
        else{
         console.log("Messsage not added")
        }
      })
      
    }
    //returns a conversation given convo id
    getConversation(convoID){
      return msgDB.findOne({_id:convoID});
    }
    //get names that user has conversations with
    getConversationNames(userID){
       return msgDB.find([{$or:[{sender_ID : userID},{receiver_ID : userID}]}]);
    }
    getAllMsg(id){
      return msgDB.find({_id:id});
    }
    newThread(host, hostImg, userHandles, datetime, subject){
      var message = new msgDB({host: host, hostImg:hostImg, userHandles: userHandles, subject:subject, datetime:datetime });
      return message.save();
  
    }
    addUserToThread(id, user){
      return msgDB.findOne({_id: id})
      .exec((err, docs)=>{
  
        docs.userHandles.push(user);
        docs.save();
      })
      ;
    }

    leaveThread(id, userHandle){
      console.log("ID", id)
      msgDB.findOne({_id: id})
      .exec((err, docs)=>{
        for(x in docs.userHandles){
          if(docs.userHandles[x][0] === userHandle){
            docs.userHandles.splice(x,1);
            docs.save();
            break;
          }
        }
      })
      ;
    }
}