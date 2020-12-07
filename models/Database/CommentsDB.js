require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.setMaxListeners(0)
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    postId:{type:String, required:true},
    commenterHandle:{type:String, required:true},
    commenterImg:{type:String, required:true},
    upvotes:{type:Number, required:true},
    message:{type:String, required:true},
    date:{type:Date, required:true},
    commentCount: {type:Number}
},  {collection: 'CommentsDB'});
var commentsDB = mongoose.model('CommentsDB',commentSchema);
module.exports = class UserProfile {
    getCommentsByPostId(postId){
        return commentsDB.find({postId:postId});
    }
    getCommentCount(postId){
        return commentsDB.find({postId:postId},'_id');
    }
    addComment(postId, handle, img, message){
        var comments = new commentsDB({postId:postId, commenterHandle: handle, commenterImg:img, upvotes:0, message:message, date: new Date()});
        return comments.save();
    }
}