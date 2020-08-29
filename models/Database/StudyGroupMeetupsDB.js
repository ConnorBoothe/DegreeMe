require('dotenv').config();
const UserDB = require("./UserDB")
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {

});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var attendeeSchema = new Schema({
  handle: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    required: true
  }
})

var meetupSchema = new Schema({
  hostHandle: {
    type: String,
    required: true
  },
  groupId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  building: {
    type: String,
  },
  room: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  CourseName: {
    type: String,
    required: true
  },
  ZoomLink: {
    type: String,
  },
  StudentsAttending: {
    type: Number,
    required: true
  },
  Attendees: [attendeeSchema]
}, {
  collection: 'StudyGroupMeetupDB'
});

module.exports = class UserProfile {
  //addMeetup
  addMeetup(groupName, hostHandle, groupId, type, date, time, building, room, description, CourseName, ZoomLink, attendee, userImage) {
    var StudyGroupMeetupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    var newGroup = new StudyGroupMeetupDB({
      groupName: groupName,
      hostHandle: hostHandle,
      groupId: groupId,
      type: type,
      date: date,
      time: time,
      building: building,
      room: room,
      description: description,
      CourseName:CourseName,
      ZoomLink: ZoomLink,
      StudentsAttending: 1,
      Attendees: [{
        handle: attendee,
        userImage: userImage
      }]
    });
    return newGroup.save();
  }
  getMeetupsByGroupId(groupId) {
    var StudyGroupMeetupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    return StudyGroupMeetupDB.find({
      groupId: groupId
    });
  }
  getMeetupById(id) {
    var StudyGroupMeetupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    return StudyGroupMeetupDB.find({
      _id: id
    });
  }
  addAttendee(sessionID, handle, image, callback) {
    var StudyGroupMeetupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    StudyGroupMeetupDB.findOne({
      _id: sessionID
    }).exec((err, docs) => {
      var exists = false;
      if (docs) {
        for (x in docs.Attendees) {
          if (docs.Attendees[x].handle === handle) {
            exists = true;
          }
        }
        if (!exists) {
          docs.Attendees.push({
            handle: handle,
            userImage: image
          });
          docs.StudentsAttending++;
          docs.save();
          var users = mongoose.model('UserDB', UserDB.userDBSchema);
          users.findOne({
            handle: handle
          }).exec((err, docs1) => {
            if (docs1) {
              docs1.meetups.push({meetupId: sessionID,meetupName: docs.description,meetupDate: docs.date,meetupType: docs.type});
              docs1.save();
              console.log('added ' + docs.description + ' to user meetups');
              callback(true);
            } else {
              console.log('no user found with that handle');
              console.log(handle);
              callback(false);
            }
          })
        } else {
          console.log("user already attending");
          callback(false);
        }

      } else {
        console.log("Sesh id not found");
        callback(false);
      }

    });
  }
  removeAttendee(sessionID, handle, callback) {
    var StudyGroupMeetupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    StudyGroupMeetupDB.findOne({
      _id: sessionID
    }).exec((err, docs) => {
      if (docs) {
        for (var i = 0; i < docs.Attendees.length; i++) {
          if (docs.Attendees[i].handle.valueOf() == handle.valueOf()) {
            docs.Attendees.splice(i, 1);
            console.log('removed attendee from ' + sessionID);
          }
        }
        docs.StudentsAttending--;
        docs.save();
        var users = mongoose.model('UserDB', UserDB.userDBSchema);
        users.findOne({
          handle: handle
        }).exec((err, docs1) => {
          if (docs1) {
            for (var j = 0; j < docs1.meetups.length; j++) {
              //valueOf error thrown
              if (docs1.meetups[j].meetupName.valueOf() == docs.description.valueOf()) {
                docs1.meetups.splice(j, 1);
                console.log('removed ' + docs.description + ' from user');
              }
            }
            docs1.save();
            callback(true);
          } else {
            console.log("handle does not exists");
            console.log(handle);
            callback(false);
          }
        });
      } else {
        console.log("Study Session does not exists");
        console.log(sessionID);
        callback(false);
      }
    })
  }

  //get list of students attending the study group
  getStudentsAttending(sessionID) {
    var StudyGroupDB = mongoose.model('StudyGroupMeetupDB', meetupSchema);
    return StudyGroupMeetupDB.findOne({
      _id: sessionID
    });
  }



}