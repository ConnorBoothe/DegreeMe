require('dotenv').config();
const mongoose = require("mongoose");
const MeetupsDB = require("./MeetupsDB");
const meetups = new MeetupsDB();
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
    reservedStatus: {type:String},

}, {collection: 'TutorSchedules'});
var ScheduleDB = mongoose.model('TutorSchedules',scheduleSchema);
module.exports = class TutorSchedules {
    //get user schedule to display
    //on user dashboard. Doesn't check if 
    //slots are reserved
    getPersonalSchedule(userId, day){
            return ScheduleDB.find({
                $and : [{
                    userId:userId,
                    day:day
                }]
            }).sort({time:1})
    }
    //get user schedule to display
    //on user profile. Checks if slots are reserved
   getUserScheduleByDay(userId, day, userHandle, courseCode){
       return new Promise((resolve, reject)=>{
        ScheduleDB.find({
            $and : [{
                userId:userId,
                day:day
            }]
        }).sort({time:1})
        .then((schedule)=>{
            var date = new Date();
            //convert date from day and time ints to type date
            if(date.getDay() != day) {
                if(day- date.getDay() > 0) {
                    date.setDate(date.getDate()+ Math.abs(day - date.getDay()))
                }
                else{
                    date.setDate(date.getDate()+ (7-Math.abs(day - date.getDay())))
                }
            }
            var dates = [];
            for(var i = 0; i < schedule.length; i++) {
            //date object used to create correct date/time pair
            //and push to dates array
            var tempDate = new Date();
            //convert date from day and time ints to type date
            if(tempDate.getDay() != day) {
                if(day- tempDate.getDay() > 0) {
                    tempDate.setDate(tempDate.getDate()+ Math.abs(day - tempDate.getDay()))
                }
                else{
                    tempDate.setDate(tempDate.getDate()+ (7-Math.abs(day - tempDate.getDay())))
                }
            }
                tempDate.setHours(schedule[i].time)
                tempDate.setMinutes(0);
                tempDate.setSeconds(0);
                tempDate.setUTCMilliseconds(0);
                //add to date array
                dates.push(tempDate);
            }
            console.log("HANDLE: " + userHandle)
            meetups.checkReservedStatusOfMany(dates, userHandle, courseCode)
            .then((meetupData)=>{
                //create an array of meetup Host Ids
                //Not going to work here
                //must check with time array
                var meetupTimes = [];
                for(var i = 0; i < meetupData.length; i++){
                    meetupTimes.push(meetupData[i].date.getHours())
                }               
                for(var i = 0; i < dates.length; i++){
                    if(meetupTimes.includes(dates[i].getHours())){
                        schedule[i].reservedStatus = true;
                    }
                }
                resolve({schedule: schedule})
            })
            .catch((err)=>{
                console.log(err);
                reject(err);
            })
        })
       })
     
   }
   getUserScheduleByDayAndTime(userHandle, userIdArray, day, time, courseCode){
      var courseCode = courseCode;
      console.log("Running get schedule")
      console.log("Day: "+ day)
      console.log("userHandle: "+ userHandle)
    return new Promise((resolve, reject)=>{
        ScheduleDB.find({
            $and : [{
                userId:{
                    $in:userIdArray
                },
                day:day,
                time:time
            }]
        })
        .then((schedule)=>{
            var date = new Date();
            var schedule = schedule;
            //convert date from day and time ints to type date
            console.log(date.getDay())
            if(date.getDay() != day) {
                if(day- date.getDay() > 0) {
                    date.setDate(date.getDate()+ Math.abs(day - date.getDay()))
                }
                else{
                    date.setDate(date.getDate()+ (7-Math.abs(day - date.getDay())))
                }
            }

            date.setHours(time);
            date.setMinutes(0);
            date.setSeconds(0);
            //get meetups by date, handle, course code to check
            //if the schedule slot has a corresponding meetup
            //for the current user
            meetups.checkReservedStatus(date)
            .then((meetupData)=>{
                var meetupsHostIds = [];
                for(var i = 0; i < meetupData.length; i++){
                    meetupsHostIds.push(meetupData[i].hostId);
                }
                for(var i = 0; i < schedule.length; i++ ){
                    if(meetupsHostIds.includes(schedule[i].userId)){
                        schedule[i].reservedStatus = true;
                    }
                    else{
                        schedule[i].reservedStatus = false;
                    }
                }
                ScheduleDB.find({
                    $and : [{
                        userId:{
                            $in:userIdArray
                        },
                        day:day
                    }]
                },"time").sort({time:1})
                .then((times)=>{
                    console.log("Times: "+ times)
                    resolve({
                        schedule: schedule,
                        timeSlots: times
                    })
                })
               
            })
        })
        .catch((err)=>{
            console.log(err);
            reject(err);
        })
      })
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
        return schedule.deleteOne({
            $and : [{
                userId:id,
                day:day,
                time: time
            }]
        })
    }

}