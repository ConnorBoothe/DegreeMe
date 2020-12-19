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
var attachments = new Schema({
  file:{type:String, required: true}
});
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
    // addMessage(id,sender, senderImg, msg,  dateTime){
    //   msgDB.find({_id:id}).exec((err, docs)=>{
    //     if(docs[0]){
    //       docs[0].messages.push({sender:sender, senderImg:senderImg, message:msg, dateTime:dateTime });
    //       docs[0].save().then(function(data){
    //         new Promise((resolve, reject) => {
    //           for(var x = 0; x < docs[0].userHandles.length; x++){
    //             users.moveThread(id,docs[0].userHandles[x], sender)
    //             .then(function(){
    //               console.log("Thread moved")
    //             })
    //           }
    //           if(x === docs[0].userHandles.length){
    //             resolve(true);
    //           }
    //       })
    //       .then(function(){
    //         //create an array of all handles to send email to
    //         var handles = [];
    //         for(var x = 0; x < docs[0].userHandles.length; x++){
    //           //Do not add sender to the array
    //           if(docs[0].userHandles[x][0] != sender){
    //             handles.push(docs[0].userHandles[x][0])
    //           }
    //         }
    //         users.getEmailsFromHandleArray(handles)
    //         .then(function(data){
    //           //create email array
    //           var emails = [];
    //           for(var x = 0; x < data.length; x++){
    //             //push using format required by unirest
    //             emails.push({"email" :data[x].email})
    //           }
    //           //send the email
    //           mail.headers({
    //             "content-type": "application/json",
    //             "authorization": process.env.SENDGRID_API_KEY,
    //           });
    //           mail.type("json");
    //           mail.send({
    //           "personalizations": [
    //               {
    //                   "to": emails,
    //                   "dynamic_template_data": {
    //                       "subject": "You have a new message!",
    //                       "sender": sender, 
    //                       "messageId": id
                          
                      
    //               },
    //                   "subject": "You have a new message!"
    //               }
    //           ],
    //               "from": {
    //                   "email": "notifications@degreeme.io",
    //                   "name": "DegreeMe"
    //           },
    //               "reply_to": {
    //                   "email": "noreply@degreeme.io",
    //                   "name": "No Reply"
    //           },
    //               "template_id": "d-33e5fd187dba40e297f7c5dc45461ee3"
    //           });
    //           mail.end();
    //         })
    //       })
    //       });
    //     }
    //     else{
    //      console.log("Messsage not added")
    //     }
    //   })
      
    // }
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
      console.log("ID", id)
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
    // attachImage(id, image){
    //   return new Promise((resolve, reject)=>{
    //     threads.findOne({_id:id})
    //     .then(function(thread){
    //       if(thread.messages.attachments == undefined){
    //         thread.messages[thread.messages.length-1].attachments = [{file: image}]
    //       }
    //       else {
    //         thread.messages[thread.messages.length-1].attachments.push({file: image});
    //       }
    //       thread.save();
    //         resolve(true)
    //     })
    //     .catch(function(error){
    //       console.log(error)
    //       reject(false);
    //     })
    //   })
      
    // }
}