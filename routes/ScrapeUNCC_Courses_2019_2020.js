// console.log("CRAWL")
// const express = require('express');
// const router = express.Router();
// const UNCC_Courses = require("UNCC_CoursesDB")
// var request = require('request');
// var cheerio = require('cheerio');
// var urls = [];

// var UNCC_Course = new UNCC_Courses();
// for(var x = 1; x<38;x++){
//     urls.push("https://catalog.uncc.edu/content.php?catoid=25&catoid=25&navoid=2161&filter%5Bitem_type%5D=3&filter%5Bonly_active%5D="+x+"&filter%5B3%5D="+x+"&filter%5Bcpage%5D="+x+"#acalog_template_course_filter");
// }
// console.log(urls)
// var courses = [];
// var count = 0;
// for(x in urls){
// count++;
//     request(urls[x], function(err, response, html){
//     if(!err){
//         var $ = cheerio.load(html);
//         var allItems = $("tbody").children();
        
//         allItems.each(function(index){
//             if($("tbody").children().eq(index).children().eq(1).children().text() != "" && $("tbody").children().eq(index).children().eq(1).children().text().length <100){
//                 var name = $("tbody").children().eq(index).children().eq(1).children().text();
//                 var course = new UNCC_Course({name:name});
//                 course.save();
//             }
            
//         })
       
//     }
//     console.log(response)
// })
// }
// console.log(count)

// module.exports = router;

// Most RECENT
// var courses = new UNCC_Courses();
// var obj = fs.readFileSync('assets/js/uncc_courses.json', 'utf8'); //read the json file	
// var data = JSON.parse(obj);  //parse json file to data var	
// // console.log(data.courses[200].name)	

// //console.log(trimmedTemp);	
// for( x in data.courses){	
//     var temp = data.courses[x].name.split(/\s-\s/);	

//     var temp1 = temp[0].split(/\s/);	


//         courses.addCourse(temp1[0], temp1[1], temp[1]);
// }	
// courses.getAllCourses().exec((err, docs)=>{	
//     console.log(docs)	
// })