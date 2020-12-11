require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
//bid schema
var scheduleSchema = new Schema({
    userId:{type:String, required:true},
    day: {type:String, required:true},
    time: {type:Number, required:true},
}, {collection: 'TutorSchedules'});
var schedule = mongoose.model('TutorSchedules',scheduleSchema);
module.exports = class TutorSchedules {
    //get user schedule
   getUserScheduleByDay(userId, day){
    return schedule.find({
        $and : [{
            userId:userId,
            day:day
        }]
    }).sort({time:1});
   }
   getUserScheduleByDayAndTime(userId, day, time){
       console.log(userId)
       console.log(time)
       console.log(day)
    return schedule.find({
        $and : [{
            userId:userId,
            day:day,
            time:time
        }]
    });
   }
   //get tutors available at given day and time
   getAvailableTutors(day, time){
    return schedule.find({
        $and:{
                day:day,
                time:time
            }
        });
   }
    //add timeslot
    addTimeslot(id, day, time){
        var timeslot = new schedule({userId:id, day:day, time: time});
        return timeslot.save();
    }
    //remove timeslot
    removeTimeslot(id, day, time){
        return schedule.find({
            $and : [{
                userId:id,
                day:day,
                time: time
            }]
        }).remove();
    }

}