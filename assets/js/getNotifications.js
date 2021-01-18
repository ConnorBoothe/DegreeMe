function orderDays(currDay, dayArray){
   
    var days = [];
    for(var x = 0; x< dayArray.length; x++){
      days.push((dayArray[(x+currDay)%7]))
    }
    return days;
 }
 function staggerDates(stagger){
    var currDate = new Date();
    currDate.setDate(currDate.getDate()+(stagger*7));
  }
  
  function orderDates(stagger){
     var dates = [];
     var datesFinal = [];
     var currDate = new Date();
     currDate.setDate(currDate.getDate()+(stagger*7));
     for(var x = 0; x< 7; x++){
        if( x == 0){
           currDate.setDate(currDate.getDate());
           var prettyDateArr = currDate.toString().split(" ");
            if(prettyDateArr[2].split("")[0] === "0"){
            dates.push(prettyDateArr[1] + " " +prettyDateArr[2].split("")[1] )
          }else{
            dates.push(prettyDateArr[1] + " " +prettyDateArr[2])
          }
        }else{
     
           currDate.setDate(currDate.getDate() +  1);
           var prettyDateArr = currDate.toString().split(" ");
           if(prettyDateArr[2].split("")[0] === "0"){
            dates.push(prettyDateArr[1] + " " +prettyDateArr[2].split("")[1] )
          }else{
            dates.push(prettyDateArr[1] + " " +prettyDateArr[2])
          }
        }
      
     }
     return dates;
  }
  
  function orderTimes(currDay, dayArray){
     
     var days = [];
        for(var x = 0; x< dayArray.length; x++){
  
       days.push(((x+currDay)%7))
     }
     return days;
  }

function generateMobileProfileMenu(){
    var profileHTML = "<div class='displayMobileInfo'></div><div class='mobileProfileMenu'><img class='mobileMenuProfileImg' src='"+$(".userProfileImg").attr("src")+"'/>";
    //if tutor
    profileHTML += 
    "<div class='close-mobile-menu'>"+
    '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-x" fill="white" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'+
    '</svg>'+
    '</div><ul>'+
        "<li class='mobileBalanceLi'><span><h1 class='mobileBalance'>$0.00</h1><span class='sub-balance-text'> Available</span> </span></li>"+
        "<li class='mobileBalanceLi'><span><h1 class='mobileBalance'>$0.00</h1><span class='sub-balance-text'> Pending</span></span></li>"+
    "</ul>"+
    "<div class='mobileProfileMenuBody'>"+
        "<ul class='body-ul'>"+
            "<li class='myCourses'>"+
                '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-bookmark-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd" d="M4 0a2 2 0 0 0-2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4zm4.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.178.178 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.178.178 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.178.178 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.178.178 0 0 1-.134-.098L8.16 4.1z"/>'+
                '</svg>'+
                "<span class='mobileMenuText'>Your Courses</span>"+
            "</li>"+
            "<li class='myGroups'>"+
                '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-people-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>'+
                '</svg>'+
                "<span class='mobileMenuText'>Your Groups</span>"+
            "</li>"+
            "<li>"+
            '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-hourglass-split" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
            '<path fill-rule="evenodd" d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13s-.866-1.299-3-1.48V8.35z"/>'+
            '</svg>'+
            "<span class='mobileMenuText'>Upcoming Tutoring Sessions</span></li>"+
            "<li class='coursesTutoring'>"+
                '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-briefcase-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85v5.65z"/>'+
                '<path fill-rule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v1.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 5.884V4.5zm5-2A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z"/>'+
                '</svg>'+
                "<span class='mobileMenuText'>Courses You're Tutoring In"+
            "</li>"+
            "<li class='mySchedule'>"+
                '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-calendar-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5h16V4H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5z"/>'+
                '</svg>'+
                "<span class='mobileMenuText'>Your Schedule</span>"+
            "</li>"+
            "<li class='myReviews'>"+
                '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                '</svg>'+
                "<span class='mobileMenuText'>Your Reviews</span>"+
            "</li>"+

        "</ul>"+
        "<ul class='bottom-ul-mobile'>"+
            "<li><button class='btn btn-primary'>Customer Support</button></li>"+
            "<li><a href='/logout' class='btn btn-danger'>Logout</a></li>"+
        "</ul>"+
    "</div>";
    profileHTML += "</div>";
    return profileHTML;

}

