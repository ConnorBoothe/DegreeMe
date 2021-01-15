
$(document).ready(function(){
    var imageArray = [];
    $(".timeline-wrapper").on("change","#attachment", function(){
        var filename = $("#attachment").val().replace(/C:\\fakepath\\/i, '')
        var acceptImage = validateImage(filename);
        if(acceptImage){
            readURL($(this)[0], imageArray, $(this));
        }
        else{
            $('.toast-body').show();
                setTimeout(function(){
                    $('.toast-body').hide();
                }, 1000)
        }
        console.log(imageArray)
    })
    $(".timeline-wrapper").on("click", ".delete-badge", function(){
        var name = $(this).next().attr("name");
        //remove attachment from array
        removeAttachmentFromArray(name, imageArray);
        //remove attachment from the DOM
        $(this).parent().remove();
    })
    $(".mobile-actions ul li").on("click", function(){
        $(".mobile-actions ul li").removeClass("mobile-actions-bottom-border")
        $(this).addClass("mobile-actions-bottom-border")
        if($(this).attr("class").split(" ")[0] == "findATutor") {
            $(".timeline-wrapper").html('<div class="recentActivity-title"><div class="course-search-container"><div class="course-search-sub-container"><span class="text-light"><svg class="" width="1em" height="1em"'+
            'viewBox="0 0 16 16" class="bi bi-search" fill="white"'+
            'xmlns="http://www.w3.org/2000/svg">'+
                        '<path fill-rule="evenodd"'+
                'd="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />'+
            '<path fill-rule="evenodd"'+
                'd="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />'+
        '</svg>'+

            '<input type="text" name="courseSearch" class="mobile-tutor-search" placeholder="Enter a course" /></span></div></div></div><div class="findTutorMobile-results"></div>'
            );
            $(".mobile-tutor-search").focus();
        }
        else if($(this).attr("class").split(" ")[0] == "recentActivity"){
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
                      console.log(result)
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
        else if($(this).attr("class").split(" ")[0] == "askQuestion") {
            $(".timeline-wrapper").html('<div class="recentActivity-title">'+
            '</div>'+
            '<div class="askQuestion-container"><span class="text-light"><textarea class="askQuestion-textarea" placeholder="Ask the DegreeMe community.."/></textarea></span>'+
            '<ul class="question-tag-list" >'+
            '<li><p class="text-light optional">Required</p><input type="text" class="tagACourse" placeholder="Tag a course"/><div class="findTutorMobile-results"></div></li>'+
            '<li><p class="text-light optional">Optional</p><input type="text" class="tagAGroup" placeholder="Tag a group"/><div class="findTutorMobile-results-group"></div></li>'+
            '</ul>'+
            '<ul class="comments-actions-list">'+
                    '<li class="attachment-li">'+
                        '<div class="image-attachments">'+
                            
                        '</div>'+
                    '</li>'+
                    '<li>'+
                            '<a data-toggle="tooltip" data-placement="top"'+
                                            'title="File Upload">'+
                        '<label id="imageUploadLabel" for="attachment" class=" btn-lg purple-file-upload darken-2 mt-0 float-left">'+
                          '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                            '<path fill-rule="evenodd" d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0H4zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>'+
                          '</svg>'+
                        '</label>'+
                    '</a>'+
                        '<input class="comment-file" id="attachment" name="attachment" type="file" />'+
                        
                    '</li>'+
                    '<li>'+
                        '<input class="btn btn-primary postQuestionBtn" id="comments-button" type="submit" name="" value="Post" />'+
                    '</li>'+
               
                '</ul>');
            $(".askQuestion-textarea").focus();
        }

    })
$(".timeline-wrapper").on("focus",".mobile-tutor-search", function(){
    $(this).parent().parent().css("border-bottom", "2px solid #007bff");
})
$(".timeline-wrapper").on("focusout",".mobile-tutor-search", function(){
    $(this).parent().parent().css("border-bottom", "2px solid #a9a9a9");
})
    //mobile find tutor autocomplete
    $(".timeline-wrapper").on("keyup",".mobile-tutor-search", function(){
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
                    // $(".findTutorMobile-results").hide();
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
             '<span class="text-light find-tutor-course-title">'+courseCode+'</span></div><div class="findTutorMobile-results"></div>'+
            '<div class="tutor-container">';
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
                  "<a href='/room/"+tutor.streamId+"' class='btn btn-primary bookTutor'>Join Room</a></div></div></li>"+
                  "<li class='tutor-details-li'></li>"+
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

    '<span class="text-light"><input type="text" name="courseSearch" class="mobile-tutor-search" placeholder="Enter a course"/></span></div><div class="findTutorMobile-results"></div>'
    
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
                $(".findTutorMobile-results").hide();
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

$(".timeline-wrapper").on("keyup",".tagAGroup", function(){
    $(".findTutorMobile-results-group").show();
    var inputVal = $(this).val();
 $.ajax({
     url: "/userGroups",
     type: 'POST',
     headers: {
     "Content-Type": "application/json"
     }, statusCode: {
     202: function (result) {
         console.log(result.groups.StudyGroups[0])
             if((inputVal === "")){
                $(".findTutorMobile-results-group").hide();
             }
             else if(result.groups.StudyGroups.length > 0){
                var groups = "";
                 for(x in result.groups.StudyGroups){
                     if(result.groups.StudyGroups[x].studyGroupName.includes(inputVal)){
                        groups+= "<div class='courseCountainer'><p class='courseName group-item'>"+result.groups.StudyGroups[x].studyGroupName+"</p></div>";
                     }
                 }
                 $(".findTutorMobile-results-group").html(groups);
             }
            
             else if(result.groups.StudyGroups.length == 0){
                $(".findTutorMobile-results-group").html("<p class='noMatch'>No matching groups</p>");
             }
     },
     500: function (result) {
         alert("500 ");
         console.log(result)
     },
     },
 });
})
$(".timeline-wrapper").on("click", ".postQuestionBtn", function(){
    var course = $(this).parent().parent().prev().children().eq(0).children().eq(1);
    var message = $(this).parent().parent().prev().prev().children().eq(0);
    var filename = $("#attachment").val().replace(/C:\\fakepath\\/i, '')
    var storageRef = firebase.storage().ref("attachments/"+filename);
    var image ="";
    var image = $("#attachment")[0].files[0];
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
  
        storageRef.put(image)
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
                         location.href = "/";
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
         console.log(payload)
        $.ajax({
            url: "/askQuestion",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
            "Content-Type": "application/json"
            }, statusCode: {
            202: function (result) {
                 location.href = "/";
            },
            500: function (result) {
                alert("500 ");
                console.log(result)
            },
            },
        });
    }
})
$(".timeline-wrapper").on("click", ".group-item", function(){
    $(this).parent().parent().prev().val($(this).text())
    $(".findTutorMobile-results-group").hide();
})
//remove red border on focus
$(".timeline-wrapper").on("focus",".askQuestion-textarea", function(){
    $(this).css("border", "0px solid #dc3545")
})
$(".timeline-wrapper").on("focus",".tagACourse", function(){
    $(this).css("border", "0px solid #dc3545")
})
})