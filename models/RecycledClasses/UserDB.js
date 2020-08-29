
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

  var threads = new Schema({
    threadId:{type:String, required:true},
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    subject:{type:String, required:true},
    unreadCount:{type:Number, required:true}
});
var followSchema = new Schema({
    user_handle:{type:String, required:true}
});
var myCoursesSchema = new Schema({
    courseName: {type:String, required:true},
    
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
    threads: [threads], 
    followers:[followSchema], 
    following:[followSchema],
    myCourses: [myCoursesSchema],
    StripeId: {type:String, required:true}
    
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

    getUserByEmail(email){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({email:email});
              
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
            theme:'bg-dark', rating:0, status:status, subscription:subscription, StripeId: "none", Major:major });
        user.save();
    }
    //add follower function adds a follower to the followers array,
    //and adds the account followed to following array
    addFollow(follower_handle, handle,callback){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            //if the user handle exists
            if (docs){
                //add follower to the followers array
                docs.followers.push({user_handle:follower_handle});
                docs.save();
                //add user to following array
                UserDB.findOne({handle:follower_handle}).exec((err,docs1)=>{
                    if (docs1){
                        docs1.following.push({user_handle: handle});
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
                console.log("followHandle does not exists");
                console.log(handle);
                callback(false);
            }
        })
    }
    isFollowing(follower_handle, handle, student, callback){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        UserDB.findOne({handle:follower_handle}).exec((err,docs)=>{
            if (docs){
                for (var i=0;i<docs.following.length;i++){
                    if ((docs.following[i].user_handle)===(handle)){
                        //console.log('following '.concat(handle));
                        callback(student,true);
                        return;
                    }
                }
                //console.log('not following '.concat(handle));
                callback(student,false);
            }else{
                console.log("follower_handle does not exists");
                console.log(follower_handle);
                callback(student,false);
            }
        })
    }

    addThread(host, hostImg, subject, threadId, handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        //console.log("handle:" + handle);
        UserDB.findOne({handle:handle}).exec((err,docs)=>{
            if(docs){
                docs.threads.push({threadId:threadId, host:host, hostImg:hostImg, subject: subject, unreadCount:0});
                docs.save();
            }
            else{
                console.log("Handle doesn't match: " + handle);
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
                        console.log("Unread count updated");
                    }
                }
                console.log("Index: " + index)
                docs.threads[index].unreadCount++;
                docs.save();
            }
            else{
                console.log("Unread count not updated");
            }
        });
    }

      //updates unread count and moves thread to top of list
      unreadCountToZero(threadId, handle, req, res,  messages,  threads){
        console.log("UserDB messages")
          console.log(messages)
            var UserDB = mongoose.model('UserDB',userDBSchema);
            UserDB.findOne({handle:handle}).exec((err,docs)=>{
                var tempThread = "";
                for(x in docs.threads){
                    if(docs.threads[x].threadId === threadId){
                        docs.threads[x].unreadCount = 0;
                        tempThread  = docs.threads[x];
                    }
                }
                tempThread.unreadCount = 0;

                console.log(tempThread)
                docs.save(function(err,docs){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.render('UserLoggedIn/messages', {
                            session: req.session,
                            qs: req.query,
                            messages: messages,
                            threads:threads
                        });
                    }
                });
                
            })
        }
    getThreads(id){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({_id:id});
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
    moveThread(threadId, handle){
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
            tempThread.unreadCount++;
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

    //get all users from a given major
    getUsersByMajor(major){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({Major:major});
    }

}