function formatCourses(courses){
    var courseData = courses.myCourses;
    var courses = "<div class='mobileCourses'><h1>"+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "Your Courses</h1>";
    courses += "<div class='mobile-courses-container'>"+
                    "<ul>";
    for(x in courseData){
        courses += "<li>"+
        '<a href="/course/'+courseData[x].courseName+'"><p class="myCoursesText">'+courseData[x].courseName+'</p>'+
            '<p class="myCoursesSubText">'+courseData[x].courseCode+'</p><span>'+courseData[x].courseCode+'</span></a>'+
        "</li>";
    }
    courses+="</ul></div></div>";
    return courses;
}
function formatCoursesTutoring(courses){
    var courseData = courses;
    var courses = "<div class='mobileCourses'>";
    if(window.innerWidth < 1000) {
        courses +='<h1><span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
        '</svg></span>'+
        "Tutoring Courses</h1>";
    }
    courses += "<div class='mobile-courses-container'>"+
                    "<ul>";
    if(courseData.length > 0 ){
        for(x in courseData){
            courses += "<li>"+
            '<a href="/course/'+courseData[x].course+'"><p class="myCoursesText">'+courseData[x].course+'</p></a>'+
                '<p class="myCoursesSubText">'+courseData[x].courseCode;
                if(!courseData[x].approved){
                    courses +='<span class="badge badge-warning pending-tutor-course"> Pending</span></p>';
                }
                else{
                    courses +='<img class="dots dots-tutor-courses" src="../assets/img/3dots.svg"/><button class="btn btn-danger remove-tutor-course">Remove</button>';
                }
            courses += "<input type='hidden' class='appId' value='"+courseData[x]._id+"'</li>";
        }
    }
    else{
        courses += "<li><h1>You aren't a tutor in any course</h1></li>";
    }
    if(window.innerWidth > 1000){
        courses+="</ul><button class='btn btn-primary add-tutoring-course startGroup' data-toggle='modal' data-target='#tutoringCourseModal'>Add Course</button></div></div>";

    }
    else{
        courses+="</ul><button class='btn btn-primary add-tutoring-course startGroup'>Add Course</button></div></div>";

    }
    return courses;
}
function formatReviews(){
    var reviews = "<div class='mobileCourses'><h1>"+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "Your Reviews</h1></div>";
    return reviews;
}
function formatMobileGroups(groups){
    var groupData = groups.StudyGroups;
    console.log(groupData)
    var groups = "<div class='mobileCourses'><h1>"+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "Your Groups</h1>";
    groups += "<div class='mobile-courses-container'>"+
                    "<ul class='mobileGroupsList'>";
    for(x in groupData){
        groups += "<li>"+
        '<a href="/Group/'+groupData[x].studyGroupId+'">'+groupData[x].studyGroupName+'</a>'+
        "</li>";
    }
    groups+="</ul></div></div>";
    return groups;
}

