
var mongoose = require("mongoose");
var UserDB = require('./UserDB');
var users = new UserDB();
mongoose.Promise = global.Promise;
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

var messagesSchema = new Schema({
  sender:{type:String, required:true},
  senderImg: {type:String, required:true},
  message:{type:String, required:true},
  dateTime:{type:String, required:true}
  
});
var thread = new Schema({
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    userHandles:{type:Array, required:true},
    subject:{type:String},
    datetime:{type:String, required:true},
    messages:[messagesSchema]
    
}, {collection: 'MessagesDB'});
var msgDB = mongoose.model('MessagesDB',thread);

module.exports = class Messages {

    constructor() {
      
    }
    getAllThreads(){
      var msgDB = mongoose.model('MessagesDB',thread);
      return msgDB.find();
    }
    addMessage(id,sender, senderImg, msg,  dateTime){
      var msgDB = mongoose.model('MessagesDB',thread);
      msgDB.find({_id:id}).exec((err, docs)=>{
        console.log(docs)
        if(docs[0]){
          console.log("From function :" +senderImg)
          docs[0].messages.push({sender:sender, senderImg:senderImg, message:msg, dateTime:dateTime });
          return docs[0].save();
          // for(x in docs[0].userHandles){
          //   // if(docs[0].userHandles[x] != sender){
          //   //   users.updateUnreadCount(docs[0].userHandles[x].substr(1), id);

          //   // }
          // }
          
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
    newThread(host, hostImg, subject, userHandles, datetime){
      var message = new msgDB({host: host, hostImg:hostImg, userHandles: userHandles, subject:subject, datetime:datetime });
      return message.save();
     
      //need this
        // for(x in userHandles){
        //   users.addThread(message.host, message.hostImg, message.subject, message._id, userHandles[x][0]);
        // }
     
    
    }
}