//Populate My Courses in the left side bar
function filterAddCourseResults(res, searchValue){
    var courses = "";
    if(searchValue.length === 0){
        $(".autocomplete-addCourse").html("<p class='noMatch'>No results</p>");
    }
    else{
            var count = 0;
            for( x in res){
                var courseCode = res[x].Department + " " + res[x].CourseCode; 
                if(res[x].CourseName.toLowerCase().includes(searchValue.toLowerCase())){
                    //limit results to 5
                    if(count < 5){
                        courses+= "<div class='addCourseCountainer'><input type='hidden' name='courseId' value='"+res[x]._id+"'/><p class='addCourseName'>"+res[x].CourseName+"</p><p class='addCourseCode'><span>"+res[x].Department + " " +
                        res[x].CourseCode+"</span><button class='btn btn-primary addBtn'>Add</button></p></div>";
                        count++;
                    }
                }
                else if(courseCode.toLowerCase().includes(searchValue.toLowerCase())){
                   
                    //limit results to 5
                    if(count < 5){
                        courses+= "<div class='addCourseCountainer'><input type='hidden' name='courseId' value='"+res[x]._id+"'/><p class='addCourseName'>"+res[x].CourseName+"</p><p class='addCourseCode'><span>"+res[x].Department + " " +
                        res[x].CourseCode+"</span><button class='btn btn-primary addBtn'>Add</button></p></div>";
                        count++;
                    }
                }
            }
            if(courses === ""){
                return "<p class='noMatch'>No results</p>";
            }
            else{
                return courses;
            }
            
        
    }
    
   
}
//replace space with %20 for popover url
function removeSpace(courseName){
    return courseName.replace(/ /g,"%20");
    
}
//tag course (request a tutor) autocomplete
function filterTagCourseResults(res, searchValue){
    var courses = "";
    if(searchValue.length === 0){
        $(".autocomplete-addCourse").html("<p class='noMatch'>No results</p>");
    }
    else{
            var count = 0;
            for( x in res){
                var courseCode = res[x].Department + " " + res[x].CourseCode; 
                if(res[x].CourseName.toLowerCase().includes(searchValue.toLowerCase())){
                    //limit results to 5
                    if(count < 5){
                        courses+= "<div class='tagCourseCountainer'><input type='hidden' name='courseId' value='"+res[x]._id+"'/><p class='addCourseName'>"+res[x].CourseName+"</p><p class='addCourseCode'><span>"+res[x].Department + " " +
                        res[x].CourseCode+"</span></p></div>";
                        count++;
                    }
                }
                else if(courseCode.toLowerCase().includes(searchValue.toLowerCase())){
                   
                    //limit results to 5
                    if(count < 5){
                        courses+= "<div class='tagCourseCountainer'><input type='hidden' name='courseId' value='"+res[x]._id+"'/><p class='addCourseName'>"+res[x].CourseName+"</p><p class='addCourseCode'><span>"+res[x].Department + " " +
                        res[x].CourseCode+"</span></p></div>";
                        count++;
                    }
                }
            }
            if(courses === ""){
                return "<p class='noMatch'>No results</p>";
            }
            else{
                return courses;
            }
    }
}
$(document).ready(function(){
    $(".input-field-addCourse").on("focus", function(){
        $(this).parent().css("border-bottom","none");
        $(".courseExists").text("");
    })
     $.ajax({
            url: '/API/MyCourses' ,
            method: 'GET',
            error:function(err,str){
               
            }
            }).done(function(res) {
                var courses = "";
        if(res.length == 0){    
            $(".course-wrapper").show();
        }
        for(var x = res.length-1; x >=0; x--){
            courses+='<div class="myCoursesWrapper">'+
            '<a href="/Course/'+res[x].courseName+'"><p class="myCoursesText">'+res[x].courseName+'</p>'+
            '<p class="myCoursesSubText">'+res[x].courseCode+'</p></a>'+
            '  <span type="button" class="dots-btn" data-container="body" data-toggle="popover" data-placement="right" data-content="<ul class=popoverUl><li><a class=askQuestionBtn href=/Course/'+removeSpace(res[x].courseName)+'>Ask a Question</a></li><li><form method=POST class=leaveCourseForm ><input class=courseName type=hidden name=course value='+removeSpace(res[x].courseName)+' /><button class=leaveCourse>Leave</button></form></li></ul>"><img class="dots" src="../assets/img/3dots.svg"/></span>'+
            '</div>';   
        }
        $(".myCourse-container").html(courses);
        $(function () {
            $('[data-toggle="popover"]').popover({
                html : true,
                sanitize:false
            });
          })
                var exists = false;
            $(".autocomplete-addCourse").on("click", ".addBtn", function(e){
                e.preventDefault();
               $(".blocker").hide();
                $(".autocomplete-addCourse").hide();
                for(x in res){
                    if(res[x].courseCode === $(this).prev().text()){
                        exists = true;
                        $(".course-wrapper").css("border-bottom", "1px solid #dc3545");
                        $(".courseExists").text("Course already in your list")
                       
                    }
                }
                payload = {
                    handle:$(".userProfileName ").text(),
                    course:$(this).parent().prev().text(),
                    courseId:$(this).parent().prev().prev().val(), 
                    courseCode:$(this).prev().text(), 
                    exists: exists
                  }
                $.ajax({
                    url: "/addCourse",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                      "Content-Type": "application/json"
                    }, statusCode: {
                      202: function (result) {
                        $(function () {
                            $('[data-toggle="popover"]').popover({
                                html : true,
                                sanitize  : false
                            })
                          })
                        $("#myCourses").prepend('<div class="addMyCoursesWrapper">'+
                        '<a href="/Course/'+result.course+'"><p class="myCoursesText">'+result.course+'</p>'+
                        '<p class="myCoursesText">'+result.code+'</p></a>'+
                        '<div class="courseActions">'+
                        '  <span type="button" class="dots-btn" data-container="body" data-toggle="popover" data-placement="right" data-content="<ul class=popoverUl><li><a class=askQuestionBtn href=/Course/'+removeSpace(result.course)+'>Ask a Question</a></li><li><form method=POST class=leaveCourseForm ><input class=courseName type=hidden name=course value='+removeSpace(result.course)+' /><button class=leaveCourse>Leave</button></form></li></ul>"><img class="dots" src="../assets/img/3dots.svg"/></span>'+
                        '</div></div>');
                        
                      },
                      500: function (result) {
                        alert("500 " + result.responseJSON.err);
                      },
                    },
                  });
          
        })
        
        })
        $(".myCourse-container").html("<p class='loadingCourses'>Loading Courses...</p>");
        $(".input-field-addCourse").on("keyup", function(){
        payload = {
            searchValue:$(".input-field-addCourse").val(),
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
                 var courses = "";
                     if(($(".input-field-addCourse").val() === "")){
                         $(".autocomplete-addCourse").html("<p class='emptySearch'>Search Courses</p>");
                     }
                     else if(result.Courses.length > 0){
                        for(var x = 0; x< 5;x++){
                            courses+= "<div class='addCourseCountainer'><input type='hidden' name='courseId' value='"+result.Courses[x]._id+"'/><p class='addCourseName'>"+result.Courses[x].CourseName+"</p><p class='addCourseCode'><span>"+result.Courses[x].Department + " " +
                            result.Courses[x].CourseCode+"</span><button class='btn btn-primary addBtn'>Add</button></p></div>";
                        } 
                        //tag a course functionality (request a tutor)
                        $(".tagCourse-loading").text("Search Courses")
                        $(".tagCourse").on("keyup", function(){
                            $(".tagCourse-container").html(filterAddCourseResults(res, $(this).val()));
                        })
                        $(".tagCourse-container").on("click",".tagCourseCountainer", function(){
                            $(".tagCourse").val($(this).children().eq(2).children().eq(0).text());
                            $(".tagCourse-wrapper").hide();
                            $(".blocker").hide();
                        })
                         $(".autocomplete-addCourse").html(courses);
                     }
                    
                     else{
                         $(".autocomplete-addCourse").html("<p class='noMatch text-light'>No matching Results</p>");
                     }
             },
             500: function (result) {
                 alert("500 ");
                 console.log(result)
             },
             },
         });
         
        })
    // $.ajax({
    //     url: '/siteWideSearch' ,
    //     method: 'GET',
    //     error:function(err,str){
           
    //     }
    //     }).done(function(res) {
        
    // })
    $(".input-field-addCourse").on("focus", function(){
        $(".blocker").show();
        $(".autocomplete-addCourse").show();
    })
    $(".blocker").on("click", function(){
        $(".autocomplete-addCourse").hide();
        $(".tagCourse-wrapper").hide();
    })

    $(".tagCourse").on("keyup", function(){
        $(".tagCourse-container").show();
        payload = {
            searchValue:$(".tagCourse").val(),
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
                var courses = "";
                if(($(".tagCourse").val() === "")){
                    $(".tagCourse-container").html("<p class='emptySearch text-light'>Search Courses</p>");
                }
                else if(result.Courses.length > 0){
                   var courses = "";
                    for(var x = 0; x<5; x++){
                        courses+= "<div class='courseCountainer1'><p class='courseName1'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                        result.Courses[x].CourseCode+"</p></div>";
                    }
                    $(".tagCourse-container").html(courses);
                }
               
                else{
                    $(".tagCourse-container").html("<p class='noMatch'>No matching Results</p>");
                }
            },
            500: function (result) {
                alert("500 ");
                console.log(result)
            },
            },
        });
    })

    //add course to help request
    $(".tagCourse-container").on("click", ".courseCountainer1",  function(){
        $(".tagCourse-container").hide();
        $(".blocker").hide();
        $(".tagCourse").val($(this).children().eq(1).text());
    })
    //leave course
    $(document).on("click", ".leaveCourse", function(e){
        e.preventDefault();
        payload = {
            handle:$(".userProfileName").text(),
            course:$(this).prev().val().replace(/%20/g," "),
        }
        $.ajax({
            url: "/leaveCourse",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (res) {
                $(".myCoursesText").each(function(x){
                    if($(".myCoursesText").eq(x).text() == res.course){
                        $(".myCoursesText").eq(x).parent().parent().remove();
                        $(".popover").hide();
                    }
                })
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
   })
   //ensure input gets focus
   $(".help-text-container").on("click", function(){
       $(this).children().eq(0).focus();
       $(this).parent().css("border-bottom", "2px solid #3a3b3c");
   })
   //remove error border on focus
   $(".dueDate").on("focus", function(){
    $(this).css("border-bottom", "2px solid #1d1d1d");
   })
   $(".askingPrice").on("focus", function(){
    $(this).parent().css("border-bottom", "2px solid #1d1d1d");
    $(".priceError").text("");
   })
    //request help AJAX POST call
    $(".requestHelpBtn").on("click",  function(e){
        //input field validation
        var submit = true;
        if(parseInt($(".askingPrice").val()) < 5 || $(".askingPrice").val() == ""){
         $(".askingPrice").parent().css("border-bottom", "2px solid #dc3545");
         $(".priceError").text("Enter a price of $5 or greater");
         submit = false;
        }
         if($(".input").text() == ""){
            $(".input").parent().parent().css("border-bottom", "2px solid #dc3545");
            submit = false;
        }
        if($(".dueDate").val() === ""){
            $(".dueDate").css("border-bottom", "2px solid #dc3545");
            submit = false;
        }
        if($("input[name='requestType']:checked").val() === ""){
            submit = false;
        }
        if(submit){
            var anon = false;
            if($("input[name='requestType']:checked").prev().text() === "Post anonymously"){
                anon=true;
            }
            var date = new Date($(".dueDate").val());
            //handle the offset (Eastern Standard only)
            date.setDate(new Date(date.getDate()+ 1));
            
        payload = {
            sendToHandle: "All",
            userHandle:$("input[name='requestType']:checked").val(),
            userName:$("input[name='userName']").val(),
            type: "Help Request",
            userImage:$(".userProfileImg").attr("src"),
            caption:$(".requestHelp").text().trim(),
            date: date,
            name:$("input[name='requestType']").val() + " help request",
            price:parseFloat($(".askingPrice").val()),
            course:$(".tagCourse").val(),
            anonymous: anon

          }
        $.ajax({
            url: "/addHelpRequest",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".request-help-container").html("<div class='helpRequestSuccess'>"+
                "<h3 class='text-light'>Help Request Posted</h3>"+
                "<img class='helpRequestSuccessImg' src='../assets/img/undraw_game_day_ucx9.svg'/>"+
                "<p class='text-light'>You will be notified when people respond to this request.<div>")
                $(".request-help-container").css("height", "250px")
                  $(".helpRequest-body").fadeOut();
                  $(".helpRequestSuccess").fadeIn();
                  
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        }
   })

//show wrapper when tagCourse gains focus
$(".tagCourse").on("focus", function(){
    $(".tagCourse-wrapper").show();
    $(".blocker").show();
})
$(".addCourses").on("click", function(){
    if($(this).children().eq(0).hasClass("bi-plus")){
        $(this).parent().attr("title", "Hide add course input");
        $(this).html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>'+
        '<path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>'+
      '</svg>');
        $(".course-wrapper").show();
    }
    else{
        $(this).parent().attr("title", "Add Courses");
        $(this).html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-plus" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>'+
    '<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>'+
  '</svg>');

    $(".course-wrapper").hide();
    }
   
})
$(".myCourseTitle").on("click", ".hideCourseInput", function(){
    
})

})

