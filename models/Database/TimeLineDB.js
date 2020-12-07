require('dotenv').config();
const mongoose = require("mongoose");
const DiscussionBoardDB = require("./DiscussionBoardDB");
var discussion = new DiscussionBoardDB();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    userHandle: {type:String, required:true},
    userImage: {type:String, required:true},
    comment: {type:String, required:true}
});
var StudyGroupPostSchema = new Schema({
    professor: {type:String, required:true},
    description: {type:String, required:true},
    course: {type:String, required:true},
    groupId: {type:String, required:true}
});
var meetupSchema = new Schema({
    description: {type:String, required:true},
    groupName: {type:String, required:true},
    meetupId: {type:String, required:true}
});

var LikersSchema = new Schema({
    likerHandle: {type:String, required:true}
});
//bid schema
var bidSchema = new Schema({
    biddee: {type:String, required:true},
    bidder: {type:String, required:true},
    price: {type:String, required:true}
}); 
//bid schema
var attachments = new Schema({
    file: {type:String, required:true}
}); 
var timelineDBSchema = new Schema({
    sendToHandle:{type:String, required:true},
    userHandle: {type:String, required:true},
    userName: {type:String, required:true},
    type: {type:String, required:true},
    userImage: {type:String, required:true},
    caption: {type:String, required:true},
    likes: {type:Number, required:true},
    date:{type:Date, required:true},
    likers:[LikersSchema],
    name:{type:String},
    postImage: {type:String},
    comments: [commentSchema],
    commentCount: {type:Number},
    StudyGroupPost: [StudyGroupPostSchema],
    meetupPost: [meetupSchema],
    price:{type:Number}, 
    course:{type:String},
    anonymous:{type:Boolean},
    bids:[bidSchema],
    BidOpen:{type:Boolean},
    professor:{type:String},
    url: {type:String},
    courseCode:{type: String},
    discussionId:{type: String},
    files: [attachments]
}, {collection: 'TimelineDB'});
module.exports = class Timeline {
    //get timeline by handle, and get timeline with sendtoHandle 'All'
    getTimelineByHandle(handle){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.find({
        'sendToHandle': { $in: [
            handle,
            "All"
        ]}
    })
    }
    getTimelineCount(){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        var followingHandles = [];
        for(var x = 0; x < followingList.length; x++){
            followingHandles.push(followingList[x].user_handle.trim().toString());
        }
        followingHandles.push("All");
        return timelineDB.find({
            sendToHandle: { $in: followingHandles
            }
        });
    }
    //get the user's timeline
    getUserTimeline(followingList, blockNumber, req){
        var block = blockNumber * 5;
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        var followingHandles = [];
        for(var x = 0; x < followingList.length; x++){
            followingHandles.push(followingList[x].user_handle.trim().toString());
        }
        followingHandles.push("All");
        followingHandles.push(req.session.handle);
        var length = "";
        timelineDB.find({
            sendToHandle: { $in: followingHandles
            }
        }).then(function(data){
           length = data.length;
        })
        if(block === 0){
            return timelineDB.find({
                sendToHandle: { $in: followingHandles
                }, 
                BidOpen:{$ne:false}
            }).skip(block).sort({"_id":-1}).limit(5);
        }
        if(length < block){
            return timelineDB.find({
                 sendToHandle: { $in: followingHandles
            },
            BidOpen:{$ne:false}

            }).skip(block).sort({"_id":-1}).limit(5);
            }
            else{
                return "";
            }
}
    //get all reviews from DB for testing purposes
    getTimelineById(id){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.find({_id:id});
    }
    getTimelineIdByDiscussionId(discussionId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return new Promise(function(rej ,res){
            timelineDB.findOne({discussionId:discussionId}, "_id discussionId")
            .then(function(data){
                console.log(data)
                if(data != null){
                    discussion.addTimelineId(discussionId, data._id );
                }
              
            })
        }) 
    }
    //same as above, but uses findOne. other function already in use so i cannot change
    getPostById(id){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({_id:id});
    }
    addPost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse, anonymous, professor,description,course, groupId,postImage){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        if(postImage){
            if(type === "Study Group"){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName,type:type,
                    userImage:userImage, caption:caption, postImage:postImage, likes:0, date:date, name:name,
                    StudyGroupPost:[{professor:professor,  description:description, course:course, groupId: groupId}], commentCount:0});
            }
        } else {
            if(type === "Study Group"){
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name,
                StudyGroupPost:[{professor:professor,  description:description, course:course, groupId: groupId}], commentCount:0});
            }
            else if(type === "Help Request"){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                    userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse,
                    anonymous:anonymous,BidOpen:true, commentCount:0
                });
            }
            else if (type === "Tutor Listing" ){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                    userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse, commentCount:0
                });
            }
        }
        return timeline.save();
        
    }
    addTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse,url){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        if (type === "Tutor Listing" ){
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse, url:url, commentCount:0
            });
        }
        return timeline.save();
    }
    addGroupTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, professor, taggedCourse,url){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
      
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name, professor:professor, course: taggedCourse, url:url, commentCount:0
            });
        return timeline.save();
    }
    addStatusPost(sendToHandle,userHandle, userName, type ,userImage,caption,date){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, commentCount:0
            });
        return timeline.save();
    }
    addQuestionPost(sendToHandle,userHandle, userName, type ,userImage,caption,date, attachments, course){
        var files = [];
        for(var i = 0; i < attachments.length; i++){
            files.push({file: attachments[i] })
        }
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, commentCount:0, files: files, course:course
            });
        return timeline.save();
    }
    incrementCommentCount(postId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
            return timelineDB.findOne({
                _id: postId
              }).updateOne({
                $inc: {
                  commentCount: +1
                }
              })
              .then(function(){
                 discussion.incrementCommentCount(postId).exec();
              })
              .catch((err)=>{
                console.log(err)
              })
      
        
    }
    //increment likes
    incrementLikes(postId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({
          _id: postId
        }).updateOne({
          $inc: {
            likes: +1
          }
        });
    }
     //decrement likes
     decrementLikes(postId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({
          _id: postId
        }).updateOne({
          $inc: {
            likes: -1
          }
        });
    }
    //add handle to likers
    addLiker(postId, handle){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        timelineDB.findOne({
          _id: postId
        })
        .then(function(data){
          data.likers.push({likerHandle:handle});
          return data.save();
        });
    }
    removeLiker(postId, handle){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        timelineDB.findOne({_id:postId})
        .then(function(data){
            var indexToRemove = "";
            for(x in data.likers){
                if(data.likers[x].likerHandle == handle){
                    indexToRemove = x;
                }
            }
            data.likers.splice(x,1);
            data.save();
        })
    }
    hasLiked(postId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({
          _id: postId
        });
       
    }
    //add a bid to TimelineDB
    //remove
    addBid(biddee, timelineId, bidder, price){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        timelineDB.findOne({_id: timelineId}).exec((err,docs)=>{
            docs.bids.push({biddee:biddee, bidder:bidder, price:price});
            docs.save();
        })
    }
    // remove
    closeBid(id){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({_id:id}).updateOne({
            $set: {
                BidOpen: false
              }
            })
    }
    //might have to reverse this
    //save timelineId to discussionDB instead. 
    //Then, remove _id by _id should work
    removeDiscussionPost(discussionId){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.deleteOne({discussionId:discussionId});
    }

}