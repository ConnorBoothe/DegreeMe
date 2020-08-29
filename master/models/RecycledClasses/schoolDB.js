// var mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
  
// });
// db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// var Schema = mongoose.Schema;
// var classSchema = new Schema({
//     Subject: {type:String},
//     CourseName:{type:String},
// });

// var schoolSchema = new Schema({
//     school: {type:String, required:true},
//     classes:[classSchema]
// }, {collection: 'schoolDB'});

// var schoolsDB = mongoose.model('schoolDB',schoolSchema);
// const fs = require('fs');
// const pdf = require('pdf-parse');
// let dataBuffer = fs.readFileSync('./assets/img/UNCC_Courses_2019_2020.pdf');
 
// // pdf(dataBuffer).then(function(data) {
 
// //     // number of pages
// //     console.log(data.numpages);

// //     // PDF info
// //     console.log(data.info);
  
// //     // PDF text
// //     console.log(data.text); 
        
// // });
// // var request = require('request');
// // var cheerio = require('cheerio');

// // var urls = [];
// // for(var x = 1; x<38;x++){
// //     urls.push("https://catalog.uncc.edu/content.php?catoid=25&catoid=25&navoid=2161&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D="+x+"&filter%5B3%5D="+x+"&filter%5Bcpage%5D="+x+"#acalog_template_course_filter");
// // }
// // console.log(urls)
// // var courses = [];
// // for(x in urls){
// //     request(urls[x], function(err, response, html){
// //     if(!err){
// //         var $ = cheerio.load(html);
// //         var allItems = $("tbody").children();
        
// //         allItems.each(function(index){
// //             if($("tbody").children().eq(index).children().eq(1).children().text() != "" && $("tbody").children().eq(index).children().eq(1).children().text().length <100){
// //                 var abbrFull = $("tbody").children().eq(index).children().eq(1).children().text().split("-");
// //                 for(i in abbrFull){
// //                     courses.push(abbrFull[i].trim());
// //                 }
               
// //             }
            
// //         })
       
// //     }
// //     console.log(courses)
// // })
// // }



// module.exports = class UserDB {

//     constructor() {

//     }
//     //return all students
//     getSchools(){
//       return schoolsDB.find({});  
//     }
//     getStudentById(id){
//         var UserDB = mongoose.model('UserDB',userDBSchema);
//         return UserDB.find({userId:id});
              
//       }
//     //return all message handles
//     getMessageHandles(userHandle){
//         var UserDB = mongoose.model('UserDB',userDBSchema);
//         return UserDB.findOne({handle:userHandle});
        
        
//     }
    
// }