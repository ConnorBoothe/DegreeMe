require('dotenv').config();
var mongoose = require("mongoose");
const { version } = require('stylus');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.setMaxListeners(0)
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
    course:{type:String}
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

//updates
//make Name a single field
//only require handle, name, email, password, school
var userDBSchema = new Schema({
    handle: {type:String, required:true},
    first_name:{type:String, required: true},
    last_name:{type:String, required: true},
    school:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    img:{type:String, required:true},
    rating: {type:String},
    theme:{type:String},  
    //account status
    status:{type:String, required:true},  
    //user status
    active: {type:String, required:true},
    activationCode:{type:String, required:true},  
    // subscription:{type:String, required:true},
    Major: {type:String},
    Tutor:{type:Boolean, required:true},
    ActiveTutor:{type:Boolean},
    StripeId: {type:String, required:true},
    CustomerId: {type:String, required:true},
    notificationCount: {type:Number, required:true},
    dateCreated: {type:Date},
    bio: {type:String, required:true},
    classification: {type:String},
    threads: [threads], 
    followers:[followSchema], 
    following:[followSchema],
    myCourses: [myCoursesSchema],
    meetups: [myMeetupSchema],
    SearchHistory: [SearchHistorySchema],
    StudyGroups: [studyGroupsSchema],
    TutoringSessions: [tutoringSessionSchema],
    streamId: {type:String}
   
}, {collection: 'UserDB'});
var UserDB = mongoose.model('UserDB',userDBSchema);
//Creating an index to retrieve users by id
UserDB.ensureIndexes({"handle":1});
module.exports = class User {
     //return all users
     getAllUsers(){
        return UserDB.find({});
      }
      //get user email by id
      getEmailById(id){
        return UserDB.findOne({_id:id}, "email");
      }
      getEmailsFromHandleArray(handleArray){
        return UserDB.find({handle:{$in: handleArray}}, "email");
      }

    getUserHandleByHandle(handle){
        return UserDB.findOne({handle: handle}, "handle");
    }
    getAllEmails(){
        return UserDB.find({}, "email");
    }
    getUserByEmail(email){
        return UserDB.find({email:email});     
      }
      checkIfEmailExists(email){
        return UserDB.find({email:email},'email');     
      }
    usersByHandleAutocomplete(searchValue){
        return UserDB.find({
            handle:{$regex: searchValue, $options:"i"}
    
        }, 'handle first_name last_name img').limit(10);
    }
    usersByNameAutocomplete(searchValue){
        if(searchValue.includes(" ")){
            var nameArr = searchValue.split(" ");
            return UserDB.find({
                first_name:{$regex: nameArr[0], $options:"i"},
                last_name:{$regex: nameArr[1], $options:"i"},
            }, 'handle first_name last_name img').limit(10);
        }
        else{
            return UserDB.find({
                first_name:{$regex: searchValue, $options:"i"}
            }, 'handle first_name last_name img').limit(10);
        }
        
    }
      //get user by id
    getUserById(id){
        return UserDB.findOne({_id:id});     
    }
      //get user by handle
      getUserByHandle(handle){
        return UserDB.find({handle:handle});
              
      }
      getUserImgs(handleArray){
        return UserDB.find({handle:{$in: handleArray}});
    }
    getUserImg(handle){
        return UserDB.findOne({handle:handle}, "img");
    }
    //check if entered code matches code saved in DB. If so, update status of account.
    getActivationCode(email){
        return UserDB.findOne({email:email});
    }
    updateStatus(email){
        return UserDB.findOne({email:email}).updateOne({$set:{status: "Active"}}).exec((err,docs)=>{
           
        });
    }
    //update activation code
    updateActivationCode(email, code){
        return UserDB.findOne({email:email}).updateOne({$set:{activationCode: code}}).exec((err,docs)=>{
           
        });
    }
    updatePassword(email, pw){
        return UserDB.findOne({email:email}).updateOne({$set:{password: pw}}).exec((err,docs)=>{
        });
    }
    //register a new user
    addUser(handle, first_name, last_name, school, email, password, img, status, code){
        var user =new UserDB({handle:handle,first_name: first_name, last_name: last_name,
            school: school, email: email, password: password, img: img, activationCode: code,
            theme:'bg-dark', rating:0, status:status, StripeId: "none", CustomerId:"none", notificationCount:0,
             Tutor:false, dateCreated:new Date(), bio:"Tell the world a bit about yourself", active: false} );
        return user.save();
    }
    //add follower function adds a follower to the followers array,
    //and adds the account followed to following array
    addFollow(follower_handle, handle, followerImage, followingImage, callback){
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
    //unfollow a user
    removeFollow(follower_handle, handle, callback){
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
    //check if a user is following another user
    isFollowing(follower_handle, user, student, callback){
        for (var i=0;i<user.followers.length;i++){
            if(follower_handle==user.followers[i].user_handle){
                callback(student,true);
                return;
            }
        }
        callback(student,false);
    }
    //add message thread to user doc
    addThread(host, hostImg, subject, threadId, handle){
        return new Promise((resolve, reject)=>{
            UserDB.findOne({handle:handle}).then((docs)=>{
                if(docs){
                    docs.threads.push({threadId:threadId, host:host, hostImg:hostImg, 
                        subject: subject, unreadCount:0, timestamp: new Date()});
                    docs.save();
                    resolve(docs);
                }
                else{
                    console.log("Handle doesn't match: " + handle);
                }
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }
    //remove message thread from user 
    removeThread(handle, threadId){
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            for(var x = 0; x < docs.threads.length;x++){
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
        UserDB.findOne({handle:userHandle}).exec((err,docs)=>{
            if(docs){
                var index = "";
                for(var x = 0; x < docs.threads.length; x++){
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
      //set unread count to zero and move thread to top of list
      unreadCountToZero(threadId, id, req, res,  messages, formatDate, formatTime, unescapeApostrophe){
            UserDB.findOne({_id:id}).exec((err,docs)=>{
                var tempThread = "";
                for(var x = 0; x < docs.threads.length;x++){
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
                            formatTime:formatTime,
                            unescapeApostrophe: unescapeApostrophe
                        });
                    }
                });
                
            })
        }
    getThreads(id){
        return UserDB.findOne({_id:id},'threads');
    }
    getThreadsByHandle(handle){
        return UserDB.find({handle:handle});
    }
    //change theme of UserProfile
    setTheme(id,theme,req){
        return UserDB.findOne({_id:id}).updateOne({$set:{theme: theme}});
    }
    //when message is sent, related thread should move to top of the list
    moveThread(threadId, handle, senderHandle){
        console.log("ID: "+ threadId)
        console.log(handle)
        return new Promise((resolve, reject) => {
            UserDB.findOne({handle:handle}).exec((err,docs)=>{
                var tempThread = "";
                var index = "";
                for(var x = 0; x< docs.threads.length; x++){
                    if(docs.threads[x].threadId === threadId){
                        tempThread  = docs.threads[x];
                        break;
                    }
                }
                //if threadId was a match, pull then push the thread to move it to the top of the list
                if(tempThread != ""){
                    docs.threads.pull(tempThread);
                    docs.threads.push(tempThread);
                }
               
                //if receiving the message, incremement count
                if(docs.handle != senderHandle && tempThread != ""){
                    tempThread.unreadCount++;
                }
            
                if(index != ""){
                    console.log("unread count: " + docs.threads[index].unreadCount )
                }
                docs.save();
                resolve(true);
            })
        });
    }
   //add stripeId to User Profile
    addStripeId(userId, stripeId){
        return UserDB.findOne({_id:userId}).updateOne({$set:{StripeId: stripeId}});
    }

    //add CustomerId to User Profile
    setCustomerId(userId, customerId){
        return UserDB.findOne({_id:userId}).updateOne({$set:{CustomerId: customerId}});
    }
    //get all users from a given major
    getUsersByMajor(major){
        return UserDB.find({Major:major});
    }
    //add courses to my courses array
    addCourse(handle, course, courseId, courseCode, callback){
        return new Promise((resolve, reject)=>{
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
                    resolve(docs[0])
                }
                else{
                    reject("Course Already Exists");
                }
            })
        })
    }
    //remove course from myCourses list
    removeCourse(handle, courseName){
        UserDB.find({handle: handle}).exec((err,docs)=>{
            var index = "";
            for(var x = 0; x < docs[0].myCourses.length;x++){
                if(docs[0].myCourses[x].courseName === courseName){
                    index = x;
                    docs[0].myCourses.splice(x,1);
                    return docs[0].save();
                    break;
                }
            }
           
        });
    }
    addStudyGroup(handle, groupId, groupName, course){
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].StudyGroups.push({studyGroupId:groupId, studyGroupName:groupName, course:course});
            docs[0].save();
        })
    }
    addMeetup(handle, meetupId, meetupName, date, meetupType){
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].meetups.push({meetupId:meetupId, meetupName:meetupName, meetupDate:date, meetupType: meetupType});
            docs[0].save();
        })
    }
    //increment the user's notification count
    incrementNotificationCount(handle){
        return UserDB.findOne({
                handle: handle
            }).updateOne({
                $inc: {
                notificationCount: +1
                }
         }).exec();
    }
    //clear user's notification count
    clearNotificationCount(handle){
        return UserDB.findOne({
                handle: handle
            }).updateOne({
                $set: {
                notificationCount: 0
                }
         });
    }
    //clear notification count for a given thread
    sawMessage(handle, threadId, res){
        UserDB.findOne({
            handle: handle
        }).then(function(data){
            var threadIndex = -1;
            console.log(data)
            if(data){
                console.log("data exists")
                new Promise((resolve, reject) => {
                    for(var x = 0; x< data.threads.length; x++){
                        if(data.threads[x].threadId ===  threadId){
                            console.log("set to true")
                            threadIndex = x;
                            data.threads[x].seen = true;
                            data.save();
                            resolve(true);
                        }
                    }
                    if(threadIndex === -1){
                        reject(true);
                    }
            })
            .then(function(){
                res.status(202).json({
                    threadURL: "/messages?messageId="+ data.threads[threadIndex].threadId
                }).end();
            })
            .catch(function(){
                res.redirect("/home")
            })
            }
            else{
               res.redirect("/home");
            }
        })
        .catch(function(err){
            console.log(err)
        })
    }
    //set the user's bio
    setBio(handle, bio){
        return UserDB.findOne({
                handle: handle
            }).exec((err, docs)=>{
                docs.bio = bio;
                docs.save();
            });
    }
    updateClass(id, classification){
        return new Promise((resolve, reject)=>{
            UserDB.findOne({
                _id: id
            })
            .then((user)=>{
                user.classification = classification;
                user.save();
                resolve(classification)
            })
            .catch((err)=> {
                reject(err)
            })
        })
        
    }
    //when user creates seller account, make them a 'tutor'
    becomeTutor(handle){
        return UserDB.findOne({
            handle: handle
        }).exec((err, docs)=>{
            docs.Tutor = true;
            docs.save();
        });
    }
    //add a tutoring session to user profile
    addTutoringSession(handle,sessionId, sessionName, date, hostImg, hostHandle, role){
        UserDB.find({handle: handle}).exec((err,docs)=>{
            docs[0].TutoringSessions.push({sessionId:sessionId, sessionName:sessionName, date:date, 
                hostImg: hostImg, hostHandle:hostHandle, role:role, leftReview:false});
            docs[0].save();
        })
    }
    //update leftReview boolean
    //currently this is not being used
    //consider deleting
    leftReview(handle, id){
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
        return UserDB.find({handle:{$in: handleArray}}, "email");
    }
    getEmailByHandle(handle){
        return UserDB.find({handle: handle}, "email");
    }
    //get courses a user belongs to
    getMyCourses(id){
        return UserDB.findOne({_id: id}, "myCourses");
    }
     //get groups a user belongs to
     getMyGroups(id){
        return UserDB.findOne({_id: id}, "StudyGroups");
    }
    //set active tutor
    setActiveTutor(id, value){
        return new Promise((resolve, reject) => {
            UserDB.findOne({_id: id})
            .then(function(data){
                data.ActiveTutor = value;
                data.save();
                resolve(data);
            });
        });
    }
    //addStreamId to a user's account
    //should be added once account is verified
    addStreamId(id, streamId){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id: id})
        .then(function(user){
            user.streamId = streamId;
            user.save();
        })
    }
     //update a user's major
     updateMajor(id, major){
        return UserDB.findOne({_id: id}).updateOne({$set:{Major: major}})
    }
    //set user status to active or inactive
    setUserStatus(id, status){
        return UserDB.findOne({_id: id}, "active")
            .updateOne({
                $set: {
                    active: status
                }
            })
    }
    //get user status to active or inactive
    getUserStatus(handleArray){
        return UserDB.find({
            handle: {$in: handleArray}
        }, "active");
    }
     //get user status to active or inactive
     getGroupsById(userId){
        return UserDB.findOne({
           _id: userId
        }, "StudyGroups");
    }
}
