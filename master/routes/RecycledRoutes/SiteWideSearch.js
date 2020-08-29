const express = require('express');
const router = express.Router();
const StudyGroupsDB = require('../../models/Database/StudyGroupsDB');
const CourseDB = require('../../models/Database/UNCC_CoursesDB');
const UserDB = require('../../models/Database/UserDB');
const ListingsDB = require('../../models/Database/ListingsDB');
var StudyGroups = new StudyGroupsDB();
var courseDB = new CourseDB();
var userDB = new UserDB();
var listings = new ListingsDB();
//send list of study groups, courses,users, and tutor listings
// router.get('/API/SiteWideSearch', function(req, res){
//     //add discussion board once DB created
//     StudyGroups.getAllStudyGroups().exec((err,docs)=>{
//         courseDB.getAllCourses().exec((err,docs1)=>{
//             userDB.getAllUsers().exec((err,docs2)=>{
//                 listings.getAllListings().exec((err, docs3)=>{
//                     res.send({StudyGroups: docs, Courses: docs1, Users:docs2, Listings: docs3});
//                 })
//             });
//         });
//     });
// });
module.exports = router;