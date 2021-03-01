require('dotenv').config();
const UserDB = require("./UserDB")
const StoryDB = require("./StoryDB")
const stories = new StoryDB();
const users = new UserDB();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//mongodb url. Move this for security purposes
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true }, function (err) {

});

var Schema = mongoose.Schema;
var membersSchema = new Schema({
  MemberHandle: {type:String, required: true},
  MemberImage:{type:String, required: true},
  MemberRole:{type:String, required: true},
  Status: {type:String},
});

//group chat schema
var groupChat = new Schema({
  threadId: {type:String, required: true},
  name: {type:String, required: true},
  category: {type:String, required: true}
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
  GroupDescription:{type: String},
  GroupImage: {type: String},
  BannerImage: {type: String},
  Members: [membersSchema],
  groupChat: [groupChat],
  private:{type:Boolean},
}, {
  collection: 'StudyGroupsDB'
});
var GroupsDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
module.exports = class StudyGroups {
  getAllStudyGroups() {
    var StudyGroupDB = mongoose.model('StudyGroupDB', StudyGroupDBSchema);
    return StudyGroupDB.find({})
  }
  allMembersAccepted() {
  
     GroupsDB.find({}).then((groups)=>{
       console.log("Groups: " +groups)
       for(var x = 0; x < groups.length; x++){
         for(var i = 0; i < groups[x].Members.length; i++){
           groups[x].Members[i].Status = "Accepted";
           console.log(groups[x].Members[i])

         }
                    groups[x].save();

       }
     })
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
  isGroupNameTaken(groupName){
    console.log("name: "+ groupName)
    return new Promise((resolve, reject)=>{
      GroupsDB.find({GroupName: groupName},'GroupName')
      .then((groupNames)=>{
        console.log(groupNames)
        if(groupNames.length > 0){
          resolve(true)
        }
        else {
          resolve(false)
        }
      })
    })
    

  }
  addStudyGroup(HostId, HostHandle, HostName, HostImage,School, GroupName,GroupImage,bannerImg, privacy ) {
    var studyGroup = new GroupsDB({
      HostId: HostId,
      HostHandle: HostHandle,
      HostName: HostName,
      HostImage: HostImage,
      School: School,
      GroupName:GroupName,
      GroupImage:GroupImage,
      BannerImage: bannerImg,
      Members: [{MemberHandle:HostHandle, MemberImage: HostImage, 
        MemberRole: "Admin", Status: "Accepted"}],
      private: privacy,
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
  addMember(id, handle,img, status) {
    console.log(id,handle,img, status)
    return new Promise((resolve, reject)=>{
      GroupsDB.findOne({_id: id}).then((docs)=>{
        if(docs){
          docs.Members.push({MemberHandle: handle, MemberImage: img, MemberRole: "Student", Status: status});
          docs.save();
          var users = mongoose.model('UserDB',UserDB.UserDBSchema);
          users.findOne({handle:handle}).then((user)=>{
            if(user){
              user.StudyGroups.push({studyGroupId:id,studyGroupName:docs.GroupName, course:docs.Subject})
              user.save();
              resolve(user)
            }else{
              console.log("could not find handle");
              reject("could not find handle");
            }
          })
        }else{
          console.log("could not find study session ID");
          console.log(id);
          callback(false);
        }
      });
  })
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
    return GroupsDB.findOne({
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
  //get images of a user's study groups
  getStoryImages(userId){
    return new Promise((resolve, reject)=> {
      users.getGroupsById(userId)
      .then((groups)=> {
        var groupIdArray = [];
        for (var i = 0; i < groups.StudyGroups.length; i++) {
          groupIdArray.push(groups.StudyGroups[i].studyGroupId)
        }
        stories.getNonZeroStories(groupIdArray)
        .then((groupIds)=>{
          GroupsDB.find({
            _id: { 
              $in: groupIds
            }
          }, "GroupImage GroupName")
          .then((groups)=>{
            resolve(groups)
          })
        })
        })
      .catch((err)=>{
        reject(err)
      })
    })
  }
  //get images of a user's study groups
  getGroupImages(userId){
    console.log("calling group iamges")
    return new Promise((resolve, reject)=> {
      users.getGroupsById(userId)
      .then((groups)=> {
        var groupIdArray = [];
        for (var i = 0; i < groups.StudyGroups.length; i++) {
          groupIdArray.push(groups.StudyGroups[i].studyGroupId)
        }
          GroupsDB.find({
            _id: { 
              $in: groupIdArray
            }
          }, "GroupImage GroupName")
          .then((groups)=>{
            resolve(groups)
          })
        })
      .catch((err)=>{
        reject(err)
      })
    })
  }
  getGroupMembers(id){
    return GroupsDB.findOne({
      _id: id
    }, "HostHandle Members")
  }
  getGroupThreads(id){
    return GroupsDB.findOne({
      _id: id
    }, "groupChat")
  }
  addGroupChat(id, threadId, name, category){
    return new Promise((resolve, reject)=>{
      GroupsDB.findOne({
        _id: id
      })
      .then((group)=>{
        var newChat = {threadId: threadId, name: name, category: category}
        group.groupChat.push(newChat);
        group.save();
        resolve(newChat);
      })
      .catch((err)=>{
        console.log(err)
        reject(err)
      })
    })
  }
  addBannerImage(id, url){
    return new Promise ((resolve, reject)=>{
      GroupsDB.findOne({_id: id}).then((group)=>{
        group.BannerImage = url;
        group.save();
        resolve(group)
      })
    })
   
  }
  updateGroupImage(id, url){
    return new Promise ((resolve, reject)=>{
      GroupsDB.findOne({_id: id}).then((group)=>{
        group.GroupImage = url;
        group.save();
        resolve(group)
      })
    })
   
  }
  updateCourseSettings(id, course, professor){
    return new Promise ((resolve, reject)=>{
      GroupsDB.findOne({_id: id}).then((group)=>{
        if(professor.trim() != ""){
          group.Professor = professor;
        }
        if(course.trim() != course){
          group.Subject = course;
        }
        group.save();
        resolve(group)
      })
      .catch((err)=>{
        console.log(err)
      })
    })
   
  }
  removeMember(groupId, handle){
    return new Promise((resolve, reject)=>{
        GroupsDB.findOne({_id: groupId})
        .then((group)=>{
          for(var i = 0; i < group.Members.length; i++) {
            if(group.Members[i].MemberHandle == handle){
              console.log("handle match")
              var removedHandle = group.Members[i].MemberHandle;
              group.Members.splice(i,1);
              group.save();
              resolve(removedHandle);
            }
          }
        })
        .catch((err)=>{
          console.log(err)
          reject(err)
        })
    })
  }
  approveMember(groupId, handle){
    return new Promise((resolve, reject)=>{
        GroupsDB.findOne({_id: groupId})
        .then((group)=>{
          for(var i = 0; i < group.Members.length; i++) {
            if(group.Members[i].MemberHandle == handle){
              var removedHandle = group.Members[i].MemberHandle;
              console.log("ACCEPT THE MEM")
              group.Members[i].Status = "Accepted";
              console.log(group.Members[i])
              group.save();
              resolve(removedHandle);
            }
          }
        })
        .catch((err)=>{
          console.log(err)
          reject(err)
        })
    })
  }
}