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
// db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
//bid schema
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
        type: Number,
        required: true
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

    addTutor(userId, userName, handle, userImg, rating, course, courseCode, hourlyRate, transcriptImg, streamId) {
        var tutor = new TutorDB({
            userId: userId,
            userName: userName,
            userImg: userImg,
            rating: rating,
            userHandle: handle,
            course: course,
            courseCode: courseCode,
            hourlyRate: hourlyRate,
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
    getAvailableTutorsByCourse(course) {
        var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        //get tutors By Course
        return new Promise((resolve, reject) => {
            var availableTutors = [];
            TutorDB.find({
                    $and: [{
                        course: course,
                        approved: true
                    }]
                })
                .then(function (data) {
                    // loop through query results
                    if(data.length < 1){
                        resolve(availableTutors)
                    }
                    console.log(data.length)
                    for (var i = 0; i < data.length; i++) {
                            //check availability of user id in query
                            var currTutor = data[i];
                            schedule.getUserScheduleByDayAndTime(data[i].userId, daysOfWeek[new Date().getDay()], new Date().getHours())
                                .then(function (data1) {
                                   console.log("DATA: " +data1.length)
                                    if (data1.length > 0) {
                                        //push if availability found
                                        availableTutors.push(currTutor);
                                        console.log("Available tutors: " +availableTutors)
                                        resolve(availableTutors);
                                    } else {
                                        resolve(availableTutors);
                                    }
                                })
                    }

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