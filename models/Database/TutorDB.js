require('dotenv').config();
const mongoose = require("mongoose");
const TutorSchedule = require("./TutorSchedule");
var schedule = new TutorSchedule();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', {
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
    //get tutors available at given day and time
    getAvailableTutorsByCourse(course) {
        var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
                    console.log("BEFORe")
                    if(data.length < 1){
                        resolve(availableTutors)
                    }
                    for (var i = 0; i < data.length; i++) {
                        new Promise((res, rej) => {
                            //check availability of user id in query
                            console.log(data[i].userId)
                            var currTutor = data[i];
                            schedule.getUserScheduleByDayAndTime(data[i].userId, daysOfWeek[new Date().getDay() - 1], new Date().getHours())
                                .then(function (data1) {
                                    console.log("data1: " + data1)
                                    if (data1.length > 0) {
                                        console.log("tutors found")
                                        //push if availability found
                                        availableTutors.push(currTutor);
                                        console.log(availableTutors)
                                        resolve(availableTutors);
                                    } else {
                                        resolve(availableTutors);
                                    }
                                })
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