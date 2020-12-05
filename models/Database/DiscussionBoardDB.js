require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL|| 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var attachments = new Schema({
    file:{type:String, required:true}
    
});
var discussionDBSchema = new Schema({
    userHandle:{type:String, required:true},
    userImg:{type:String, required:true},
    userName:{type:String, required:true},
    anonymous:{type:Boolean, required:true},
    courseName:{type:String, required:true},
    date:{type:Date, required:true},
    post:{type:String, required:true},
    commentCount:{type:Number, required:true},
    timelineId:{type:String},
    attachments:[attachments],
}, {collection: 'DiscussionBoardDB'});
var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);

module.exports = class DiscussionBoard {
    getDiscussionByCourse(courseName){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find({courseName:courseName})
    }
    getAllDiscussions(){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find();
    }
    //get all discussion ids
    getAllDiscussionIds(){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find({},"_id");
    }
    getAllDiscussionById(id){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find({_id:id})
    }
    postDiscussion(userHandle, userName, userImg, anonymous, courseName, date1, post1, attachments, timelineId){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        if(attachments.length > 0){
            var attach = [];
            for(var i = 0; i < attachments.length; i++){
                attach.push({file: attachments[i]});
            }
            var discussion = new discussionDB({userHandle:userHandle, userName:userName, userImg:userImg, anonymous:anonymous, courseName:courseName, 
                date:date1, post:post1, commentCount:0, attachments: attach, timelineId: timelineId});
        }
        else{
            var discussion = new discussionDB({userHandle:userHandle, userName:userName, userImg:userImg, anonymous:anonymous, courseName:courseName, 
                date:date1, post:post1, commentCount:0, timelineId: timelineId});
        }
        return discussion.save();
    }
    //delete doc from discussion board
    deleteQuestion(id){
        return discussionDB.deleteOne({_id:id}).exec();
    }
   
    incrementCommentCount(timelineId){
        return discussionDB.findOne({
            timelineId: timelineId
          }).updateOne({
            $inc: {
              commentCount: +1
            }
    })
}
    //temp function created to add timelineId to all discussion board posts
    addTimelineId(id, timelineId) {
        return discussionDB.findOne({_id: id}).then(function(data){
            data.timelineId = timelineId;
             data.save()
             .then(function(data){
                 console.log(data)
             })
        
        })
         
        
    }
}