$(document).ready(function(){
    //show tutor courses on desktop view
    payload = {
        userId:""
    }
    $.ajax({
        url: "/getTutoringCourses",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
              if(result.data.length > 0) {
                $(".tutoring-container").show();
                $(".tutoringCourses").html(formatCoursesTutoring(result.data));

              }
          },
        },
      });
    //close mobile menu
    $("#showNotifications").on("click",".close-mobile-menu", function(){
        $("#showNotifications").hide();
    })
     // show calendar
     $("#showNotifications").on("click",".myReviews",function(){
        $('#showNotifications').html(formatReviews());
    });
    //get my courses and groups on mobile
    $("#showNotifications").on("click",".myCourses",function(){
        payload = {
            userId:$("input[name='userId']").val()
        }
        $.ajax({
            url: "/mobileCourses",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
               
                $(".displayMobileInfo").html(formatCourses(result.courses))
                  $(".displayMobileInfo").show();
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
    $("#showNotifications").on("click",".coursesTutoring",function(){

        payload = {
            userId:""
        }
        $.ajax({
            url: "/getTutoringCourses",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                
                
                    $("#showNotifications").html(formatCoursesTutoring(result.data));

            },
            },
          });
    });
    $("#showNotifications").on("click",".myGroups",function(){
        payload = {
            userId:$("input[name='userId']").val()
        }
        $.ajax({
            url: "/mobileGroups",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
               console.log(result.groups)
                 $(".displayMobileInfo").html(formatMobileGroups(result.groups))
                $(".displayMobileInfo").show();
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
    //go back to mobile menu
    $("#showNotifications").on("click",".backToMenu",function(){
        $('#showNotifications').html(generateMobileProfileMenu());
    });
    $.ajax({
        url: '/API/notificationCount' ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) { 
            if(parseInt(res) === 0){
                $(".bdge").hide(); 
            }
            else{
                $(".bdge").text(res);  
            } 
    });
    //get user settings mobile view
    $(".userProfileImg").on("click", function(){
        if(window.innerWidth < 1000){
            $('#showNotifications').html(generateMobileProfileMenu());
            $('#showNotifications').show();
        }
    })
    $('.bell').on("click",function(){
        payload = {
            handle: $('.userProfileName').text(),
          }
        $.ajax({
            url: "/zeroNotifications",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  //hide badge
                    $(".bdge").hide();
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        if($('#showNotifications').css("display") == "none" && window.innerWidth < 1000){
            $($('#showNotifications').css("margin-top","100vh"));
            $('#showNotifications').show();
            $(".blocker").show();
        }
        else if($('#showNotifications').css("display") == "none"){
            $('#showNotifications').show();
            $(".blocker").show();
        }
        else{
            $('#showNotifications').hide();
        }
    })
    $('.message').on("click",function(){
        
        if($('#showNotifications').css("display") == "none"){
            $(".blocker").show();
        }
    })
    $('.userAccount').on("click",function(){
        if($('#showNotifications').css("display") == "none"){
           
            $(".blocker").show();
        }
    })
    $('.bell').on("click",function(){
        if($('#showNotifications').css("display") == "none"){
            $('#showNotifications').show();
            $(".blocker").show();
        }
        else{
            $('#showNotifications').hide();
        }
    })
    //notifcation bell on hover events
    $('.bell').on("mouseover",function(){
        $('.hint').html($(this).attr('name'))
        //$(this).children().show();
    })
    
    //update notifications on click
$(".mobile-notifications").on("click", function(){
    //if menu is displaying account items, or if it is hidden
    if($("#showNotifications").children().eq(0).text() !== "Notifications" || $("#showNotifications").css("display") == "none"){
        $("#recentNotifications").html("Notifications<div class='close-mobile-menu'>"+
        '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-x" fill="white" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'+
        '</svg>'+
        '</div>');
       
        $('#showNotifications').show();
        $('#showNotifications').css("margin-top","100px");
        $.ajax({
            url: '/API/Notifications' ,
            method: 'GET',
            error:function(err,str){
                alert(err)
            }
            }).done(function(res) {    
                var notifications = "";
                for(var x=0; x < res.length; x++){

                    if(res[x].seen === true){
                        if(res[x].type.includes("Congrats!")){
                            notifications +=  '<a class="notifLink" href='+res[x].url+'><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><div><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></div></li></a>';
                        }
                        else{
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                            '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                             '<button class=" notifLink"><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].name+ ' '+res[x].type+ '</p><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                                }
                    }
                    else{
                        if(res[x].type.includes("Congrats!")){
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                             '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                            '<button class=" notifLink"><div class="blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                        }
                        else{
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                            '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                             '<button class=" notifLink"><div  class=" blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].name+ 'T '+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                        
                        }
                    }
                }
                if(notifications != ""){
                    $("#showNotifications").html("")
                    $("#showNotifications ul").html(notifications)
                }
                else{
                    $("#showNotifications ul").html("<p class='emptyNotifications'>Notifications will display here.</p>")
                }
                
        });
    }
     //hide menu on second click of same item
     else if( $("#recentNotifications").text() == "Notifications" ){
        $('#showNotifications').hide();
        $(".blocker").hide();
    }
})

$(".mobile-message").on("click", function(){
    if($("#recentNotifications").text() !== "Messages" || $("#showNotifications").css("display") == "none"){
        $("#showNotifications").show();
        var messageTitle = 'Messages<div class="close-mobile-menu">'+
        '<svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-x" fill="white" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'+
        '</svg>'+
        '</div><span  type="button" class="startConversation-button" data-toggle="modal" data-target="#exampleModal1"><h4 class="startConversation" >'+
        '<a class="memberImage" data-toggle="tooltip" data-placement="top" title="New Message">'+
        '<span class="addCourses">'+
            '<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-plus" fill="white" xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>'+
                '<path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>'+
            '</svg>'+
        '</span>'+
        '</a>'+
        '</span>';

        $("#recentNotifications").html(messageTitle);
        $.ajax({
            url: '/API/Threads' ,
            method: 'GET',
            error:function(err,str){
                alert(err)
            }
            }).done(function(res) {  
                var threads =  "<form method='POST' action='/seenMsg' class='seenMsg'>" +
                '<div class=" "></div>';
                for(var x=res.length-1; x>=0; x--){
                    if(res[x].unreadCount === 0){
                        threads +=  '<a href=../messages'+res[x].threadId+'><li class=" notifications"><div><div class="blue-dot"></div> <img class="notifImg" src="'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p><p class="text-secondary">'+displayTimeSince(res[x].timestamp)+'</p></div></a></li>';
                    }
                    else{
                        threads +=  
                        '<li class=" notifications"><div>'+
                        "<input type= 'hidden' name='handle' value='"+$(".userProfileName").text()+"'/>"+
                        "<input type= 'hidden' name='threadId' value='"+res[x].threadId+"'/>"+
                       
                         '<button class="sawMessage"><div class="blue-dot bg-primary"></div> <img class="notifImg" src="'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p>'+ "<p class='text-primary'>"+res[x].unreadCount+" unread messages</p>"+'</div></button></li>';
                    }
                }
                threads+= "</form>";
                $("#showNotifications ul").html(threads)
        });
    }
    else{
        $("#showNotifications").hide();
        $(".blocker").hide();
    }
})

    //update notifications on click
    $(".bell").on("click", function(){
        //if menu is displaying account items, or if it is hidden
        if($("#showNotifications").children().eq(0).text() !== "Notifications" || $("#showNotifications").css("display") == "none"){
            $("#recentNotifications").text("Notifications");
            $('#showNotifications').show();
            $.ajax({
                url: '/API/Notifications' ,
                method: 'GET',
                error:function(err,str){
                    alert(err)
                }
                }).done(function(res) {    
                    var notifications = "";
                    for(var x=0; x < res.length; x++){
    
                        if(res[x].seen === true){
                            if(res[x].type.includes("Congrats!")){
                                notifications +=  '<a class="notifLink" href='+res[x].url+'><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><div><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></div></li></a>';
                            }
                            else{
                                if(res[x].type.includes("review")){
                                    notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                                    '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                                     '<button class=" notifLink"><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+ ' '+res[x].type+ '</p><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                        
                                }
                                else{
                                    notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                                    '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                                     '<button class=" notifLink"><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].name+ ' '+res[x].type+ '</p><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                        
                                }
                         }
                        }
                        else{
                            if(res[x].type.includes("Congrats!")){
                                notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                                 '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                                '<button class=" notifLink"><div class="blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                            }
                            else{
                                if(res[x].type.includes("review")){
                                    notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                                    '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                                     '<button class=" notifLink"><div  class=" blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                
                                }
                                else{
                                    notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                                    '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                                     '<button class=" notifLink"><div  class=" blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="'+res[x].img+'"/><p class="notif">'+res[x].name+ ' '+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                
                                }

                               
                            }
                        }
                    }
                    if(notifications != ""){
                        $("#showNotifications ul").html(notifications)
                    }
                    else{
                        $("#showNotifications ul").html("<p class='emptyNotifications'>Notifications will display here.</p>")
                    }
                    
            });
        }
         //hide menu on second click of same item
         else if( $("#recentNotifications").text() == "Notifications" ){
            $('#showNotifications').hide();
            $(".blocker").hide();
        }
    })
//mark notification as seen when clicked
$("#showNotifications").on("submit",".seenNotif", function(e){
    e.preventDefault();
    payload = {
        notifId:$(this).children().eq(1).val(),
        url:$(this).children().eq(0).val()
        
      
      }
    $.ajax({
        url: "/Seen",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
             window.location.href= result.url;
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
})
//mark notification as seen when clicked
$("#showNotifications").on("click",".sawMessage", function(e){
    console.log("data exists")

    payload = {
        threadId:$(this).prev().val(),
        handle:$(this).prev().prev().val()
      }
    $.ajax({
        url: "/SeenMsg",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
              //hide badge if 0 (should be zero)
             window.location.href= result.threadURL;
            
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
    e.preventDefault();


});
//user menu item is clicked
$(".account").on("click", function(){
     //if menu is displaying notifications, or if it is hidden
    if($("#showNotifications").css("display") == "none" || $("#showNotifications").children().eq(0).text() == "Notifications"){
        $("#showNotifications").show();
    }
    //hide on double click
    else if($("#showNotifications").children().eq(0).text() == "Account"){
        $("#showNotifications").hide();
        $(".blocker").hide();
    }
    $("#recentNotifications").text("Account");
    $("#showNotifications ul").html('<ul>'+
        '<a id="" href="/Settings"><li><span class="accountIcon"><svg class="bi bi-gear-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>'+
      '</svg></span><span class="text-light profileMenuTitle">Settings</span></li></a>'+
        '<a id="" href="/user/'+$(".userProfileName").eq(0).text()+'"><li><span class="accountIcon"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
      +'<path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>'
    +'</svg></span><span class="text-light profileMenuTitle">Your Profile</span></li></a>'
    +'<a id="" href="/meetups"><li><span class="accountIcon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">'
    +'<path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>'
  +'</svg>'
  +'</span><span class="text-light profileMenuTitle">History</span></li></a>'+
  '<a id="inviteFriends" data-toggle="modal" data-target="#platformInviteModal"><li><span class="accountIcon"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cursor-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
  '<path fill-rule="evenodd" d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>'+
    '</svg></span><span class="text-light profileMenuTitle">Invite Friends</span></li></a>'+
      '<a href="mailto:degreeme@degreeme.io"><li><span class="accountIcon"><svg class="bi bi-chat-square-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
      +'<path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>'
   +'</svg></span><span class="text-light profileMenuTitle">Customer Support</span></li></a>'+
   '<a id="logout" href="/logout"><li><span class="accountIcon"><svg class="bi bi-exclamation-triangle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
   '<path fill-rule="evenodd" d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>'+
   '<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>'+
 '</svg></span><span class="text-light profileMenuTitle">Log Out</span></li></a>'+
    '</ul>');
});
$(".message").on("click", function(){
    if($("#recentNotifications").text() !== "Messages" || $("#showNotifications").css("display") == "none"){
        $("#showNotifications").show();
        $("#recentNotifications").text("Messages");
        $.ajax({
            url: '/API/Threads' ,
            method: 'GET',
            error:function(err,str){
                alert(err)
            }
            }).done(function(res) {  
                var threads =  "<form method='POST' action='/seenMsg' class='seenMsg'>" +
                '<div class=" "><button  type="button" class="startConversation-button" data-toggle="modal" data-target="#exampleModal1"><h4 class="startConversation" >Start a Conversation</h4></button></div>';
                for(var x=res.length-1; x>=0; x--){
                    if(res[x].unreadCount === 0){
                        threads +=  '<a href=../messages/'+res[x].threadId+'><li class=" notifications"><div><div class="blue-dot"></div> <img class="notifImg" src="'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p><p class="text-secondary">'+displayTimeSince(res[x].timestamp)+'</p></div></a></li>';
                    }
                    else{
                        threads +=  
                        '<li class=" notifications"><div>'+
                        "<input type= 'hidden' name='handle' value='"+$(".userProfileName").text()+"'/>"+
                        "<input type= 'hidden' name='threadId' value='"+res[x].threadId+"'/>"+
                       
                         '<button class="sawMessage"><div class="blue-dot bg-primary"></div> <img class="notifImg" src="'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p>'+ "<p class='text-primary'>"+res[x].unreadCount+" unread messages</p>"+'</div></button></li>';
                    }
                }
                threads+= "</form>";
                $("#showNotifications ul").html(threads)
        });
    }
    else{
        $("#showNotifications").hide();
        $(".blocker").hide();
    }
})
$.ajax({
    url: '/API/Threads' ,
    method: 'GET',
    error:function(err,str){
        alert(err)
    }
    }).done(function(res) {   
        var count = 0;
       for(var x=res.length-1; x>=0; x--){
            count+= res[x].unreadCount;
        }
        if(count > 0){
            $(".bdge1").text(count)
        }
        else{
            $(".bdge1").hide();
        } 
});

//add tutoring course button on click
$("#showNotifications").on("click", ".add-tutoring-course", function(){
    $("#showNotifications").html("<div class='mobileBlocker'></div><div class='mobileCourses'><h1>"+
    '<span class="backToMenu1"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "Add Tutoring Course</h1><div class='add-tutoring-wrapper'><div class='add-tutoring-sub-wrapper'><form class='add-tutoring-form'>"+
    "<p class='add-tutoring-label'>Select a Course</p>"+
    "<div class='input-container-add-tutoring'>"+
    '<span class="icon-add-tutoring"><svg class="" width=".75em" height=".75em"'+
                                        'viewBox="0 0 16 16" class="bi bi-search" fill="white"'+
                                        'xmlns="http://www.w3.org/2000/svg">'+
                                        '<path fill-rule="evenodd"'+
                                            'd="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />'+
                                        '<path fill-rule="evenodd"'+
                                            'd="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />'+
                            '</svg></span>'+
    "<input class='add-tutoring-input' type='text' placeholder='Enter Course'/><div class='tutor-add-autocomplete'></div></div>"+
    "<p class='add-tutoring-label'>Enter Your Hourly Pay Rate</p>"+
    "<div class='input-container-add-tutoring'>"+
    '<span class="icon-add-tutoring"><img class="add-tutoring-dollar" src="../assets/img/dollarWhite.svg"/></span>'+
    "<input name='add-tutor-price' class='add-tutoring-input1' type='text' placeholder='0.00'/></div>"+
    "<input class='add-tutor-courseCode' type='hidden'/>"+
    "<p class='add-tutoring-label'>Upload a screenshot of your transcript</p><input class='transcript-upload' type='file'/><input type='submit' class='btn btn-primary add-tutoring-btn' value='Add Course'/></form>"+
    '<div class="spinner-container1 add-tutor-loading">'+
    '<div class="spinner-border" role="status">'+
        '<span class="sr-only"></span>'+
    '</div>'+
    '<span class="loading-span">Loading</span>'+
'</div>'+
    "</div></div>");
});
$("#showNotifications").on("click",".backToMenu1",function(){
    payload = {
        userId:""
    }
    $.ajax({
        url: "/getTutoringCourses",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
            $("#showNotifications").html(formatCoursesTutoring(result.data));
          },
        },
      });
});
//add tutoring course autocomplete
 //mobile find tutor autocomplete
 $("#showNotifications").on("keyup",".add-tutoring-input", function(){
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
//mobile
//show add tutoring course autocomplete
$("#showNotifications").on("focus",".add-tutoring-input", function(){
    $(".tutor-add-autocomplete").show();
    $(".mobileBlocker").show();
});

// $("#showNotifications").on("focusout",".add-tutoring-input", function(){
//     $(".tutor-add-autocomplete").hide();
// });
//mobile
//select add tutoring course item
$("#showNotifications").on("click", ".add-tutor-course-item", function(){
    $(".add-tutor-courseCode").val($(this).children().eq(1).text())
    $(".add-tutoring-input").val($(this).children().eq(0).text());
    $(".tutor-add-autocomplete").hide();
    $(".blocker").hide();
})
$("#showNotifications").on("click",".mobileBlocker", function(){
    $(".tutor-add-autocomplete").hide();
    $(".mobileBlocker").hide();
})
//add tutoring input desktop




})