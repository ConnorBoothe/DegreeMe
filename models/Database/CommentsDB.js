require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.setMaxListeners(0)
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var attachments = new Schema({
    file:{type:Array, required:true},
    
});
var commentSchema = new Schema({
    postId:{type:String, required:true},
    commenterHandle:{type:String, required:true},
    commenterImg:{type:String, required:true},
    upvotes:{type:Number, required:true},
    message:{type:String, required:true},
    date:{type:Date, required:true},
    commentCount: {type:Number},
    attachments: [attachments]
},  {collection: 'CommentsDB'});
var commentsDB = mongoose.model('CommentsDB',commentSchema);
module.exports = class UserProfile {
    getCommentsByPostId(postId){
        return commentsDB.find({postId:postId});
    }
    getCommentCount(postId){
        return commentsDB.find({postId:postId},'_id');
    }
    addComment(postId, handle, img, message, attachments){
        //if files are attached
        if(attachments){
            var attachmentsArr = [];
            for(var i = 0; i < attachments.length; i++) {
                attachmentsArr.push({file: attachments[i]});
            }
        }
        
        var comments = new commentsDB({postId:postId, commenterHandle: handle, commenterImg:img, upvotes:0, message:message, date: new Date(), attachments: attachmentsArr});
        return comments.save();
    }
    addYTComment(postId, handle, img, message, attachments, thumbnail, title){
        //if files are attached
        console.log("Running add yt comment")
        if(attachments){
            var attachmentsArr = [];
            for(var i = 0; i < attachments.length; i++) {
                attachmentsArr.push({file: attachments[i][0], 
                thumbnail: thumbnail[i][1], title: title[i][2]
             });
            }
        }
        var comments = new commentsDB({postId:postId, commenterHandle: handle, commenterImg:img, upvotes:0, message:message, date: new Date(), attachments: attachmentsArr});

        return comments.save();
    }
}