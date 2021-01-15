require('dotenv').config();
const mongoose = require("mongoose");
const StoryDB = require("./StoryDB");
const stories = new StoryDB();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

//story response schema
var storyResponseSchema = new Schema({
    storyId:{type:String, required:true},
    userName: {type:String, required:true},
    answer: {type:String, required:true},
    correct: {type:String},
    
}, {collection: 'StoryResponses'});

//instantaiate streamDB model
const StoryResponses = mongoose.model('StoryResponses', storyResponseSchema);

module.exports = class StoryResponse {
    //add multiple choice response
    addMultipleChoiceResponse(storyId, userName, answer){
        return new Promise((resolve, reject)=>{
            stories.getCorrectAnswerById(storyId)
            .then((story)=>{
                
                    var storyResponse = new StoryResponses({storyId: storyId, userName: userName, answer: answer,
                        correct:story.multipleChoice[0].correct});
                    storyResponse.save();
                    resolve({correctAnswer: story.multipleChoice[0].correct, answer: answer, correct: true })
            })
            .catch((err)=>{
                reject(err)
            })
        })
        
      
    }
    addPollResponse(storyId, userName, answer){
        var storyResponse = new StoryResponses({storyId: storyId, userName: userName, answer: answer});
        return storyResponse.save();
    }
    getPollPercentage(storyId, answer){
        return new Promise((resolve, reject)=>{
            StoryResponses.find({storyId: storyId}, "_id")
            .then((responses)=>{
                var totalCount = responses.length;
                StoryResponses.find({
                    $and:[
                        {storyId: storyId},
                        {answer: answer},
                    ]
            }, "_id")
            .then((matchedResponses)=>{
                var matchCount = matchedResponses.length;
                var percentage = (matchCount/totalCount).toFixed(2)*100;
                resolve({matchingAnswer:percentage, other: 100-percentage});
            })
        })
        .catch((err)=>{
            reject(err)
        })
       
    })

    }
    hasResponded(storyId, userName){
       
       return StoryResponses.findOne({
            $and:[
                {storyId: storyId},
                {userName: userName},
            ]
            }, "_id storyId answer correct");

    }

}
