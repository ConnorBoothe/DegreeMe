require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

var meetupSchema = new Schema({
    role: {type:String, required:true},
    userHandle:{type:String, required:true},
    host:{type:String, required:true},
    course:{type:String},
    courseCode:{type:String},
    date:{type:Date, required:true},
    duration:{type:Number, required:true},
    LeftReview: {type:Boolean, required:true},
    Description:{type:String},
    Email:{type:String},
    Balance:{type:String},
    Source:{type:String},
    Currency:{type:String},
    CustomerID:{type:String},
}, {collection: 'Meetups'});
var MeetupsModel= mongoose.model('ConnectionsDB', meetupSchema);

module.exports = class Meetups {
    getMeetupsByHandle(handle){
        return MeetupsModel.find({userHandle: handle});
    }     
    getMeetupById(id){
       return MeetupsModel.findOne({_id:id});
    }
    //add a new meetup
    addMeetup(role, userHandle, host, date, duration, LeftReview){
        var meetup = new MeetupsModel({role:role ,userHandle:userHandle,
            host: host, date:date, duration:duration, LeftReview: LeftReview });
        return meetup.save();
    }
    //set left review to true
    updateLeftReview(id){
        MeetupsModel.findOne({_id:id}).updateOne({$set:{LeftReview:true}}).exec((err,docs)=>{
    });
    }
   


 
   
    

}