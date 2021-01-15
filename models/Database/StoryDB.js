require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
//poll schema
var poll = new Schema({
    question:{type:String, required:true},
    options: {type:Array, required:true},
})
//poll schema
var multipleChoice = new Schema({
    question:{type:String, required:true},
    options: {type:Array, required:true},
    correct:{type:String, required:true}
})
//story schema
var storySchema = new Schema({
    
    groupId:{type:String, required:true},
    userHandle: {type:String, required:true},
    userImg: {type:String, required:true},
    date:{type:Date, required:true},
    text: {type:String},
    image: {type:String},
    poll:[poll],
    multipleChoice:[multipleChoice],
    duration: {type:Number, required:true},
}, {collection: 'Stories'});

//instantaiate streamDB model
const StoryDB = mongoose.model('Stories', storySchema);

module.exports = class Stories {
    //add story
    addImageStory(groupId, userHandle, userImg, date, duration, text,image){

        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date,  duration: duration,  text: text,
             image:image});
        return story.save();
    }
    //add poll story
    addPollStory(groupId, userHandle, userImg, date, duration, text, question, options){
        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date,  duration: duration,  text: text,
             poll:{question: question, options: options}});
        return story.save();
    }
    //add multiple choice
    addMultipleChoiceStory(groupId, userHandle, userImg, date, duration, text, question, options, correct){
        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date,  duration: duration,  text: text,
             multipleChoice:{question: question, options: options, correct:correct}});
        return story.save();
    }
    //get group stories posted in past 24 hrs
    getGroupStory(groupId){
        //get yesterdays date
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        //find stories by groupId, and where date >= (now - 24 hrs)
        return StoryDB.find({
            $and: [{
                date: {
                    $gte: yesterday
                  }
                },
                {groupId: groupId}]
            }
           ).sort({date:1})
    }
    getCorrectAnswerById(id){
        return StoryDB.findOne({_id: id}, "multipleChoice")
    }
    

}