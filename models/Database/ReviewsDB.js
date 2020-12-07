require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var reviewsDBSchema = new Schema({
    SenderHandle: {type:String, required:true},
    SenderImg: {type:String, required:true},
    ReceiverHandle: {type:String, required:true},
    Course: {type:String, required:true},
    Rating: {type:String, required:true},
    Message: {type:String, required:true},
    
}, {collection: 'ReviewsDB'});
module.exports = class Reviews {
    
    //get all reviews from DB for testing purposes
    getAllReviews(){
        var reviewsDB = mongoose.model('ReviewsDB',reviewsDBSchema);
        return reviewsDB.find({});
    }
    //return connections
    getReviewsByHandle(handle){
        var reviewsDB = mongoose.model('ReviewsDB',reviewsDBSchema);
        return reviewsDB.find({ReceiverHandle:handle});
     
    }
    addReview(sender, senderImg, receiver, course, rating, message){
        var reviewsDB = mongoose.model('ReviewsDB',reviewsDBSchema);
        var reviews = new reviewsDB({SenderHandle:sender, SenderImg: senderImg, ReceiverHandle:receiver, Course:course, Rating:rating, Message:message});
        return reviews.save();
        // return reviewsDB.find({ReceiverHandle:receiver}).exec((err,docs)=>{
            
        // })
     
    }
    
}