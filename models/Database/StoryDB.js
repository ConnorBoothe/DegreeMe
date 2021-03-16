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
    backgroundColor: {type:String, required:true},
    text: {type:String},
    link: {type:String},
    pollText: {type:String},
    text_styles: {type:Array},
    link_styles: {type:Array},
    poll_styles: {type: Array},
    backgroundColor: {type: String},
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
    addPollStory(groupId, userHandle, userImg, date, duration, 
        pollText, question, options, backgroundColor, textColor, 
        textObject, linkObject, poll_styles){
            console.log("Poll Styles", poll_styles)
        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date,  duration: duration,  pollText: pollText,
             poll:{question: question, options: options,
            }, backgroundColor: backgroundColor, textColor: textColor,
            text: textObject.text, text_styles: textObject.text_styles,
            link:linkObject.link, link_styles: linkObject.link_styles,
            poll_styles: poll_styles
        });
        return story.save();
    }
    //add multiple choice
    addMultipleChoiceStory(groupId, userHandle, userImg, date, duration, question, options, correct,
        textColor, textObject, linkObject){
            console.log("duration: ", duration)
            console.log("question: ", question)
            console.log("options: ", options)
        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date, duration: duration, multipleChoice:{question: question, options: options, correct:correct},
             textColor: textColor,
             text: textObject.text, text_styles: textObject.text_styles,
             link:linkObject.link, link_styles: linkObject.link_styles});
        return story.save();
    }
     //add text story
     addTextStory(groupId, userHandle, userImg, date, duration, text, textOffsetTop,
        textOffsetLeft, linkOffsetTop, linkOffsetLeft, linkFontSize,
        textColor, fontSize, backgroundColor, link){
            var textStylesArray = ["margin-top:"+textOffsetTop+"px;", 
            "margin-left:"+textOffsetLeft+"px;", "color:"+textColor+";", "font-size:"+fontSize+ ";"];
            var linkStylesArray = ["margin-top:"+linkOffsetTop+"px;", 
            "margin-left:"+linkOffsetLeft+"px;", "color:"+textColor+";", "font-size:"+linkFontSize+ ";"];
        var story = new StoryDB({groupId: groupId, userHandle: userHandle, userImg: userImg,
            date:date,  duration: duration,  text: text, text_styles: textStylesArray,
            link_styles: linkStylesArray, backgroundColor: backgroundColor, link: link
             });
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
    getNonZeroStories(groupIdList){
        var yesterday = new Date();
        yesterday.setDate(yesterday.getDate()-1);
        return new Promise((resolve, reject)=>{
            StoryDB.find({
                $and: [{ 
                    groupId: { 
                        $in: groupIdList
                    },
                    date: {
                        $gte: yesterday
                      }
                    }]
               
                }, "groupImg")
                    .distinct("groupId")
                .then((groupImgs)=>{
                    resolve(groupImgs)
                })
        })
        

    }
    

}