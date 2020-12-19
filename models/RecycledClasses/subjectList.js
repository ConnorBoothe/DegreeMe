// //This file creates an object with key/value pairs, wherein the keys are courses and the values are an array of tutors
// //associated with that subject.
// var fs = require('fs'); //require fs to read json file
// var Tutor = require("./classes/Tutor"); //import the tutor class
// var subjectGroups = {};
// var tutorArray= []; //array of Tutor objects created with the Tutor class
// var subjectArray =[]; //parse Tutor objects and save subjects
// var  schoolArray = []; ////parse Tutor objects and create school list

// var obj = fs.readFileSync('./models/json/tutorList.json', 'utf8'); //read the json file
// var data = JSON.parse(obj);  //parse json file to data var

// //create new Tutor objects from JSON file and push them to array. Return the array
// for(x in data.tutors){ 
//     var temp = new Tutor(data.tutors[x].id,data.tutors[x].name,data.tutors[x].School,data.tutors[x].Category,data.tutors[x].Bio,data.tutors[x].GPA,data.tutors[x].Rating,data.tutors[x].img, data.tutors[x].type);
//     tutorArray.push(temp);
// }

// //This is my 'getConnections' function
// getTutors = function(){
//     return tutorArray;
// }
// var temp ="";
// //get Tutor By ID
// getTutor = function(id){
    
//     for (x in tutorArray){
//         if (id == tutorArray[x].getID()){
//             temp = tutorArray[x];
//         }
        
//     }
//     return temp;
// }

// //Create a subject list array
// var tutorCount = 0;
// for(x in tutorArray){
//     subjectArray.push(tutorArray[x].getSubjects());
//     schoolArray.push(tutorArray[x].getSchool());
//     tutorCount++;
// }

// subjectArray = Array.from(new Set(subjectArray)); //remove duplicates from array
// subjectArray = subjectArray.sort(); //sort array in alphabetical order
// schoolArray = Array.from(new Set(schoolArray)); //remove duplicates from array
// schoolArray = schoolArray.sort(); //sort schools alphabetically
 
// //Create data object that sorts tutors by subject
// for(x in subjectArray){
//     subjectGroups[subjectArray[x]] = []; //add subjects as keys
// }
// //Add tutors to keys
// Object.keys(subjectGroups).forEach(item => { //Loop through keys
//     for (x in tutorArray){ //Loop through tutor array
//         if (item === tutorArray[x].getSubjects()) { //If key equals tutor's subject, push to the array of that key
//             subjectGroups[item].push(tutorArray[x]); 
//         }
//     }
// });

// //get index of Tutor name function
// getIndex = function(name){
//     var index="";
//     for(x in tutorArray){
//         if (name === tutorArray[x].getName()) {
//           index = tutorArray[x];
//         }
//     }
//     if (index === "") {
//         return false;
//     }
//     else {
//         return index;
//     }
// }

// //create an array of schools
// var count = 0;
// getSchools = function() {
//     var refinedArray=[];
//     if(schoolArray[count] === elementArray[count] ){
//         refinedArray.push(schoolArray[count]);
//     }
//     count++; 
// }

// //create array of query string links for schools
// var querySchool = [];
// for (x in schoolArray){
//     querySchool.push(schoolArray[x].split(' ').join('%20'));
// }

// //

// //Export the arrays d
// module.exports = {
//     subjectGroups: subjectGroups,
//     tutorArray: tutorArray,
//     subjectArray: subjectArray,
//     getIndex:getIndex,
//     schoolArray:schoolArray,
//     getSchools: getSchools,
//     getTutors: getTutors,
//     getTutor: getTutor,
//     querySchool:querySchool,
//     tutorCount:tutorCount
// }
