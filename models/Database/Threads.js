require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
var Schema = mongoose.Schema;
//define the thread schema
var thread = new Schema({
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    userHandles:{type:Array, required:true},
    datetime:{type:Date, required:true},
    subject:{type:String}
    
}, {collection: 'Threads'});
var threads = mongoose.model('Threads',thread);
module.exports = class Messages {
    getAllThreads(){
      return threads.find();
    }
    //returns a conversation given convo id
    getConversation(convoID){
      return threads.findOne({_id:convoID});
    }
    //get handles that belong to a thread
    getUserHandles(id){
      return threads.findOne({_id: id}, "userHandles subject")
    }
    //get names that user has conversations with
    getConversationNames(userID){
       return threads.find([{$or:[{sender_ID : userID},{receiver_ID : userID}]}]);
    }
    getAllMsg(id){
      return threads.find({_id:id});
    }
    newThread(host, hostImg, userHandles, datetime, subject){
      var thread = new threads({host: host, hostImg:hostImg, userHandles: userHandles, subject:subject, datetime:datetime });
      return thread.save();
  
    }
    addUserToThread(id, user){
      return threads.findOne({_id: id})
      .exec((err, docs)=>{
        docs.userHandles.push(user);
        docs.save();
      })
      ;
    }
    leaveThread(id, userHandle){
      threads.findOne({_id: id})
      .exec((err, docs)=>{
        for(x in docs.userHandles){
          if(docs.userHandles[x][0] === userHandle){
            docs.userHandles.splice(x,1);
            docs.save();
            break;
          }
        }
      });
    }
}