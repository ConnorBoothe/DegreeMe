require('dotenv').config();
var mongoose = require("mongoose");
const { version } = require('stylus');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

  var threads = new Schema({
    threadId:{type:String, required:true},
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    subject:{type:String, required:true},
    unreadCount:{type:Number, required:true},
    timestamp:  {type:Date, required:true}
});
var followSchema = new Schema({
    user_handle:{type:String, required:true},
    user_image:{type:String, required:true},
});
var myCoursesSchema = new Schema({
    courseName: {type:String, required:true},
    courseId: {type:String, required:true},
    courseCode: {type:String, required:true}
}); 
var studyGroupsSchema = new Schema({
    studyGroupId: {type:String, required:true},
    studyGroupName: {type:String, required:true},
    course:{type:String, required:true}
}); 
//version 2 
var SearchHistorySchema = new Schema({
    SearchItem: {type:String, required:true},
});  
var myMeetupSchema = new Schema({
    meetupId: {type:String, required:true},
    meetupName: {type:String, required:true},
    meetupDate: {type:Date, required:true},
    meetupType: {type:String}
}); 
//tutoring session schema
var tutoringSessionSchema = new Schema({
    sessionId: {type:String, required:true},
    sessionName: {type:String, required:true},
    date: {type:Date, required:true},
    hostImg: {type:String, required:true},
    hostHandle:{type:String},
    role: {type:String, required:true},
    leftReview: {type:Boolean}
});  
//bid schema
var bidSchema = new Schema({
    timelineId: {type:String, required:true},
    bidder: {type:String, required:true},
    price: {type:String, required:true}
});   
var userDBSchema = new Schema({
    handle: {type:String, required:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    school:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    img:{type:String, required:true},
    rating: {type:String, required:true},
    theme:{type:String, required:true},  
    status:{type:String, required:true},  
    activationCode:{type:String, required:true},  
    subscription:{type:String, required:true},
    Major: {type:String, required:true},
    Tutor:{type:Boolean, required:true},
    StripeId: {type:String, required:true},
    CustomerId: {type:String, required:true},
    notificationCount: {type:Number, required:true},
    dateCreated: {type:Date},
    bio: {type:String, required:true},
    threads: [threads], 
    followers:[followSchema], 
    following:[followSchema],
    myCourses: [myCoursesSchema],
    meetups: [myMeetupSchema],
    SearchHistory: [SearchHistorySchema],
    StudyGroups: [studyGroupsSchema],
    TutoringSessions: [tutoringSessionSchema],
    bids:[bidSchema]
}, {collection: 'UserDB'});

module.exports = class UserDB {
    constructor() {

    }
    //return all users
    getStudents(){
      var UserDB = mongoose.model('UserDB',userDBSchema);
      return UserDB.find({});    
    }
     //return all users
     getAllUsers(){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({});
      }
    getUserByHandle(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({}, "handle");
    }
    getUserByEmail(email){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({email:email});     
      }
      checkIfEmailExists(email){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({email:email},'email');     
      }
    usersAutocomplete(searchValue){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({
            handle:{$regex: searchValue, $options:"i"}
    
        }, 'handle first_name last_name img').limit(10);
    }
      //get user by id
    getUserById(id){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:id});     
    }
      //get user by handle
      getUserByHandle(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({handle:handle});
              
      }
      getUserImgs(handleArray){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        
        return UserDB.find({handle:{$in: handleArray}});
    }
    //return all message handles
    getMessageHandles(userHandle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({handle:userHandle});
    }
    //check if entered code matches code saved in DB. If so, update status of account.
    getActivationCode(email){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({email:email});
    }
    updateStatus(email){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({email:email}).updateOne({$set:{status: "Active"}}).exec((err,docs)=>{
           
        });
    }
    //update activation code
    updateActivationCode(email, code){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({email:email}).updateOne({$set:{activationCode: code}}).exec((err,docs)=>{
           
        });
    }
    updatePassword(email, pw){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({email:email}).updateOne({$set:{password: pw}}).exec((err,docs)=>{
        });
    }
    //register a new user to UserDB
    addUser(handle, first_name, last_name, school, email, password, img, status, code, subscription, major){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        var user =new UserDB({handle:handle,first_name: first_name, last_name: last_name,
            school: school, email: email, password: password, img: img, activationCode: code,
            theme:'bg-dark', rating:0, status:status, subscription:subscription, StripeId: "none", CustomerId:"none", notificationCount:0,
             Major:major,  Tutor:false, dateCreated:new Date(), bio:"Tell the world a bit about yourself"});
        return user.save();
    }
    //add follower function adds a follower to the followers array,
    //and adds the account followed to following array
    addFollow(follower_handle, handle, followerImage, followingImage, callback){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            //if the user handle exists
            if (docs){
                //add follower to the followers array
                //not saving the correct image
                docs.followers.push({user_handle:follower_handle, user_image: followerImage});
                docs.save();
                //add user to following array
                //currently saving the correct image
                UserDB.findOne({handle:follower_handle}).exec((err,docs1)=>{
                    if (docs1){
                        docs1.following.push({user_handle: handle, user_image:followingImage});
                        docs1.save();
                        callback(true);
                    }else{
                        console.log("follower_handle does not exist");
                        callback(false);
                    }
                });
            }else{
                console.log("handle does not exists");
                callback(false);
            }
        })

    }
    removeFollow(follower_handle, handle, callback){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            if (docs){
                for (var i=0;i<docs.followers.length;i++){
                    if (docs.followers[i].user_handle.valueOf()==follower_handle.valueOf()){
                        docs.followers.splice(i,1);
                    }
                }
                docs.save();
                UserDB.findOne({handle:follower_handle}).exec((err,docs1)=>{
                    if (docs1){
                        for (var j=0;j<docs1.following.length;j++){
                            if (docs1.following[j].user_handle.valueOf()==handle.valueOf()){
                                docs1.following.splice(j,1);
                            }
                        }
                        docs1.save();
                        callback(true);
                    }else{  
                        callback(false);     
                    }
                });
            }else{
                callback(false);
            }
        })
    }
    isFollowing(follower_handle, user, student, callback){
        for (var i=0;i<user.followers.length;i++){
            if(follower_handle==user.followers[i].user_handle){
                callback(student,true);
                return;
            }
        }
        callback(student,false);
    }

    addThread(host, hostImg, subject, threadId, handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            if(docs){
                docs.threads.push({threadId:threadId, host:host, hostImg:hostImg, subject: subject, unreadCount:0, timestamp:new Date()});
                docs.save();
            }
            else{
                console.log("Handle doesn't match: " + handle);
            }
        });
    }
    removeThread(handle, threadId){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            for(x in docs.threads){
                if( docs.threads[x].threadId === threadId){
                    docs.threads.splice(x,1);
                    docs.save();
                    break;
                }
            }

        });
    }
    //updates unread count and moves thread to top of list
    updateUnreadCount(userHandle, threadId){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:userHandle}).exec((err,docs)=>{
            if(docs){
                var index = "";
                for(x in docs.threads){
                    if(docs.threads[x].threadId === threadId){
                        index = x;
                    }
                }
                docs.threads[index].unreadCount++;
                docs.save();
            }
            else{
                console.log("Unread count not updated");
            }
        });
    }
      //updates unread count and moves thread to top of list
      unreadCountToZero(threadId, handle, req, res,  messages, formatDate, formatTime){
        
            var UserDB = mongoose.model('UserDB',userDBSchema);
            UserDB.findOne({handle:handle}).exec((err,docs)=>{
                var tempThread = "";
                for(x in docs.threads){
                    if(docs.threads[x].threadId === threadId){

                        docs.threads[x].unreadCount = 0;
                        tempThread  = docs.threads[x];
                    }
                }
                if(tempThread != ""){
                    tempThread.unreadCount = 0;
                }
                docs.save(function(err,docs){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.render('UserLoggedIn/messages', {
                            session: req.session,
                            qs: req.query,
                            messages: messages,
                            formatDate: formatDate,
                            formatTime:formatTime
                        });
                    }
                });
                
            })
        }
    getThreads(id){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:id},'threads');
    }
    getThreadsByHandle(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({handle:handle});
    }
    //change theme of UserProfile
    setTheme(id,theme,req){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:id}).updateOne({$set:{theme: theme}});
    }
    //when message is sent, related thread should move to top of the list
    moveThread(threadId, handle, senderHandle){
        console.log("HANDLE", handle)
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            var tempThread = "";
            var index = "";
            for(x in docs.threads){
                if(docs.threads[x].threadId === threadId){
                    tempThread  = docs.threads[x];
                }
            }
            docs.threads.pull(tempThread);
            docs.threads.push(tempThread);
            //if receiving the message, incremement count
            if(docs.handle != senderHandle && tempThread != ""){
                tempThread.unreadCount++;
            }
           
            if(index != ""){
                console.log("unread count: " + docs.threads[index].unreadCount )
            }
            return docs.save();
        })
    }
   //add stripeId to User Profile
    addStripeId(userId, stripeId){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:userId}).updateOne({$set:{StripeId: stripeId}});
    }

    //add CustomerId to User Profile
    setCustomerId(userId, customerId){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:userId}).updateOne({$set:{CustomerId: customerId}});
    }
    //get all users from a given major
    getUsersByMajor(major){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({Major:major});
    }
    //add courses to my courses array
    addCourse(handle, course, courseId, courseCode, callback){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            var exists = false;
            for(var x = 0; x<docs[0].myCourses.length; x++){
                if(docs[0].myCourses[x].courseId === courseId){
                    exists = true;
                }
            }
            if(!exists){
                docs[0].myCourses.push({courseName:course, courseId: courseId, courseCode:courseCode});
                 docs[0].save();
            }
            else{
                return "Course Already Exists";
            }
        })
    }
    //remove course from myCourses list
    removeCourse(handle, courseName){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            var index = "";
            for(x in docs[0].myCourses){
                if(docs[0].myCourses[x].courseName === courseName){
                    index = x;
                    docs[0].myCourses.splice(x,1);
                    docs[0].save();
                    break;
                }
            }
           
        });
    }
    addStudyGroup(handle, groupId, groupName, course){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].StudyGroups.push({studyGroupId:groupId, studyGroupName:groupName, course:course});
            docs[0].save();
        })
    }
    addMeetup(handle, meetupId, meetupName, date, meetupType){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].meetups.push({meetupId:meetupId, meetupName:meetupName, meetupDate:date, meetupType: meetupType});
            docs[0].save();
        })
    }
    //increment the user's notification count
    incrementNotificationCount(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({
                handle: handle
            }).updateOne({
                $inc: {
                notificationCount: +1
                }
         }).exec();
    }
    clearNotificationCount(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        console.log("CLEAR COUNT")
        return UserDB.findOne({
                handle: handle
            }).updateOne({
                $set: {
                notificationCount: 0
                }
         });
    }

    sawMessage(handle, threadId, res){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({
            handle: handle
        }).then(function(data){
            var threadIndex = -1;
            for(var x = 0; x< data.threads.length; x++){
                if(data.threads[x].threadId ===  threadId){
                    threadIndex = x;
                    data.threads[x].seen = true;
                    data.save()
                }
            }
            res.status(202).json({
                threadURL: "/messages?messageId="+ data.threads[threadIndex].threadId
            }).end();
        })
        .catch(function(err){
            console.log(err)
        })
    }

    unseeMessage(handle, threadId){
        console.log("UNSEE handle", handle)
        console.log("UNSEE threadId", threadId)
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({
            handle: handle
        }).exec((err,docs)=>{
            
            console.log(docs)
            var threadIndex = -1;
            for(var x = 0; x< docs.threads.length; x++){
                if(docs.threads[x].threadId ==  threadId){
                    threadIndex = x;
                   
                }
            }
            if(threadIndex > 0){
                docs.threads[threadIndex].seen = false;
                return docs.save()
                
            }
            else{
                console.log("Thread not found")
            }
            
        })
    }
    setBio(handle, bio){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({
                handle: handle
            }).exec((err, docs)=>{
                docs.bio = bio;
                docs.save();
            });
    }
    //when user creates seller account, make them a 'tutor'
    becomeTutor(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({
            handle: handle
        }).exec((err, docs)=>{
            docs.Tutor = true;
            docs.save();
        });
    }
    //add a tutoring session to user profile
    addTutoringSession(handle,sessionId, sessionName, date, hostImg, hostHandle, role){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].TutoringSessions.push({sessionId:sessionId, sessionName:sessionName, date:date, 
                hostImg: hostImg, hostHandle:hostHandle, role:role, leftReview:false});
            docs[0].save();
        })
    }
    //update leftReview boolean
    leftReview(handle, id){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.find({handle: handle}).exec((err,docs)=>{
            for(var x =0; x< docs[0].TutoringSessions.length; x++){
                if(docs[0].TutoringSessions[x].sessionId === id){
                    docs[0].TutoringSessions[x].leftReview = true;
                    docs[0].save();
                    break;
                }
            }
        })
    }
    //get list of emails given a list of user handles
    getUserEmailsByHandle(handleArray){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({handle:{$in: handleArray}}, "email");

    }
}
