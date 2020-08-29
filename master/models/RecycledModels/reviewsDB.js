var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var reviewsDBSchema = new Schema({
    SenderHandle: {type:String, required:true},
    ReceiverHandle: {type:String, required:true},
    Course: {type:String, required:true},
    Rating: {type:String, required:true},
    Message: {type:String, required:true},
    
}, {collection: 'ReviewsDB'});
module.exports = class Reviews {
    constructor() {
      
    }
    //return connections
    getReviewsByHandle(handle){
        var reviewsDB = mongoose.model('ReviewsDB',reviewsDBSchema);
        return reviewsDB.find({ReceiverHandle:handle});
     
    }
    addReview(sender,receiver,course,rating,message){
        var reviewsDB = mongoose.model('ReviewsDB',reviewsDBSchema);
        return reviewsDB.find({ReceiverHandle:handle}).exec((err,docs)=>{
            
        })
     
    }
    
}