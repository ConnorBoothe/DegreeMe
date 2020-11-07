
$(document).ready(function(){
    $(".mobile-actions ul li").on("click", function(){
        $(".mobile-actions ul li .mobile-actions-item").removeClass("bg-primary")
        $(this).children().eq(0).addClass("bg-primary");
        // $("#findATutorMobile-wrapper").show();
        if($(this).attr("class") == "findATutor") {
            $(".timeline-wrapper").html('<div class="recentActivity-title"> <svg class="" width="1em" height="1em"'+
            'viewBox="0 0 16 16" class="bi bi-search" fill="white"'+
            'xmlns="http://www.w3.org/2000/svg">'+
                        '<path fill-rule="evenodd"'+
                'd="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />'+
            '<path fill-rule="evenodd"'+
                'd="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />'+
        '</svg>'+

            '<span class="text-light"><input type="text" name="courseSearch" class="mobile-tutor-search" placeholder="Find Help"/></span></div><div class="findTutorMobile-results"></div>'
            );
        }
        else if($(this).attr("class") == "recentActivity"){
            $(".timelineItemsLoaded").text("");
            $.session.set("blockNumber",0);
            
            payload = {
                block: parseInt($.session.get("loadMore")),
                blockNum:parseInt($.session.get("blockNumber"))
            }
          
            $.ajax({
                async: true,
                url: "/loadMore",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(".spinner-container").fadeOut();
                    $(".timeline-wrapper").html(createTimeline(result.newItems, result.stripeId));
                    if(result.newItems.length < 5 && $.session.get("end") == "false"){
                        $.session.set("end", true);
                        $(".timeline").append('<p class="timelineItemsLoaded">All items loaded</p>');
                    }
                  },
                  500: function (result) {
                    alert("500");
                  },
                },
              });
        }
        else if($(this).attr("class") == "askQuestion") {
            $(".timeline-wrapper").html('<div class="recentActivity-title">'+
            '<span class="text-light">Ask a Question</span></div>'+
            '<div class="askQuestion-container"><span class="text-light"><textarea class="askQuestion-textarea" placeholder="Write your question here"/></textarea></span>'+
            '<input type="text" class="tagACourse" placeholder="Tag a course"/><div class="findTutorMobile-results"></div><span class="text-light">Optional</span><input type="text" class="tagAGroup" placeholder="Tag a group"/>'+
            '<p class="text-light attachFile">Attach a file</p><input type="file" class="askQuestion-file"/><br><button class="btn btn-primary postQuestionBtn">Post</button></div>');
        }
    })
