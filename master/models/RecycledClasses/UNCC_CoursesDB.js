var mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
  
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    name: {type:String, required:true}
   
}, {collection: 'UNCC_Courses'});

var UNCC_Course = mongoose.model('UNCC_courses',CourseSchema);
 



module.exports = class UNCC_Courses {

    constructor() {

    }
    //return all students
    getSchools(){
      return schoolsDB.find({});  
    }
    getStudentById(id){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.find({userId:id});
              
      }
    //return all message handles
    getMessageHandles(userHandle){
        var UserDB = mongoose.model('UserDB',userDBSchema);
        return UserDB.findOne({handle:userHandle});
        
        
    }
    
}