require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema; 

var professorSchema = new Schema({
    Professor: {type:String, required:true},
});  
var studentSchema = new Schema({
   Image:{type:String, required:true},
   Handle:{type:String, required:true},
   Name:{type:String, required:true},
   Bio:{type:String},
}); 
var courseDBSchema = new Schema({
    Department: {type:String, required:true},
    CourseCode: {type:String, required:true},
    CourseName: {type:String, required:true},
    studentCount: {type:Number, required:true},
    students: [studentSchema],
    Professors: [professorSchema]
    
}, {collection: 'UNCC_CoursesDB'});
module.exports = class Reviews {
 
   addCourse(Dep, Code, Name){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    var course = new CourseDB({Department:Dep, CourseCode:Code, CourseName:Name, studentCount:0});
    course.save();
   }
   getAllCourses(){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    return CourseDB.find({});
   }
   getCourseAutocomplete(searchValue){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    let regEx = new RegExp("^"+searchValue)
    return CourseDB.find({
        CourseName:{$regex: regEx, $options:"mi"}

    },'Department CourseCode CourseName').limit(10);
   }
   getCourseCodeAutocomplete(searchValue){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    if(searchValue.length > 4){
        return CourseDB.find({
            $and:[
                {Department:{$regex: searchValue.substring(0,3), $options:"i"}},
                {CourseCode:{$regex: searchValue.substring(5), $options:"i"}}
            ]
        }, 'Department CourseCode CourseName').limit(10);
    }
    else{
        return CourseDB.find({
            Department:{$regex: searchValue, $options:"i"},
         
        }).limit(10);
    }
    
   }
   getCourseByName(courseName){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    return CourseDB.find({CourseName:courseName});
   }
   incrementStudents(courseName){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    return CourseDB.findOne({CourseName:courseName}).updateOne({
        $inc: {
            studentCount: +1
        }
      });
   }
   //decrease studentCount when student leaves
   decrementStudents(courseName){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    return CourseDB.findOne({CourseName:courseName}).updateOne({
        $inc: {
            studentCount: -1
        }
      });
   }
   //add student to students array
   addStudent(courseName,image, handle, name, bio){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    CourseDB.findOne({CourseName:courseName}).exec((err,docs)=>{
        docs.students.push({Image:image, Handle:handle, Name:name, Bio:bio})
        docs.save().then(function(){
            CourseDB.findOne({CourseName:courseName}).updateOne({
                $inc: {
                    studentCount: +1
                }
              }).exec();
        })
    })
   }
   //remove student from students array
   removeStudent(handle, courseName){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    CourseDB.findOne({CourseName:courseName}).exec((err,docs)=>{
        var index = -1;
        console.log("LEAVE", docs)
        for(x in docs.students){
            if(docs.students[x].Handle === handle){
                index = x;
            }
        }
        if(index != -1){
            docs.students.splice(index,1);
            docs.save().then(function(){
                //decrement student count
                CourseDB.findOne({CourseName:courseName}).updateOne({
                    $inc: {
                        studentCount: -1
                    }
                  }).exec();
            })
        }
    });
   }
   //update bio in students array
   updateBio(handle, courseName, bio){
    var CourseDB = mongoose.model('UNCC_CoursesDB', courseDBSchema);
    CourseDB.findOne({CourseName:courseName}).exec((err,docs)=>{
        var index = -1;
        for(var x = 0; x < docs.students.length;x++){
            if(docs.students[x].Handle === handle){
                index = x;
            }
        }
        if(index != -1){
            docs.students.Bio = bio;
            docs.save();
        }
        else{
            console.log("User handle not in student list")
        }
    });

   }
    
}