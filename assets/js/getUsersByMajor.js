$(document).ready(function(){
  

   
})

function getFollowing(docs){
    if (docs.length > 1) {
        var numInMajor = 0;
        var students = [];
        new Promise((resolve, reject) => {
          for (x in docs) {
            if (docs[x]._id != req.session.userId) {
              numInMajor++;
              //create tutor objects from DB results
              //constructor(userId,first_name,last_name,school,email,password,img,theme,handle, mySchedule, status, subscription, creditHours, threads, major) {
              var temp = new Student(docs[x]._id, docs[x].first_name, docs[x].last_name, docs[x].school,
                docs[x].email, docs[x].password, docs[x].img, docs[x].theme, docs[x].handle, docs[x].myCourses,
                docs[x].status, docs[x].subscription, null, docs[x].threads, docs[x].Major);
              //console.log("calling isFollowing:"+docs[x].handle);
              users.isFollowing(req.session.handle, docs[x], temp, function (student, folstat) {
                students.push([student, folstat]);
                if (students.length == numInMajor) {
                  resolve(students);
                }
              });
            }
          }
        }).then((students) => {
            return students;
        })
    }
}