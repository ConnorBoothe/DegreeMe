require('dotenv').config();
const mongoose = require("mongoose");
const unirest = require('unirest');
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
const UserDB = require("./UserDB");
const users = new UserDB();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var messagesSchema = new Schema({
  threadId:{type:String, required:true},
  sender:{type:String, required:true},
  senderImg: {type:String, required:true},
  content:{type:String, required:true},
  dateTime:{type:Date, required:true},
  type: {type:String, required:true}
}, {collection: 'Messages'});

var MessagesDB = mongoose.model('Messages', messagesSchema);

module.exports = class Messages {
    //add a new message
    addMessage(threadId,sender, senderImg, msg,  dateTime){
      var message = new MessagesDB({threadId: threadId, sender:sender, senderImg:senderImg, message:msg, dateTime:dateTime, type:type});
      return message.save()
      .then(function(){
        //handle logic to move thread and then send an email
      })
      // msgDB.find({_id:id}).exec((err, docs)=>{
      //   if(docs[0]){
      //     docs[0].messages.push({sender:sender, senderImg:senderImg, message:msg, dateTime:dateTime });
      //     docs[0].save().then(function(data){
      //       new Promise((resolve, reject) => {
      //         for(var x = 0; x < docs[0].userHandles.length; x++){
      //           users.moveThread(id,docs[0].userHandles[x], sender)
      //           .then(function(){
      //             console.log("Thread moved")
      //           })
      //         }
      //         if(x === docs[0].userHandles.length){
      //           resolve(true);
      //         }
      //     })
      //     .then(function(){
      //       //create an array of all handles to send email to
      //       var handles = [];
      //       for(var x = 0; x < docs[0].userHandles.length; x++){
      //         //Do not add sender to the array
      //         if(docs[0].userHandles[x][0] != sender){
      //           handles.push(docs[0].userHandles[x][0])
      //         }
      //       }
      //       users.getEmailsFromHandleArray(handles)
      //       .then(function(data){
      //         //create email array
      //         var emails = [];
      //         for(var x = 0; x < data.length; x++){
      //           //push using format required by unirest
      //           emails.push({"email" :data[x].email})
      //         }
      //         //send the email
      //         mail.headers({
      //           "content-type": "application/json",
      //           "authorization": process.env.SENDGRID_API_KEY,
      //         });
      //         mail.type("json");
      //         mail.send({
      //         "personalizations": [
      //             {
      //                 "to": emails,
      //                 "dynamic_template_data": {
      //                     "subject": "You have a new message!",
      //                     "sender": sender, 
      //                     "messageId": id
                          
                      
      //             },
      //                 "subject": "You have a new message!"
      //             }
      //         ],
      //             "from": {
      //                 "email": "notifications@degreeme.io",
      //                 "name": "DegreeMe"
      //         },
      //             "reply_to": {
      //                 "email": "noreply@degreeme.io",
      //                 "name": "No Reply"
      //         },
      //             "template_id": "d-33e5fd187dba40e297f7c5dc45461ee3"
      //         });
      //         mail.end();
      //       })
      //     })
      //     });
      //   }
      //   else{
      //    console.log("Messsage not added")
      //   }
      // })
      
    }
    //returns a conversation given convo id
    getConversation(convoID){
      return msgDB.findOne({_id:convoID});
    }
    //get names that user has conversations with
    getConversationNames(userID){
       return msgDB.find([{$or:[{sender_ID : userID},{receiver_ID : userID}]}]);
    }
    //return all messages in a thread. Limit to 25 messages at a time
    //implement a block parameter like you did with timeline
    getAllMsg(threadId){
      return MessagesDB.find({threadId:threadId});
    }
    //easier to just send another message with the content being a url to the image
    attachImage(id, image){
      return new Promise((resolve, reject)=>{
        msgDB.findOne({_id:id})
        .then(function(thread){
          if(thread.messages.attachments == undefined){
            thread.messages[thread.messages.length-1].attachments = [{file: image}]
          }
          else {
            thread.messages[thread.messages.length-1].attachments.push({file: image});
          }
          thread.save();
            resolve(true)
        })
        .catch(function(error){
          console.log(error)
          reject(false);
        })
      })
      
    }
}