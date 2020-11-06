require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL|| 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    commenterHandle:{type:String, required:true},
    commenterImg:{type:String, required:true},
    upvotes:{type:Number, required:true},
    message:{type:String, required:true},
    date:{type:Date, required:true}
    
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
    image:{type:String, required:true},
    comments:[commentSchema],
    
}, {collection: 'DiscussionBoardDB'});

module.exports = class UserProfile {
    getDiscussionByCourse(courseName){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find({courseName:courseName})
    }
    getAllDiscussions(){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find();
    }
    getAllDiscussionById(id){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.find({_id:id});
    }
    postDiscussion(userHandle, userName, userImg, anonymous, courseName, date1, post1, img){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);

        var discussion = new discussionDB({userHandle:userHandle, userName:userName, userImg:userImg, anonymous:anonymous, courseName:courseName, 
            date:date1, post:post1, commentCount:0, image:img});
           return discussion.save();
    }
    deleteQuestion(id){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return discussionDB.deleteOne({_id:id}).exec();
    }
    addComment(id, commenterImg, commenter, message1, date1){
        var discussionDB = mongoose.model('DiscussionBoardDB',discussionDBSchema);
        return new Promise((resolve, reject) => {
        discussionDB.find({_id:id}).exec((err, docs)=>{
  
            docs[0].comments.push({commenterImg:commenterImg, commenterHandle: commenter, upvotes:0, message: message1, date:date1})
            docs[0].commentCount++;
            docs[0].save();
            resolve(docs[0]);
        })
    });
    }
   
    
}