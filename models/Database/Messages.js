require('dotenv').config();
const mongoose = require("mongoose");
const unirest = require('unirest');
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
const UserDB = require("./UserDB");
const Threads = require("./Threads");
const users = new UserDB();
const threads = new Threads();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var youtubeData = new Schema({
  title: {type:String, required:true},
  link: {type:String, required:true},
  thumbnail: {type:String, required:true}
})
var messagesSchema = new Schema({
  threadId:{type:String, required:true},
  sender:{type:String, required:true},
  senderImg: {type:String, required:true},
  content:{type:String, required:true},
  dateTime:{type:Date, required:true},
  type: {type:String, required:true},
  youtubeData: [youtubeData]
}, {collection: 'Messages'});

var MessagesDB = mongoose.model('Messages', messagesSchema);

module.exports = class Messages {
    //add a new message
    addMessage(threadId,sender, senderImg, content,  dateTime, type){
      return new Promise((resolve, reject)=>{
        //create the message and save it the DB
        var message = new MessagesDB({threadId: threadId, sender:sender, senderImg:senderImg, content:content, dateTime:dateTime, type:type});
        message.save()
        .then(()=>{
          //get the user handles that belong to the thread
          threads.getUserHandles({_id: threadId})
          .then((thread)=>{
            for (var i=0; i < thread.userHandles.length; i++) {
              //move the thread to the top spot in the list
              //for each handle in the thread
              users.moveThread(threadId, thread.userHandles[i][0], sender);
            }
            resolve(message)
          })
        })
        .catch((error)=>{
          reject(error);
        })
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
    //return all messages in a thread. Limit to 50 messages at a time
    //implement a block parameter like you did with timeline
    getAllMsg(threadId, block){
      return MessagesDB.find({threadId:threadId}).skip(block*50).limit(50).sort({"_id": -1});
    }
    //get the last 2 images belonging to the thread to display preview
    getThreadImagesPreview(threadId){
      return MessagesDB.find({threadId: threadId}, "content")
      .where({type: "file"}).sort({_id:-1}).limit(2);
    }
    addYoutubeData(data){
      return new Promise((resolve, reject)=>{
        MessagesDB.findOne({_id: data.id}).then((message)=>{
          //push youtube data to message doc
          message.youtubeData.push({title: data.title, 
            link: data.link, thumbnail: data.thumbnail});
          message.save()
          .then(()=>{
            resolve(message)
          })
        })
        .catch((err)=>{
          console.log(err)
          reject(err)
        });
    });
  }
}