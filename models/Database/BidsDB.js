require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var bidsDBSchema = new Schema({
    Bidder: {type:String, required:true},
    BidderImg: {type:String, required:true},
    Biddee: {type:String, required:true},
    Price: {type:Number, required:true},
    Description:{type:String, required:true},
    TimelineId: {type:String, required:true},
    StripeId: {type:String, required:true},
}, {collection: 'BidsDB'});
module.exports = class Bids {
    //add a new bid
    addBid(bidder, bidderImg, biddee, price, description, timelineId, StripeId){
        var bidsDB = mongoose.model('BidsDB',bidsDBSchema);
        var bids = new bidsDB({Bidder:bidder, 
            BidderImg: bidderImg, 
            Biddee:biddee, 
            Price:price, 
            Description: description,
            TimelineId:timelineId, 
            StripeId:StripeId,
        });
        return bids.save();
    }
    
    //get bids by timelineId
    getBidsByTimelineId(timelineId){
        var bidsDB = mongoose.model('BidsDB',bidsDBSchema);
        return bidsDB.find({TimelineId: timelineId});
    }
    //get bid by id
    getBidById(id){
        var bidsDB = mongoose.model('BidsDB',bidsDBSchema);
        return bidsDB.findOne({_id: id});
    }
}