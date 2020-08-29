//This file creates an object with key/value pairs, wherein the keys are courses and the values are an array of tutors
//associated with that subject.
var fs = require('fs'); //require fs to read json file
var Tutor = require("./classes/Tutor"); //import the tutor class
var subjectGroups = {};
var tutorArray= []; //array of Tutor objects created with the Tutor class
var subjectArray =[]; //parse Tutor objects and save subjects
var  schoolArray = []; ////parse Tutor objects and create school list

var obj = fs.readFileSync('./models/json/tutorList.json', 'utf8'); //read the json file
var data = JSON.parse(obj);  //parse json file to data var

//create new Tutor objects from JSON file and push them to array. Return the array
for(x in data.tutors){ 
    var temp = new Tutor(data.tutors[x].id,data.tutors[x].name,data.tutors[x].School,data.tutors[x].Category,data.tutors[x].Bio,data.tutors[x].GPA,data.tutors[x].Rating,data.tutors[x].img);
    tutorArray.push(temp);
}

module.exports = class Subject {

  constructor(userId,name,school,email,password,img,theme) {
      this.userId = userId;
      this.name = name;
      this.school = school;
      this.email = email;
      this.password = password;
      this.image = img;
      this.theme =theme;
    }
    //return id
    getId(){
      return this.userId;
    }
    //return name
    getName(){
      return this.name;
    }
    //return school
    getSchool(){
      return this.school;
    }
    //return email
    getEmail(){
      return this.email;
    }
    //return password
    getPassword(){
      return this.password;
    }
    //return img
    getImg(){
      return this.image;
    }
    //return theme
    getTheme(){
      return this.theme;
    }
    
    }
    