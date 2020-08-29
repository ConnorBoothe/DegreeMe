
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

  var threads = new Schema({
    host:{type:String, required:true},
    hostImg:{type:String, required:true},
    subject:{type:String, required:true},
    unreadCount:{type:Number, required:true},
    timestamp:  {type:Date, required:true}
    },{collection: 'ThreadsDB' });

module.exports = class ThreadsDB {
    addThread(host, hostImg, subject){
        var ThreadsDB = mongoose.model('ThreadsDB',threads);
        var thread = new ThreadsDB({host:host, hostImg:hostImg, subject: subject, unreadCount:0, timestamp:new Date()})
        thread.save();
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
        return UserDB.findOne({_id:id});
    }
    getThreadsByHandle(handle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({handle:handle});
    }
    //when message is sent, related thread should move to top of the list
    moveThread(threadId, handle, senderHandle){
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
}