const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
  } = require('express-validator');
const UserDB = require('../../models/Database/UserDB');
const StudyGroupsDB = require('../../models/Database/StudyGroupsDB');
var users = new UserDB();
var StudyGroups = new StudyGroupsDB();
//send list of sorted study groups
router.get('/API/SortedStudyGroups', function(req, res){
    if(req.session.email){
        StudyGroups.getAllStudyGroups().exec((err,docs)=>{
            users.getUserByEmail(req.session.email).exec((err,docs1)=>{
                var myCourses = []
                for(x in docs1[0].myCourses){
                    myCourses.push(docs1[0].myCourses[x].courseCode);
                }
                myCourses = myCourses.sort();
                if(err){
                    res.json("An error occurred.")
                }
                var finalArr = [];
                
                for(x in myCourses){
                    var containsResults = false;
                    var groupsArr = [];
                    var subject = "";
                    subject = myCourses[x];
                    for(i in docs){
                        
                        if(myCourses[x] === docs[i].Subject){
                            containsResults = true;
                            groupsArr.push(docs[i]);
                            
                        }
                    }
                        var obj =[];
                        obj.push(subject);
                        obj.push(groupsArr);
                        finalArr.push(obj);
                    
                }
                res.json(finalArr)
            });
           
        });

       
    }
    else{
        res.json("User not logged in");
    }
      
});
module.exports = router;