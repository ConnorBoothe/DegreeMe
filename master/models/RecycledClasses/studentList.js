// //This file creates an array of student objects
// var fs = require('fs'); //require fs to read json file
// var Student = require("../classes/Student"); //import the student class
// var Connection = require("../classes/Connection"); //import the connection class
// var userDB = require('../classes/UserDB')
// var studentArray = [];
// var connectionArray = [];

// var UserDB = new userDB();
// var students = UserDB.getStudents();


// //maps students to their connections
// var connectionObj = {};

// //read studentList JSON file
// var obj = fs.readFileSync('./models/json/studentList.json', 'utf8'); //read the json file
// var data = JSON.parse(obj);  //parse json file to data var

// //read connections JSON file
// var obj1 = fs.readFileSync('./models/json/connections.json', 'utf8'); //read the json file
// var data1 = JSON.parse(obj1);

// //create an array of student objects
// for (x in data.students){
//     var temp = new Student(data.students[x].id,data.students[x].name,data.students[x].school, data.students[x].email, 
//         data.students[x].password, data.students[x].img, data.students[x].theme);
//     studentArray.push(temp);
// }
// //create an array of connection objects
// for (x in data1.connections){
//     var temp = new Connection(data1.connections[x].id, data1.connections[x].tutor, data1.connections[x].student,data1.connections[x].class,
//         data1.connections[x].date,  data1.connections[x].time,  data1.connections[x].location);
//     connectionArray.push(temp);
// }

// //create keys
// for (x in connectionArray){
//     connectionObj[connectionArray[x].getStudent()] = [];
// }

// Object.keys(connectionObj).forEach(item => { //Loop through keys
//     for (x in connectionArray) {
//         if (item === connectionArray[x].getStudent()) { //If key equals connection's student, push to the array of that key
//             connectionObj[item].push(connectionArray[x].getTutor()); 
//         }
//     }
// });

// module.exports = {
//     studentArray:studentArray,
//     connectionArray: connectionArray
// }
