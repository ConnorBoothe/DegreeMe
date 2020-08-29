var mongoose = require("mongoose");
var io = require('socket.io');
mongoose.Promise = global.Promise;

//mongodb url. Move this for security purposes
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/degreeMe', {
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
var StudyGroupDBSchema = new Schema({
  UserID: {type: String,required: true},
  Handle: {type: String,required: true},
  Name: {type: String,required: true},
  Subject: {type: String,required: true},
  School: {type: String,required: true},
  Type: {type: String,required: true
  },
  Duration: {type: String,required: true},
  MaxStudents: {type: String},
  Building: {type: String,required: true
  },
  Room: {
    type: String,
    required: true
  },
  StudentsAttendingCount: {
    type: Number,
    required: true
  },
  Active: {
    type: Boolean,
    required: true
  },
  Date: {
    type: Date,
    required: true
  },
  Time:{
    type:String,
    required:true
  }, 
  MessageId:{
    type:String,
    required:true
  }
}, {
  collection: 'StudyGroupsDB'
});
module.exports = class StudyGroups {
  constructor() {

  }
  getAllStudyGroups() {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({});
  }
  //return sutdy group list by UserID
  getStudyGroupsByUserId(id) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      UserID: id
    });
  }
  
  //get study group by id
  getStudyGroupById(id) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      _id: id
    });
  }
 
  //get study groups related to a given course
  getStudyGroupByCourse(course) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      Subject: course
    });
  }

  //add a new study group
  addStudyGroup(UserID, Handle, Name, Subject, Duration, School, Type, MaxStudents, Building, Room, Date, Time, messageId) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    var studyGroup = new StudyGroupDB({
      UserID: UserID,
      Handle: Handle,
      Name: Name,
      Subject: Subject,
      Duration:Duration,
      School: School,
      Type: Type,
      MaxStudents: MaxStudents,
      Building: Building,
      Room: Room,
      StudentsAttendingCount: 1,
      Active:true,
      Date:Date,
      Time:Time,
      MessageId:messageId
    });

    return studyGroup.save();

  }
  
  //delete study group by id
  removeStudyGroup(id) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);

    StudyGroupDB.deleteOne({
      _id:id
    }).exec();
  }
  //add students attending the study group
  addStudentAttending(sessionID) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.findOne({
      _id: sessionID
    }).updateOne({
      $inc: {
        StudentsAttending: +1
      }
    });
  }
  //get list of students attending the study group
  getStudentsAttending(sessionID) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.findOne({
      _id: sessionID
    });
  }

  //disable the study group (without deleting it)
  disableStudyGroup(id){
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    StudyGroupDB.findOne({_id:id}).updateOne({
      $set: {
        Active: false
      }
    }).exec();
  }
}