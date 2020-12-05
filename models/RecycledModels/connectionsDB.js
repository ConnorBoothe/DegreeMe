var mongoose = require("mongoose");
var io = require('socket.io');
mongoose.Promise = global.Promise;

//mongodb url. Move this for security purposes
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  console.log(err)

});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function(){
  // console.log("Connected!")
});
var Schema = mongoose.Schema;
var reviewsDBSchema = new Schema({
  SenderHandle: {
    type: String,
    required: true
  },
  Course: {
    type: String,
    required: true
  },
  Rating: {
    type: String,
    required: true
  },
  Message: {
    type: String,
    required: true
  },

});
var schedule = new Schema({
 
  test: {
    type: String,
    required: true
  }

});
var tutorDBSchema = new Schema({
  UserID: {
    type: String,
    required: true
  },
  Handle: {
    type: String,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Subject: {
    type: String,
    required: true
  },
  School: {
    type: String,
    required: true
  },
  Type: {
    type: String,
    required: true
  },
  Grade: {
    type: String,
    required: true
  },
  HourlyRate: {
    type: String,
    required: true
  },
  NumHours: {
    type: String,
    required: true
  },
  Schedule: [schedule],
  MaxStudents: {
    type: String
  },
  Building: {
    type: String,
    required: true
  },
  Room: {
    type: String,
    required: true
  },
  StudentsAttending: {
    type: Number,
    required: true
  },
  Image: {
    type: String,
    required: true
  },
  Active: {
    type: Boolean,
    required: true
  },
  StartDate: {
    type: Date,
    required: true
  },
  ExpirationDate: {
    type: Date,
    required: true
  },
  Rating: {
    type: Number,
    required: true
  },
  AverageRating: {
    type: String
  },
  Reviews: [reviewsDBSchema]
}, {
  collection: 'TutorDB'
});
module.exports = class connectionsDB {
  constructor() {

  }
  //return all tutors from TutorDB. delete this function and use one below bc better name
  getTutorArray() {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({});
  }
  getListings() {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({});
  }
  getListingById(id) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      _id: id
    });
  }
  getTutorHandleBySchool(school) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      School: school
    });
  }
  //return tutor list by tutor ID
  getTutorArrayByUserID(id) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      UserID: id
    });
  }
  
  //get tutoring session by ID
  getSessionByID(id) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      _id: id
    });
  }
  //return tutor by userID
  getTutorArrayByHandle(handle) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      Handle: handle
    });
  }
  getTutorArrayByCourse(course) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.find({
      Subject: course
    });
  }
  //
  addGroupListing(UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, Building, Room, Image, StartDate, ExpirationDate) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    var tutor = new TutorDB({
      UserID: UserID,
      Handle: Handle,
      Name: Name,
      Subject: Subject,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours:NumHours,
      MaxStudents: MaxStudents,
      Building: Building,
      Room: Room,
      StudentsAttending: 0,
      Image:Image,
      Rating: 0,
      Active:true,
      StartDate: StartDate,
      ExpirationDate: ExpirationDate
    });
    for(x in Schedule){
      tutor.Schedule.push({test:Schedule[x]});
      console.log(Schedule[x])
    }

    return tutor.save();

  }
  addIndividualListing(UserID, Handle, Subject, Grade, HourlyRate, NumHours, School, Type, Time, date, MinStudents, MaxStudents, Building, Room, Image, Rating) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);

    var tutor = new TutorDB({
      UserID: UserID,
      Name: Name,
      Handle: Handle,
      Subject: Subject,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours: NumHours,
      Time: Time,
      Date: date,
      MinStudents: MinStudents,
      MaxStudents: MaxStudents,
      Building: Building,
      Room: Room,
      StudentsAttending: '0',
      Image: Image,
      Rating: Rating
    });
    tutor.save(function () {
      res.redirect("/MySessions");
    });

  }
  //remove tutor from TutorDB
  removeTutor(userId, subject) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    //find where tutor id = tutor id and subject name = subject name
    TutorDB.deleteOne({
      UserID: userId,
      Subject: subject
    }).exec((err, docs) => {

    })

  }
  //increment students attending the session
  addStudentAttending(sessionID) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.findOne({
      _id: sessionID
    }).updateOne({
      $inc: {
        StudentsAttending: +1
      }
    });
  }
  getStudentsAttending(sessionID) {
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    return TutorDB.findOne({
      _id: sessionID
    });
  }
  addReview(sender, receiver, course, rating, message, res) {

    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    TutorDB.findOne({
      Handle: receiver
    }).exec((err, docs) => {
      var ratingTotal = 0;
      var count = 0;
      for (x in docs.Reviews) {
        count++;
        ratingTotal += parseInt(docs.Reviews[x].Rating);
      }
      console.log("rating: " + ratingTotal / count)
      TutorDB.findOne({
        Handle: receiver
      }).updateOne({
        $set: {
          Rating: ratingTotal / count
        }
      });

    });
    TutorDB.findOne({
      Handle: receiver
    }).exec((err, docs) => {
      if (docs) {
        docs.Reviews.push({
          SenderHandle: sender,
          Course: course,
          Rating: rating,
          Message: message
        });
        docs.save();

        res.redirect("/FeedbackLeft");
      } else {
        res.redirect("/MyConnections")
      }
    });
  }
  disableListing(id){
    var TutorDB = mongoose.model('TutorDB', tutorDBSchema);
    TutorDB.findOne({_id:id}).updateOne({
      $set: {
        Active: false
      }
    }).exec();
  }
}