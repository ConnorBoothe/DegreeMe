require('dotenv').config();
var mongoose = require("mongoose");
const e = require("express");
mongoose.Promise = global.Promise;

//mongodb url. Move this for security purposes
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function (err) {
  console.log(err)
});
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.on('connected', function(){
//   console.log("Connected!")
// });
var Schema = mongoose.Schema;
var Schedule = new Schema({
  date:{type: String,required: true},
  StudentsAttending:{type: Number,required: true}
})
var ListingsDBSchema = new Schema({
  UserID: {type: String,required: true},
  Handle: {type: String,required: true},
  Name: {type: String,required: true},
  Subject: {type: String,required: true},
  CourseCode: {type: String,required: true},
  School: {type: String,required: true},
  Type: {type: String,required: true},
  Grade: {type: String,required: true},
  HourlyRate: {type: String,required: true},
  NumHours: {type: String,required: true},
  Schedule:[Schedule],
  StudentsAttending: {type: Number,required: true},
  Image: {type: String, required: true},
  Active: { type: Boolean, required: true },
  StartDate: { type: Date,required: true},
  ExpirationDate: {type: Date,required: true},
  Virtual: {type: Boolean,required: true},
  MaxStudents: {type: String},
  Building: {type: String},
  Room: {type: String},
  
}, {
  collection: 'ListingsDB'
});
module.exports = class ListingsDB {
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
  //will be used when additional schools are added
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
    }, 'Type CourseCode _id Active');
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
      Subject: subject,
      Active:true
    });
  }
  listingsAutocompleteBySubject(searchValue){
    var ListingsDB = mongoose.model('ListingsDB',ListingsDBSchema);
    return ListingsDB.find({
        Subject:{$regex: searchValue, $options:"i"}

    }, '_id Image Name Subject').limit(10);
}
listingsAutocompleteByCourseCode(searchValue){
  var ListingsDB = mongoose.model('ListingsDB',ListingsDBSchema);
  return ListingsDB.find({
      CourseCode:{$regex: searchValue, $options:"i"}

  }, '_id Image Name Subject').limit(10);
}
  addPhysicalGroupListing(UserID, Handle, Name, Subject, CourseCode, Grade, HourlyRate, NumHours, School, Type, Schedule, MaxStudents, Image, Active, StartDate, ExpirationDate, Virtual) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    var listing = new ListingsDB({
      UserID: UserID,
      Handle: Handle,
      Name: Name,
      Subject: Subject,
      CourseCode:CourseCode,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours:NumHours,
      MaxStudents: MaxStudents,
      StudentsAttending: 0,
      Image:Image,
      Active:Active,
      StartDate: StartDate,
      ExpirationDate: ExpirationDate,
      Virtual:false
    });
    for(x in Schedule){
      listing.Schedule.push({date:Schedule[x], StudentsAttending:0});
    }
    return listing.save();
  }
   //add Virtual group listing
   addVirtualGroupListing(UserID, Handle, Name, Subject, CourseCode, Grade, HourlyRate, NumHours, MaxStudents, School, Type, Schedule, Image, 
    Active, StartDate, ExpirationDate) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    var listing = new ListingsDB({
      UserID: UserID,
      Name: Name,
      Handle: Handle,
      Subject: Subject,
      CourseCode:CourseCode,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours: NumHours,
      MaxStudents: MaxStudents,
      StudentsAttending: 0,
      Image: Image,
      Active:Active,
      StartDate: StartDate,
      ExpirationDate: ExpirationDate,
      Virtual:true,
    });
    for(x in Schedule){
      listing.Schedule.push({date:Schedule[x], StudentsAttending:0});
    }
    return listing.save();

  }
  //adds a physical individual listing
  addPhysicalIndividualListing(UserID, Handle, Name, Subject, CourseCode, Grade, HourlyRate, NumHours, School, Type, Schedule,
    Image, Active, StartDate, ExpirationDate) {
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);

    var listing = new ListingsDB({
      UserID: UserID,
      Name: Name,
      Handle: Handle,
      Subject: Subject,
      CourseCode:CourseCode,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours: NumHours,
      MaxStudents: 1,
      StudentsAttending: 0,
      Image: Image,
      Active:Active,
      StartDate: StartDate,
      ExpirationDate: ExpirationDate,
      Virtual:false
    });
    for(x in Schedule){
      listing.Schedule.push({date:Schedule[x], StudentsAttending:0});
    }
    return listing.save();

  }
  //add Virtual individual listing
  addVirtualIndividualListing(UserID, Handle, Name, Subject, CourseCode, Grade, HourlyRate, NumHours, School, Type, Schedule, Image, 
    Active, StartDate, ExpirationDate) {
    console.log("ListingsDB", Schedule)
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    var listing = new ListingsDB({
      UserID: UserID,
      Name: Name,
      Handle: Handle,
      Subject: Subject,
      CourseCode:CourseCode,
      School: School,
      Type: Type,
      Grade: Grade,
      HourlyRate: HourlyRate,
      NumHours: NumHours,
      MaxStudents: 1,
      StudentsAttending: 0,
      Image: Image,
      Active:Active,
      StartDate: StartDate,
      ExpirationDate: ExpirationDate,
      Virtual:true,
    });
    for(x in Schedule){
      listing.Schedule.push({date:Schedule[x], StudentsAttending:0});
    }
    return listing.save();

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
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.find({
      _id: listingId
    })
    .exec((err,docs)=>{
    var tempSlot = "";
    //retrieve the proper time slot
    for(x in docs[0].Schedule){
      console.log("X",x)
        if(docs[0].Schedule[x].timeSlot === timeSlot){
          console.log("tempSlot")
            tempSlot  = docs[0].Schedule[x];
        }
    }
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
  //will transfer reviews from here to reviewsDB
  // addReview(sender, receiver, course, rating, message, res) {

  //   var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
  //   ListingsDB.findOne({
  //     Handle: receiver
  //   }).exec((err, docs) => {
  //     var ratingTotal = 0;
  //     var count = 0;
  //     for (x in docs.Reviews) {
  //       count++;
  //       ratingTotal += parseInt(docs.Reviews[x].Rating);
  //     }
  //     console.log("rating: " + ratingTotal / count)
  //     ListingsDB.findOne({
  //       Handle: receiver
  //     }).updateOne({
  //       $set: {
  //         Rating: ratingTotal / count
  //       }
  //     });

  //   });
  //   ListingsDB.findOne({
  //     Handle: receiver
  //   }).exec((err, docs) => {
  //     if (docs) {
  //       docs.Reviews.push({
  //         SenderHandle: sender,
  //         Course: course,
  //         Rating: rating,
  //         Message: message
  //       });
  //       docs.save();
  //       res.redirect("/FeedbackLeft");
  //     } else {
  //       res.redirect("/MyConnections")
  //     }
  //   });
  // }
  disableListing(id){
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.findOne({_id:id}).updateOne({
      $set: {
        Active: false
      }
    }).exec();
  }
  activateListing(id){
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    ListingsDB.findOne({_id:id}).updateOne({
      $set: {
        Active: true
      }
    }).exec();
  }
  //edit listing function
  updateListing(id, HourlyRate, NumHours, Schedule, ExpirationDate){
    var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
    if(Schedule.length > 0){
      var newSchedule = [];
      for(x in Schedule){
        newSchedule.push({date:Schedule[x], StudentsAttending:0});
      }
      console.log(newSchedule)
      if(ExpirationDate != 0){
        ListingsDB.findOne({_id:id}).updateOne({
          $set: {
            HourlyRate: HourlyRate,
            NumHours: NumHours,
            ExpirationDate: ExpirationDate,
            Schedule:newSchedule
          }
        }).exec();
      }
    else{
      ListingsDB.findOne({_id:id}).updateOne({
        $set: {
          HourlyRate: HourlyRate,
          NumHours: NumHours,
          Schedule:newSchedule
        }
      }).exec();
    }
      
    }
    else{
      ListingsDB.findOne({_id:id}).updateOne({
        $set: {
          HourlyRate: HourlyRate,
          NumHours: NumHours,
          ExpirationDate: ExpirationDate
        }
      }).exec();
    }
   
  }

incrementStudentsAttending(listingId, dateId){
  var ListingsDB = mongoose.model('ListingsDB', ListingsDBSchema);
  console.log(
    "LISTING ID",listingId)
    console.log("TIME ID", dateId)
  ListingsDB.findOne({_id:listingId}).exec((err,docs)=>{

    console.log("DOCS", docs)
    if(docs.Type === "Group Session"){
      console.log("GROUP")
      for(var x = 0; x <docs.Schedule.length;x++){
        if(dateId = docs.Schedule[x]._id){
          docs.Schedule[x].StudentsAttending++;
          if(docs.Schedule[x].StudentsAttending >= docs.MaxStudents){
            //remove
            docs.Schedule.pull(docs.Schedule[x]);
          }
          docs.save();
          break;
        }
      }
    }
    else{
      for(var x = 0; x <docs.Schedule.length;x++){
        if(dateId = docs.Schedule[x]._id){
          docs.Schedule.pull(docs.Schedule[x]);
          docs.save();
          break;
        }
      }
    }
    
  })
}
}