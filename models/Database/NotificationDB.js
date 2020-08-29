require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL|| 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
var Schema = mongoose.Schema;
var notificationSchema  = new Schema({
    userHandle: {type:String, required:true},
    name: {type:String, required:true},
    type: {type:String, required:true},
    img: {type:String, required:true},
    url:{type:String, required:true},
    seen:{type:Boolean, required:true},
    date:{type:Date, required:true}

}, {collection: 'NotificationDB'});
var notificationDB = mongoose.model('NotificationDB',notificationSchema);
module.exports = class NotificationList {
    //return last five notifications
    getLast5(userHandle){
        return notificationDB.find({userHandle:userHandle}).limit(5);
    }
    getAll(userHandle){
        return notificationDB.find({userHandle:userHandle}, 'name url img type date seen').sort({'_id': -1}).limit(10);
    }
    //add a new notification
    //userhandle == the user who is receiving the notification
    addNotification(userHandle ,name,type, img, url){
            var notif = new notificationDB({userHandle:userHandle, name:name,type:type, img:img, url:url, seen:false, date:new Date()});
            notif.save().then(function(data){
      })
    }
    //update seen field to true
    seenNotification(id){
        return notificationDB.findOne({
            _id: id
          }).updateOne({
            $set: {
              seen: true
            }
          });
    }
    }