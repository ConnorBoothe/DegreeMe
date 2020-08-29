

const mongoose = require('mongoose');
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
var Schema = mongoose.Schema;
var notificationSchema = new Schema({
    name: {type:String, required:true},
    type: {type:String, required:true}
})
var notificationListSchema  = new Schema({
    userId: {type:String, required:true},
    notifications:[notificationSchema]
}, {collection: 'NotificationDB'});
var notificationDB = mongoose.model('NotificationDB',notificationListSchema);

module.exports = class NotificationList {

    constructor() {
        this.notificationList = [];
    }
    //return last five notifications
    getLast5(userId){
        return notificationDB.findOne({userId:userId}).limit(5);
    }
    getAll(userId){
        return notificationDB.findOne({userId:userId}).limit(20);
    }
    //add a new notification
    addNotification(userId ,name,type,callback){
      notificationDB.findOne({userId:userId}).exec((err,docs)=>{
        if(docs){
            docs.notifications.push({name:name,type:type});
            docs.save();
            callback(true);
        }  
        else{
            var notif = new notificationDB({userId:userId, notifications:{name:name,type:type}});
            notif.save();
            callback(false);
        }
      });
    }
    }