$(".timeline-wrapper").on("focus",".mobile-tutor-search", function(){
    $(this).css("border-bottom", "2px solid #007bff");
})
$(".timeline-wrapper").on("focusout",".mobile-tutor-search", function(){
    $(this).css("border-bottom", "2px solid #a9a9a9");
})
    //mobile find tutor autocomplete
    $(".timeline-wrapper").on("keyup",".mobile-tutor-search", function(){
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
             console.log(result)
             if(result.type === "Courses"){
                 if((inputVal === "")){
                    $(".findTutorMobile-results").html("<p class='emptySearch'>Search Courses</p>");
                 }
                 else if(result.Courses.length > 0){
                    var courses = "";
                     for( x in result.Courses){
                         courses+= "<div class='courseCountainer findTutor-course'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                         result.Courses[x].CourseCode+"</p></div>";
                     }
                     $(".findTutorMobile-results").html(courses);
                 }
                
                 else if(result.Courses.length == 0){
                    $(".findTutorMobile-results").html("<p class='noMatch'>No matching Results</p>");
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
$(".timeline-wrapper").on("click", ".findTutor-course", function(){
    var courseCode = $(this).children().eq(1).text()
    payload = {
        course:$(this).children().eq(0).text(),
     }
     $.ajax({
         url: "/getAvailableTutors",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
             console.log("Tutors: " +result.tutors)
             //ajax call to get available tutors for the course entered
             var tutorsAvailable = '<div class="recentActivity-title">'+
             '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="white" xmlns="http://www.w3.org/2000/svg">'+
             '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
             '</svg></span>'+
             '<span class="text-light">'+courseCode+'</span></div><div class="findTutorMobile-results"></div>'+
             '<ul class="mobile-availability">'+
                             '<li class="mobile-available-text">Available</li>'+
                             '<li class="available-selected">Now</li>'+
                             '<li>Today</li>'+
                             '<li>This Week</li>'+
             '</ul><div class="tutor-container">';
             for(var x = 0; x < result.tutors.length; x++){
                 var tutor = result.tutors[x];
                 tutorsAvailable +=
                  "<ul class='tutorList'><div class='tutor-wrapper'>"+
                    "<li><div class='left-container'>"+
                  "<img class='tutor-results-img' src="+tutor.userImg+"/>"+
                  "<p class='tutor-name text-light'>"+tutor.userName+"</p>"+
                 
                  "<div class='stars-container'>";
                    var stars = "";
                  for(var x = 0; x < 5; x++){
                    stars+="<span class='text-warning'>&#9733;</span>";
                  }
                  tutorsAvailable += stars;
                  tutorsAvailable +=
                  "</div></div></li>"+
                  "<li class='tutor-details-li'><div class='rate-container'><p class='text-light'>$"+tutor.hourlyRate+"/hour</p></div><button class='btn btn-primary bookTutor'>Book Tutor</button></li>"+
                  "<br><br></ul>";

             }
             tutorsAvailable += "</div>";
            $(".timeline-wrapper").html(tutorsAvailable);
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     });
    
})
$(".timeline-wrapper").on("click",  ".backToMenu", function(){
    $(".timeline-wrapper").html('<div class="recentActivity-title"> <svg class="" width="1em" height="1em"'+
    'viewBox="0 0 16 16" class="bi bi-search" fill="white"'+
    'xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd"'+
        'd="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />'+
    '<path fill-rule="evenodd"'+
        'd="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />'+
'</svg>'+

    '<span class="text-light"><input type="text" name="courseSearch" class="mobile-tutor-search" placeholder="Find Help"/></span></div><div class="findTutorMobile-results"></div>'
    
    );
});
 //autocomplete for ask question tag a course
 $(".timeline-wrapper").on("keyup",".tagACourse", function(){
    $(".findTutorMobile-results").show();
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
         console.log(result)
         if(result.type === "Courses"){
             if((inputVal === "")){
                $(".findTutorMobile-results").html("<p class='emptySearch'>Search Courses</p>");
             }
             else if(result.Courses.length > 0){
                var courses = "";
                 for( x in result.Courses){
                     courses+= "<div class='courseCountainer tagCourse-item'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                     result.Courses[x].CourseCode+"</p></div>";
                 }
                 $(".findTutorMobile-results").html(courses);
             }
            
             else if(result.Courses.length == 0){
                $(".findTutorMobile-results").html("<p class='noMatch'>No matching Results</p>");
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
//on click event for tag course item
$(".timeline-wrapper").on("click",".tagCourse-item", function(){
    $(this).parent().prev().val($(this).children().eq(0).text());
    $(".findTutorMobile-results").hide();
    // $(".tagACourse").parent().prev().text($(this).children().eq(1).text());
});
$(".timeline-wrapper").on("click", ".postQuestionBtn", function(){
    var course = $(this).prev().prev().prev().prev().prev().prev().prev();
    var message = $(this).prev().prev().prev().prev().prev().prev().prev().prev().children().eq(0);
    var storageRef = firebase.storage().ref("attachments/testAttach.pdf");
    var image ="";
    var metadata = {
        contentType: 'application/pdf',
    };
    var image = $(".askQuestion-file")[0].files[0];
    alert(image)
    //input validation
    if(course.val() == "" || message.val() == "") {

        if(course.val() == ""){
            course.css("border", "1px solid #dc3545")
        }
        if(message.val() == ""){
            message.css("border", "1px solid #dc3545")
        }
    }
   
    else if(image != undefined) {
    storageRef.put(image, metadata)
    .then(function(){
        storageRef.getDownloadURL().then(function(url) {
            payload = {
                message:message.val(),
                course:course.val(),
                image:url
             }
             $.ajax({
                 url: "/askQuestion",
                 type: 'POST',
                 data: JSON.stringify(payload),
                 headers: {
                 "Content-Type": "application/json"
                 }, statusCode: {
                 202: function (result) {
                     console.log(result)
                 },
                 500: function (result) {
                     alert("500 ");
                     console.log(result)
                 },
                 },
             });
        })
    })
    }
    //post question without image
    else {
        payload = {
            message:message.val(),
            course:course.val(),
            image:"none"
         }
        $.ajax({
            url: "/askQuestion",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
            "Content-Type": "application/json"
            }, statusCode: {
            202: function (result) {
                console.log(result)
            },
            500: function (result) {
                alert("500 ");
                console.log(result)
            },
            },
        });
    }
})
//remove red border on focus
$(".timeline-wrapper").on("focus",".askQuestion-textarea", function(){
    $(this).css("border", "0px solid #dc3545")
})
$(".timeline-wrapper").on("focus",".tagACourse", function(){
    $(this).css("border", "0px solid #dc3545")
})
})