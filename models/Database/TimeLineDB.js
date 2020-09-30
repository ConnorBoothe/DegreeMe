require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
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
    StudyGroupPost: [StudyGroupPostSchema],
    meetupPost: [meetupSchema],
    price:{type:Number}, 
    course:{type:String},
    anonymous:{type:Boolean},
    bids:[bidSchema],
    BidOpen:{type:Boolean},
    professor:{type:String},
    url: {type:String},
    courseCode:{String}
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
        console.log(followingHandles)
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
    addPost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse, anonymous, professor,description,course, groupId,postImage){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        if(postImage){
            if(type === "Study Group"){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName,type:type,
                    userImage:userImage, caption:caption, postImage:postImage, likes:0, date:date, name:name,
                    StudyGroupPost:[{professor:professor,  description:description, course:course, groupId: groupId}]});
            }
        } else {
            if(type === "Study Group"){
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name,
                StudyGroupPost:[{professor:professor,  description:description, course:course, groupId: groupId}]});
            }
            else if(type === "Help Request"){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                    userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse,
                    anonymous:anonymous,BidOpen:true
                });
            }
            else if (type === "Tutor Listing" ){
                var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                    userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse,
                });
            }
        }
        return timeline.save();
        
    }
    addTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, price, taggedCourse,url){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        if (type === "Tutor Listing" ){
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name, price:price, course: taggedCourse, url:url
            });
        }
        return timeline.save();
    }
    addGroupTimelinePost(sendToHandle,userHandle, userName, type ,userImage,caption,date, name, professor, taggedCourse,url){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
      
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date, name:name, professor:professor, course: taggedCourse, url:url
            });
        return timeline.save();
    }
    addStatusPost(sendToHandle,userHandle, userName, type ,userImage,caption,date){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
            var timeline = new timelineDB({sendToHandle:sendToHandle, userHandle:userHandle, userName:userName, type:type,
                userImage:userImage, caption:caption, likes:0, date:date
            });
        return timeline.save();
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
    addBid(biddee, timelineId, bidder, price){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        timelineDB.findOne({_id: timelineId}).exec((err,docs)=>{
            docs.bids.push({biddee:biddee, bidder:bidder, price:price});
            docs.save();
        })
    }
    closeBid(id){
        var timelineDB = mongoose.model('TimelineDB',timelineDBSchema);
        return timelineDB.findOne({_id:id}).updateOne({
            $set: {
                BidOpen: false
              }
            })
    }

}