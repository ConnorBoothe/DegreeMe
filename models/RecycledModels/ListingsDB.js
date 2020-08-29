var mongoose = require("mongoose");
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
  console.log("Connected!")
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
 
  timeSlot: {
    type: String,
    required: true
  }

});
var ListingsDBSchema = new Schema({
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
  collection: 'ListingsDB'
});
module.exports = class ListingsDB {
  constructor() {

  }
  //return all tutors from ListingsDB. delete this function and use one below bc better name
  getAllListings() {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({});
  }
  getListings() {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({});
  }
  getListingById(id) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({
      _id: id
    });
  }
  getListingsBySchool(school) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({
      School: school
    });
  }
  //return tutor list by tutor ID
  getListingsByUserID(id) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({
      UserID: id
    });
  }
  //return tutor by userID
  getListingsByHandle(handle) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({
      Handle: handle
    });
  }
  getTutorArrayByCourse(subject) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.find({
      Subject: subject
    });
  }
  //
  addGroupListing(UserID, Handle, Name, Subject, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, Building, Room, Image, StartDate, ExpirationDate) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    var listing = new ListingsDB({
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
      listing.Schedule.push({timeSlot:Schedule[x]});
      console.log(Schedule[x])
    }

    return listing.save();

  }
  addIndividualListing(UserID, Handle, Subject, Grade, HourlyRate, NumHours, School, Type, Time, date, MinStudents, MaxStudents, Building, Room, Image, Rating) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);

    var listings = new ListingsDB({
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
    listings.save(function () {
      res.redirect("/MySessions");
    });

  }
  //remove listing from ListingsDB
  removeListing(userId, subject) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    //find where tutor id = tutor id and subject name = subject name
    ListingsDB.deleteOne({
      UserID: userId,
      Subject: subject
    }).exec((err, docs) => {

    })

  }
  //remove availability from schedule
  //parameters: listingId, timeSlot
  //listingId: _id attribute of listing document
  //timeSlot: time slot to remove
  removeScheduleSlot(listingId, timeSlot){
    console.log("Testing ")
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.find({
      _id: listingId
    })
    .exec((err,docs)=>{
    var tempSlot = "";
    //retrieve the proper time slot
    for(x in docs[0].Schedule){
        if(docs[0].Schedule[x].timeSlot === timeSlot){
            tempSlot  = docs[0].Schedule[x];
        }
    }
    console.log("Time:" +tempSlot)
    //remove the time slot
    docs[0].Schedule.pull(tempSlot);
    return docs[0].save();
  });
  }

  //increment students attending the session
  addStudentAttending(sessionID) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.findOne({
      _id: sessionID
    }).updateOne({
      $inc: {
        StudentsAttending: +1
      }
    });
  }
  getStudentsAttending(sessionID) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    return ListingsDB.findOne({
      _id: sessionID
    });
  }
  addReview(sender, receiver, course, rating, message, res) {

    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.findOne({
      Handle: receiver
    }).exec((err, docs) => {
      var ratingTotal = 0;
      var count = 0;
      for (x in docs.Reviews) {
        count++;
        ratingTotal += parseInt(docs.Reviews[x].Rating);
      }
      console.log("rating: " + ratingTotal / count)
      ListingsDB.findOne({
        Handle: receiver
      }).updateOne({
        $set: {
          Rating: ratingTotal / count
        }
      });

    });
    ListingsDB.findOne({
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
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.findOne({_id:id}).updateOne({
      $set: {
        Active: false
      }
    }).exec();
  }
}