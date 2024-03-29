require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
var Schema = mongoose.Schema;
var memberSchema = new Schema({
    userId:{type:String, required:true},
    handle: {type:String, required:true},
    image: {type:String, required:true},
    role:{type:String, required:true}
});
var eventsSchema = new Schema({
    userId:{type:String, required:true},
    date: {type:Date, required:true},
    duration:{type: Number, required:true},
    title: {type:String, required:true},
    description: {type:String, required:true},
    type: {type:String, required:true},
    streamId: {type:String},
    location: {type:String},
    members:[memberSchema]
}, {collection: 'Events'});
var events = mongoose.model('eventsSchema',eventsSchema);
module.exports = class Events {
    //get all events by id
   getEventsByUserId(id){
       return  events.find({userId: id})
   }
   //get events for a given day
   //getEventsByDay()
   //get the events for a given week
//    getEventsByWeek()
   
   //add event to DB
   //pass in an array of member objects in format of :[{userId: userId, handle: handle, image:image, role:role}]
   //role should be either host or member
   //the person who creates the event is the host
   addEvent(userId, date, hours,minutes, title, description, type, streamId,location, members){
      

       var tempDuration = hours+"."+minutes;
      
       var durationInNumbers = parseFloat(tempDuration);

       var event = new events({
           userId: userId, 
           date: date,
           duration: durationInNumbers, 
           title: title,
           description: description, 
           type: type, 
           steamId: streamId,
           location: location,
           members: members
        });
        return event.save();
   }
   deleteEvent(id){
       return events.deleteOne({_id:id});
   }
   updateEvent(id, date,hours, minutes, title, description, type, streamId,location){
       
    var tempDuration = hours+"."+minutes;

    var durationInNumbers = parseFloat(tempDuration);

     return events.updateOne({_id:id},{
        date: date,
        duration: durationInNumbers, 
        title: title,
        description: description, 
        type: type, 
        steamId: streamId,
        location: location
     })
}
   //add a new member to an event document
   addMemberToEvent(id, userId, handle, image, role){
    return new Promise((resolve, reject)=>{
    events.findOne({_id:id}).then(function(event){
        event.members.push({userId: userId, handle: handle, image:image, role:role});
        event.save();
        resolve(event);
        })
        .catch(function(error){
            reject(error);
        })
       })
    }
    //remove member from an event
   removeMemberFromEvent(id, userId){
    return new Promise((resolve, reject)=>{
        events.findOne({_id:id}).then(function(event){
            for(var i=0; i < event.members.length; i++){
                if(event.members[i].userId == userId){
                    events.members.pull(i);
                    resolve(events.members[i])
                    break;
                }
            }
        })
    })
   }
}