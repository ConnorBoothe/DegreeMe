require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var acceptedBidsDBSchema = new Schema({
    Bidder: {type:String, required:true},
    BidderImg: {type:String, required:true},
    UserHandle: {type:String, required:true},
    Price: {type:Number, required:true},
    DueDate: {type:Date, required:true},
    Description:{type:String, required:true},
    ThreadId:{type:String, required:true},
    TimelineId: {type:String, required:true},
    BidId:{type:String, required:true},
    StripeId: {type:String, required:true},
    Intent: {type:String, required:true},
    fileComplaint: {type:String},
    fileComplaintMessage: {type:String}
}, {collection: 'AcceptedBidsDB'});
module.exports = class Bids {
    //add a new bid
    addAcceptedBid(bidder, bidderImg, userHandle, price, dueDate, description, threadId, timelineId, BidId, StripeId, intent){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        var acceptedBids = new AcceptedBidsDB({
            Bidder:bidder, 
            BidderImg: bidderImg, 
            UserHandle:userHandle,
            Price:price, 
            DueDate:dueDate, 
            Description: description,
            ThreadId: threadId,
            TimelineId:timelineId, 
            BidId: BidId,
            StripeId: StripeId,
            Intent: intent
        });
        return acceptedBids.save();
    }
    //get all accepted bids
    getAll(){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        return AcceptedBidsDB.find()
    }
    //get all payment intents, where Intent != none and due date > date
    getAllIntents(){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        return AcceptedBidsDB.find({
                Intent:{ $ne: "none"},
                DueDate:{ $lt: new Date()}
        }, "Intent");
    }
    //get all user bids
    getAllAcceptedBids(userHandle){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        return AcceptedBidsDB.find({UserHandle: userHandle}).sort({_id:-1});
    }
    getAcceptedBidByById(id){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        return AcceptedBidsDB.findOne({_id: id});
    }
     getUserBids(handle){
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        return AcceptedBidsDB.find({
                $or:[
                    {UserHandle: handle},
                    {Bidder: handle},
                ]
        });
    }
    setIntentToNone(id){
        console.log("running set intent to none")
        var AcceptedBidsDB = mongoose.model('AcceptedBidsDB',acceptedBidsDBSchema);
        AcceptedBidsDB.findOne({
            _id: id
          }).updateOne({
            $set: {
              Intent: "none"
            }
          }).exec();
    }
}