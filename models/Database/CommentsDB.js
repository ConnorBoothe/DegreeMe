require('dotenv').config();
const mongoose = require("mongoose");
const timelineDB = require("./TimeLineDB")
var timeline = new timelineDB();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL|| 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    postId:{type:String, required:true},
    commenterHandle:{type:String, required:true},
    commenterImg:{type:String, required:true},
    upvotes:{type:Number, required:true},
    message:{type:String, required:true},
    date:{type:Date, required:true}
    
},  {collection: 'CommentsDB'});

module.exports = class UserProfile {
    getCommentsByPostId(postId){
        var commentsDB = mongoose.model('CommentsDB',commentSchema);
        return commentsDB.find({postId:postId});
    }
    getCommentCount(postId){
        var commentsDB = mongoose.model('CommentsDB',commentSchema);
        return commentsDB.find({postId:postId},'_id');
    }
    addComment(postId, handle, img, message){
        var commentsDB = mongoose.model('CommentsDB',commentSchema);
        var comments = new commentsDB({postId:postId, commenterHandle: handle, commenterImg:img, upvotes:0, message:message, date: new Date()});
        return comments.save();
    }

}