require('dotenv').config();
const mongoose = require("mongoose");
const TutorSchedule = require("./TutorSchedule");
var schedule = new TutorSchedule();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {

});

var Schema = mongoose.Schema;
//schedule schema
var scheduleSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userImg: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    userHandle: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    hourlyRate: {
        type: Number
    },
    transcriptImg: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        required: true
    },
    streamId: {
        type: String,
        required: true
    }
}, {
    collection: 'TutorDB'
});
var TutorDB = mongoose.model('TutorDB', scheduleSchema);
module.exports = class TutorSchedules {

    addTutor(userId, userName, handle, userImg, rating, course, courseCode, transcriptImg, streamId) {
        var tutor = new TutorDB({
            userId: userId,
            userName: userName,
            userImg: userImg,
            rating: rating,
            userHandle: handle,
            course: course,
            courseCode: courseCode,
            transcriptImg: transcriptImg,
            approved: false,
            streamId: streamId
        });
        return tutor.save();
    }
    getTutorByUserId(userId) {
        return TutorDB.find({
            userId: userId
        })
    }
    getTutorByHandle(handle) {
        return TutorDB.find({
            userHandle: handle
        })
    }
      //get tutors available at given day and time
      getAvailableTutorsByCourse(userHandle, course, day, time) {
        return new Promise((resolve, reject) => {
            //get approved tutor by course
            TutorDB.find({
                    $and: [{
                        courseCode:course,
                        approved: true
                    }]
                }).sort({course:1})
                .then(function (data) {
                    var userIdArray = [];
                    var userArray = [];
                     // loop through query results
                    for (var i = 0; i < data.length; i++) {
                        //save userIds in array to make db call to
                        userIdArray.push(data[i].userId)
                        //used to format final tutor results
                        userArray.push([data[i].userId, data[i].userHandle, 
                            data[i].userImg, data[i].streamId, data[i].userName])
                    }
                            //get the schedule of the tutors in the course
                            schedule.getUserScheduleByDayAndTime(userHandle, userIdArray, day, time, course)
                                .then(function (scheduleSlots) {
                                    console.log("sched slots")
                                    console.log(scheduleSlots)
                                    //save final tutors that are currently available
                                    var finalTutors = [];
                                    //match user array id to id of schedule doc
                                    for(var x = 0; x < userArray.length; x++){
                                        for(var i = 0; i < scheduleSlots.schedule.length; i++) {
                                            //if ids match, save the array in finalTutors
                                            if(userArray[x][0]== scheduleSlots.schedule[i].userId) {
                                                userArray[x].push(scheduleSlots.schedule[i].reservedStatus);
                                                finalTutors.push(userArray[x])
                                            }
                                        }
                                    }
                                    //Create readable times (%12) and remove duplicates
                                    var times = [];
                                    for(var x = 0 ; x < scheduleSlots.timeSlots.length; x++) {
                                        if(scheduleSlots.timeSlots[x].time == 12
                                            || scheduleSlots.timeSlots[x].time == 0) {
                                                times.push(12)
                                        }
                                        else {
                                            times.push(scheduleSlots.timeSlots[x].time%12)
                                        }
                                    }
                                    var timeSet = new Set(times);
                                    var timesNoDuplicates = Array.from(timeSet)
                                    resolve({
                                        userHandle: userHandle, 
                                        finalTutors:finalTutors,
                                        times: timesNoDuplicates
                                    });
                                   
                                })
                })
                .catch((err)=>{
                    console.log(err);
                    reject(err);
                })
        })
    }
    getAllPending() {
        return TutorDB.find({
            approved: false
        });
    }
    acceptCourse(id) {
        return TutorDB.findOne({
            _id: id
        }).updateOne({
            approved: true
        });
    }
    rejectCourse(id) {
        console.log("Rejecting course")
        return TutorDB.findOne({
            _id: id
        }).deleteOne();
    }
}