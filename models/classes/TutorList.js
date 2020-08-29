
const mongoose = require('mongoose');

const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
var Schema = mongoose.Schema;
var subjectSchema = new Schema({
    class:{type:String, required:true},
    grade: {type:String, required:true},
    type: {type:String, required:true}
})
var tutorDBSchema = new Schema({
    id: {type:Number, required:true},
    name:{type:String, required:true},
    img:{type:String, required:true},
    Category:[subjectSchema],
    GPA:{type:String, required:true},
    Rating:{type:Number, required:true},
    Bio:{type:String, required:true},
    School:{type:String, required:true}
}, {collection: 'TutorDB_1'});
var tutorDB = mongoose.model('TutorDB_1',tutorDBSchema);

module.exports = class Tutor {
    
    constructor() {
      
  
    }
    getTutorDB(){
        var tutorDB = mongoose.model('TutorDB_1',tutorDBSchema);
        return tutorDB;
    }
    getAllTutors(){
        
        return tutorDB.find();
    }
    getTutorList(name){
        return tutorDB.find({name:name});
    }
    createTutor(id, name, category, GPA,Rating,School,type){
        var tutor = new tutorDB({id:id,name:name,img:'assets/img/book-icon.png',Category:category,
            GPA:GPA,Rating:Rating,Bio:'Im Ann and I love to code.',School:School});
        tutor.save();
    }
    deleteSession(id, subjectId,res){
       return tutorDB.findOne({_id:id}).exec((err,docs)=>{
           var index = 0;
           for(x in docs.Category){
            
            if(docs.Category[x]._id == subjectId){
               index=x; 
            }
           }
         
           //docs[0].Category[1].splice(index,1);
           docs.Category.splice(index,1);
           docs.save();
           res.redirect("/MySessions");
            //docs.Category.deleteOne({id:_id})
        });
    }
  }
    