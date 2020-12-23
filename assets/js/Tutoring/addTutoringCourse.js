$(document).ready(function(){
    $(".add-tutoring-input").on("focus", function(){
        $(".tutor-add-autocomplete").show();
        // $(".mobileBlocker").show();
    });
    //add tutoring course autocomplete
 //mobile find tutor autocomplete
 $(".add-tutoring-input").on("keyup", function(){
    var inputVal = $(this).val();
payload = {
    searchValue:$(this).val(),
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
         if(result.type === "Courses"){
             if((inputVal === "")){
                $(".tutor-add-autocomplete").html("<p class='emptySearch'>Search Courses</p>");
             }
             else if(result.Courses.length > 0){
                var courses = "";
                 for( x in result.Courses){
                     courses+= "<div class='courseCountainer add-tutor-course-item'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                     result.Courses[x].CourseCode+"</p></div>";
                 }
                 $(".tutor-add-autocomplete").html(courses);
             }
            
             else if(result.Courses.length == 0){
                $(".tutor-add-autocomplete").html("<p class='noMatch'>No matching Results</p>");
             }
         } 
     },
     500: function (result) {
         alert("500 ");
         console.log(result)
     },
     },
 });
})
$(".modal").on("click", ".add-tutor-course-item", function(){
    $(".add-tutor-courseCode").val($(this).children().eq(1).text())
    $(".add-tutoring-input").val($(this).children().eq(0).text());
    $(".tutor-add-autocomplete").hide();
    $(".blocker").hide();
})
//add tutoring course ajax call for desktop view
$(".modal").on("click", ".add-tutoring-btn", function(e){
    $(".spinner-container1").show();
    var storageRef = firebase.storage().ref("transcripts/"+$("input[name='userId']").val()+"-" +$(".add-tutor-courseCode").val());
    e.preventDefault();
    var metadata = {
        contentType: 'image/jpeg',
    };
    var image = $(".transcript-upload")[0].files[0];
    // console.log(image.src)
    // image = base64ImageToBlob(image.src);
    // console.log(image)
    // var base64 = getDataUrl(image);
    storageRef.put(image, metadata)
    .then(function(){
        storageRef.getDownloadURL().then(function(url) {
            payload = {
                course:$(".add-tutoring-input").val(),
                courseCode:$(".add-tutor-courseCode").val(),
                hourlyRate:$(".add-tutoring-input1").val(),
                transcriptImg:url,
                streamId:""
            }
            $.ajax({
                url: "/addTutorCourse",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                      if(result.status == "success"){
                          $(".spinner-container1").html("<p class='badge badge-success success-msg'>Successfully submitted</p><p class='success-sub-text'>You're application to be a tutor in "+payload.course+" is pending. After reviewing your transcript,"+
                          " we will accept/reject your application.</p>")
                      }
                   console.log(result.status)
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
             })
             .catch(function(err){
                 console.log("ERR: "+err)
             })
    })
    //     task.on("state_changed", function(){
    //     function error(error){
    //         console.log(error)
    //     }
    // })
  
 });
 $(".modal").on("change", ".calendar-checkbox", function(){
    //add timeslot
    if($(this).prop("checked") == true){
      addTimeslot($.session.get("day"), parseInt($(this).val()), $(this).next().next());
    }
    //remove time slot
    else{
      removeTimeslot($.session.get("day"), parseInt($(this).val()), $(this).next().next());
    }
  });
})