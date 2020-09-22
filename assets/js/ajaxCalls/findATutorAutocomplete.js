//Find a tutor autocomplete
function filterFindATutorResults(res, searchValue){
    var courses = "";
    var count = 0;
    for(x in res.Courses){
        var courseCode = res.Courses[x].Department + " " + res.Courses[x].CourseCode; 
        if(res.Courses[x].CourseName.toLowerCase().includes(searchValue.toLowerCase())){
            //limit results to 10
            if(count < 10){
                courses+= "<div class='courseCountainer-findTutor'><a href='/tutorResults/"+res.Courses[x].CourseName+"'><p class='courseName-findTutor'>"+res.Courses[x].CourseName+"</p><p class='courseCode-findTutor'>"+res.Courses[x].Department + " " +
                res.Courses[x].CourseCode+"</p></a></div>";
                count++;
            }
        }
        if(courseCode.toLowerCase().includes(searchValue.toLowerCase())){
            //limit results to 10
            if(count < 10){
                courses+= "<div class='courseCountainer-findTutor'><a href='/tutorResults/"+res.Courses[x].CourseName+"'><p class='courseName-findTutor'>"+res.Courses[x].CourseName+"</p><p class='courseCode-findTutor'>"+res.Courses[x].Department + " " +
               res.Courses[x].CourseCode+"</p></a></div>";
                count++;
            }
        }
    }
    if(courses === ""){
        return "<p class='noMatch'>No matching Results</p>";
    }
    else{
        return courses;
    }
}
$(document).ready(function(){   

    $("#searchInput").on("focus", function(){
        $(".blocker").show();
        $(".findTutor-autocomplete").show();
        $(".input-container1Light").css({
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        
        })
      
    })
    $(".blocker").on("click", function(){{
        $(".findTutor-autocomplete").hide();
        $(".blocker").hide();
        $(".input-container1Light").css({
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
        
        })

    }})
    $("#searchInput").on("keyup", function(){
    payload = {
        searchValue:$("#searchInput").val(),
        type:"Courses" 
     }
     $.ajax({
         url: "/siteWideSearch",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
                 if(($("#searchInput").val() === "")){
                    $(".autocomplete-status").text("Search Courses");
                 }
                 else if(result.Courses.length > 0){
                    var courses = "";

                    for(x in result.Courses){
                        courses+= "<div class='courseCountainer-findTutor'><a href='/tutorResults/"+result.Courses[x].CourseName+"'><p class='courseName-findTutor'>"+result.Courses[x].CourseName+"</p><p class='courseCode-findTutor'>"+result.Courses[x].Department + " " +
                        result.Courses[x].CourseCode+"</p></a></div>";
                    }
                     $(".findTutor-autocomplete").html(courses);
                 }
                 else{
                    $(".findTutor-autocomplete").html("<p class='noMatch'>No matching Results</p>");
                 }
             
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     });
    })
})