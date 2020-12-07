require('dotenv').config();
const UserDB=require("./UserDB")
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//mongodb url. Move this for security purposes
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true }, function (err) {

});
var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.on('connected', function(){
//   //console.log("Connected!")
// });
var Schema = mongoose.Schema;
var membersSchema = new Schema({
  MemberHandle: {type:String, required: true},
  MemberImage:{type:String, required: true},
  MemberRole:{type:String, required: true}
});

//add course name to study groups db
var StudyGroupDBSchema = new Schema({
  HostId: {type: String,required: true}, 
  HostHandle: {type: String, required: true},
  HostName: {type: String,required: true},
  HostImage: {type: String,required: true},
  Subject: {type: String},
  CourseId: {type: String},
  Professor: {type: String},
  School: {type: String,required: true},
  GroupName:{type: String,required: true},
  GroupDescription:{type: String,required: true},
  MessageId:{type: String,required: true},
  GroupImage: {type: String},
  Members: [membersSchema]
}, {
  collection: 'StudyGroupsDB'
});
module.exports = class StudyGroups {
  getAllStudyGroups() {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({})
  }
  //return sutdy group list by UserID
  getStudyGroupsByUserId(id) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      UserID: id
    }).sort({GroupName:1});
  }
  
  //get study group by id
  getStudyGroupById(id) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      _id: id
    }).sort({
      GroupName:1
    }
    );
  }
  addGroupImage(id, image){
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    StudyGroupsDB.find({_id: id}).updateOne({
      $set:{GroupImage:image}
    }).exec();
  }
  groupsAutocomplete(searchValue){
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
        Subject:{$regex: searchValue, $options:"i"}

    }, '_id GroupName Subject').limit(10);
}
groupsAutocompleteByName(searchValue){
  var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
  return StudyGroupDB.find({
    GroupName:{$regex: searchValue, $options:"i"}

  }, '_id GroupName Subject').limit(10);
}
  //get study groups related to a given course
  getStudyGroupByCourse(course) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({
      Subject: course
    }).sort(
      {
        name:1
      }
    );
  }
  getGroupNames(){
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({},'GroupName')

  }
  addStudyGroup(HostId, HostHandle, HostName, HostImage, Subject, CourseId, Professor, School, GroupName, GroupDescription,GroupImage, MessageID) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    var studyGroup = new StudyGroupDB({
      HostId: HostId,
      HostHandle: HostHandle,
      HostName: HostName,
      HostImage: HostImage,
      Subject: Subject,
      CourseId: CourseId,
      Professor:Professor,
      School: School,
      GroupName:GroupName,
      GroupDescription: GroupDescription,
      GroupImage:GroupImage,
      Members: [{MemberHandle:HostHandle, MemberImage: HostImage, MemberRole: "Host"}],
      MessageId: MessageID
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
  addStudentAttending(sessionID, handle,img, callback) {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    StudyGroupDB.findOne({_id: sessionID}).exec((err,docs)=>{
      if(docs){
        docs.Members.push({MemberHandle: handle, MemberImage: img, MemberRole: "Member"});
        docs.save();
        var users = mongoose.model('UserDB',UserDB.UserDBSchema);
        users.findOne({handle:handle}).exec((err,docs1)=>{
          if(docs1){
            docs1.StudyGroups.push({studyGroupId:sessionID,studyGroupName:docs.GroupName, course:docs.Subject})
            docs1.save();
          }else{
            console.log("could not find handle");
            callback(false);
          }
        })
        callback(true);
      }else{
        console.log("could not find study session ID");
        console.log(sessionID);
        callback(false);
      }
    });
  }
  removeStudentAttending(sessionID, handle, callback){
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    StudyGroupDB.findOne({_id: sessionID}).exec((err,docs)=>{
      if (docs){
            for (var i=0;i<docs.Members.length;i++){
                if (docs.Members[i].MemberHandle.valueOf()==handle.valueOf()){
                    docs.Members.splice(i,1);
                    console.log('removed member from '+sessionID);
                }
            }
            docs.save();
            var users = mongoose.model('UserDB',UserDB.UserDBSchema);
            users.findOne({handle:handle}).exec((err,docs1)=>{
                if (docs1){
                    for (var j=0;j<docs1.StudyGroups.length;j++){
                        if (docs1.StudyGroups[j].studyGroupName.valueOf()==docs.GroupName.valueOf()){
                            docs1.StudyGroups.splice(j,1);
                        }
                    }
                    docs1.save();
                    callback(true);
                }else{
                    console.log("handle does not exists");
                    callback(false);     
                }
            });
        }else{
            console.log("Study Session does not exists");
            callback(false);
        }
    })
  }
  isMember(sessionID, handle, group, callback){
    var StudyGroupDB = mongoose.model('StudyGroupDB',StudyGroupDBSchema);
    StudyGroupDB.findOne({
      _id: sessionID
    }).exec((err,docs)=>{
        if (docs){
            for (var i=0;i<docs.Members.length;i++){
                if ((docs.Members[i].MemberHandle)===(handle)){
                    //console.log('following '.concat(handle));
                    callback(group,true);
                    return;
                }
            }
            //console.log('not following '.concat(handle));
            callback(group,false);
        }else{
            console.log("follower_handle does not exists");
            callback(group,false);
        }
    })
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