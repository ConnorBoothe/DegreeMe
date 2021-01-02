require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
//chat schema
var storySchema = new Schema({
    groupId:{type:String, required:true},
    date:{type:Date, required:true},
    text: {type:String},
    image: {type:String},
    duration: {type:Number},
}, {collection: 'Stories'});

//instantaiate streamDB model
const StoryDB = mongoose.model('Stories', storySchema);

module.exports = class Stories {
    //add story
    addStory(groupId, date, duration, text,image){
        console.log("duration: "+duration )
        console.log("text: "+text )

        var story = new StoryDB({groupId: groupId, date:date,  duration: duration,  text: text,
             image:image});
        return story.save();
    }
    //get group story
    getGroupStory(groupId){
        return StoryDB.find({groupId: groupId}).sort({date:1})
    }
    

}