require('dotenv').config();
const UserDB = require("./UserDB")
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var attendeeSchema = new Schema({
  handle: {
    type: String,
    required: true
  },
  userImage: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
})
var meetupSchema = new Schema({
  hostHandle: {
    type: String,
    required: true
  },
  hostImage: {
    type: String,
    required: true
  },
  streamId: {
    type: String,
    required: true
  },
  groupId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  studentsAttending: {
    type: Number,
    required: true
  },
  attendees: [attendeeSchema]
}, {
  collection: 'GroupMeetups'
});
var GroupMeetups = mongoose.model('GroupMeetups', meetupSchema);

module.exports = class meetups {
  //addMeetup
  addMeetup(groupName, hostHandle, hostImage, streamId, groupId, date, 
    title) {
    var meetup = new GroupMeetups({
      groupName: groupName,
      hostHandle: hostHandle,
      hostImage: hostImage,
      streamId: streamId,
      groupId: groupId,
      date: date,
      title: title,
      studentsAttending: 1,
      attendees: [{
        handle: hostHandle,
        userImage: hostImage,
        role:"Host"
      }]
    });
    return meetup.save();
  }
  getMeetupsByGroupId(groupId) {
    return GroupMeetups.find({
      groupId: groupId
    });
  }
  getMeetupById(id) {
    return GroupMeetups.findOne({
      _id: id
    });
  }
  addAttendee(id, handle, image,) {
    return new Promise((resolve, reject)=>{
      GroupMeetups.findOne({
        _id: id
      }).then((docs) => {
        var exists = false;
        if (docs) {
          for (x in docs.attendees) {
            if (docs.attendees[x].handle === handle) {
              exists = true;
            }
          }
          if (!exists) {
            docs.attendees.push({
              handle: handle,
              userImage: image,
              role: "Member"
            });
            docs.studentsAttending++;
            docs.save();
          } else {
            console.log("user already attending");
          }
  
        } else {
          console.log("Sesh id not found");
        }
  
      });
    })
    
  }
  removeAttendee(sessionID, handle, callback) {
    GroupMeetups.findOne({
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
    return GroupMeetups.findOne({
      _id: sessionID
    });
  }
    //get list of students attending the study group
    getMeetupsByGroupId(groupId) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate()-1);
      return GroupMeetups.find({
        $and:[{
          groupId: groupId,
          date:{
            $gte: yesterday
        }

        }]
      }).sort({date:1});
    }
}