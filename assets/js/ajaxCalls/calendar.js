//course autocomplete functionality
function filterResults1(res, searchValue){
    var courses = "";
    if(searchValue.length === 0){
        $('.course-autocomplete ul').html('<h3 class="loading-courses">Search Course by Title or Name</h3>');
    }
    else{
            var count = 0;
            for( x in res.Courses){
                var courseCode = res.Courses[x].Department + " " + res.Courses[x].CourseCode;
                if(res.Courses[x].CourseName.toLowerCase().includes(searchValue.toLowerCase())){
                  
                    //limit results to 10
                    if(count < 10){
                        courses+= "<li><p class='courseName'>"+res.Courses[x].Department + " " +
                        res.Courses[x].CourseCode+ " - " + res.Courses[x].CourseName+"</p></li>";
                        count++;
                    }
                }
                if(courseCode.toLowerCase().includes(searchValue.toLowerCase())){
                    //limit results to 10
                    if(count < 10){
                        courses+= "<li><p class='courseName'>"+res.Courses[x].Department + " " +
                        res.Courses[x].CourseCode+ " - " + res.Courses[x].CourseName+"</p></li>";
                        count++;
                    }
                }
            }
            return courses;
    }
}

function addToSessionSchedule(timeslot, calendarNumber) {
    if ($.session.get('schedule'+calendarNumber)) {
        var tempArr = $.session.get('schedule'+calendarNumber).split(",");
        tempArr.push(timeslot);
        $.session.set('schedule'+calendarNumber, tempArr)
      
    } else {
        $.session.set('schedule'+calendarNumber, [timeslot])
    }

}
//add time selection
function addTimeSelection(selector) {
   
    var index = parseInt(selector.next().val().split("-")[1] - new Date().getDay());
    //Array holds DOM representation of subsequent items in the column
    var duration = Math.ceil($.session.get('duration'));
    var timeOverLap = false;
    for (var x = 0; x < duration; x++) {
        var hasClass = "";
        switch(x){
            case 0:
                hasClass = selector.parent().hasClass("bg-primary");
                break;
            case 1:
                hasClass = selector.parent().parent().next().children().eq(index).hasClass("bg-primary");
                break;
            case 2:
                hasClass = selector.parent().parent().next().next().children().eq(index).hasClass("bg-primary");
                break;
            case 3:
                hasClass = selector.parent().parent().next().next().next().children().eq(index).hasClass("bg-primary");
                break;
            case 4:
                hasClass = selector.parent().parent().next().next().next().next().children().eq(index).hasClass("bg-primary");
                break;
        }
        if(hasClass){
            timeOverLap = true;
        }
    }
    if(!timeOverLap){
        for (var x = 0; x < duration; x++) {
            switch(x){
                case 0:
                    selector.parent().addClass("bg-primary");
                    break;
                case 1:
                    selector.parent().parent().next().children().eq(index).addClass("bg-primary");
                    selector.parent().parent().next().children().eq(index).children().eq(0).css("display","none");
                    break;
                case 2:
                    selector.parent().parent().next().next().children().eq(index).addClass("bg-primary");
                    selector.parent().parent().next().next().children().eq(index).children().eq(0).css("display","none");
                    break;
                case 3:
                    selector.parent().parent().next().next().next().children().eq(index).addClass("bg-primary");
                    selector.parent().parent().next().next().next().children().eq(index).children().eq(0).css("display","none");
                    break;
                case 4:
                    selector.parent().parent().next().next().next().next().children().eq(index).addClass("bg-primary");
                    selector.parent().parent().next().next().next().next().children().eq(index).children().eq(0).css("display","none");
                    break;
                }
        }
        var startTimeArr = selector.next().val().split("-");
        var labelArr = createLabel(startTimeArr);
        var timeLabel = "<span class='calendarDay'>" + startTimeArr[1] + " </span>" + formatLabel(labelArr[0], labelArr[1]);
        var timeRange = formatRangeWithDay(labelArr[0], labelArr[1], startTimeArr[1]);
        var calendarNumberArray = selector.parent().parent().parent().parent().parent().attr("id").split("");
        var calendarNumber = calendarNumberArray[calendarNumberArray.length-1];
        addToSessionSchedule(timeRange, parseInt(calendarNumber));

        if (selector.parent().children().eq(0).children().eq(0).css("display") === "block") {
            selector.parent().children().eq(1).html(timeLabel);
            selector.children().eq(1).html(timeLabel);
            selector.children().eq(1).show();
            selector.children().eq(0).hide();
        }
    }
    else{
        $(".toast-body").text("Error: Time overlap")
        $('.toast').toast("show",{
            autohide: false
        });
    }
}
//delete timeslot from session array
function deleteSessionFromSchedule(timeslotToRemove, calendarNumber) {
    var tempArr = $.session.get('schedule'+calendarNumber).split(",");
    if (tempArr.length === 1) {
        $.session.remove('schedule'+calendarNumber); //if only one item in schedule, remove session var
    } else {
        tempArr.splice(tempArr.indexOf(timeslotToRemove), 1); //delete the item in array where index = that of timeSlotToRemove
        $.session.set('schedule'+calendarNumber, tempArr)
    }
}
//remove time selection from calendar
function deleteTimeSelection(selector) {
        var timeRange = selector.children().eq(1).text();
        var calendarNumberArray = selector.parent().parent().parent().parent().parent().attr("id").split("");
        var calendarNumber = calendarNumberArray[calendarNumberArray.length-1];
        deleteSessionFromSchedule(timeRange, calendarNumber);
        selector.children().eq(0).show();
        selector.children().eq(1).html("");
        //get the index of the column to loop to
        var index = parseInt(timeRange.split("")[0] - new Date().getDay());
        //Remove all time cells within duration
        var duration = parseInt($.session.get('duration'));
        for (var x = 0; x < duration; x++) {
            switch(x){
                case 0:
                    selector.parent().removeClass('bg-primary');;
                    break;
                case 1:
                    selector.parent().parent().next().next().children().eq(index).children().eq(0).show();
                    selector.parent().parent().next().children().eq(index).removeClass('bg-primary');
                    selector.parent().parent().next().children().eq(index).children().eq(0).show();
                    break;
                case 2:
                    selector.parent().parent().next().next().children().eq(index).removeClass('bg-primary');
                    selector.parent().parent().next().next().children().eq(1).children().eq(0).show();
                    break;
                case 3:
                    selector.parent().parent().next().next().next().children().eq(index).removeClass('bg-primary');
                    selector.parent().parent().next().next().next().children().eq(index).children().eq(0).show();
                    break;
                case 4:
                    selector.parent().parent().next().next().next().next().children().eq(index).removeClass('bg-primary');
                    selector.parent().parent().next().next().next().next().children().eq(index).children().eq(0).show();
                    break;
            }
            //parse(removeNextArr[x]);
        }
}
function resetCalendar(selector) {
    $.session.remove('schedule');
    $(selector).change(function () {
        $(".calendarContainer table tr td").removeClass("bg-primary");
        $(".calendarContainer table tr td label").css("display", "block");
        $(".newTime").hide();
        $(".timeLabel").show();
        $(".deleteTime").hide();
        //reset session duration variable
        $.session.set('duration', Math.ceil($(this).val()));
    });
}
//create label to be inserted into the calendar upon user selection
function formatLabel(startTime, endTime) {
    return startTime + " - " + endTime;
}
//create range values to be saved to the session and submitted to DB
function formatRangeWithDay(startTime, endTime, day) {
    return day + " " + startTime + " - " + endTime;
}
function createLabel(startTimeArr) {
    var startTime = parseInt(startTimeArr[0]); //save start time as integer
    var newStartTime = startTime % 12; //perform modulus 12 to get accurate time
    var endTime = startTime + parseInt($.session.get('duration')); //calc end time
    var newEndTime = endTime % 12; //perform modulus 12 to get accurate end time
    //if military start time is less than 12
    if (startTime < 12) {
        newStartTime = newStartTime + " AM";
        if (endTime < 12) {
            newEndTime = newEndTime + " AM";
        } else if (newEndTime === 0) {
            newEndTime = 12 + " PM";
        } else {
            newEndTime = newEndTime + " PM";
        }
    } else {
        if (startTime === 12) {
            newStartTime = 12 + " PM";
        } else if (startTime === 24) {
            newStartTime = 12 + " AM";
        } else {
            newStartTime = newStartTime + " PM";
        }
        if (endTime < 12) {
            newEndTime = newEndTime + "AM";
        } else if (newEndTime === 0) {

            newEndTime = 12 + " AM";
        } else {
            if (endTime < 12 || endTime > 24) {
                newEndTime = newEndTime + " AM";
            } else {
                newEndTime = newEndTime + " PM";
            }
        }
    }
    return [newStartTime, newEndTime];
}
function createSchedule(){
    var fourWeekSchedule = [];
    for(var i = 0; i < 4; i ++){
        if($.session.get("schedule"+i)){
        var scheduleArr = $.session.get("schedule"+i).split(",");
        // var finalSchedule = [];
        var today = new Date().toString().split(" ");
        var monthDayYear = today[1] + " " + today[2] + ", " + today[3];
        for (x in scheduleArr) {
            //get number representation of day of the week
            var day = parseInt(scheduleArr[x].split(/ (.+)/)[0])+ (7*i);
            var timeSlot = scheduleArr[x].split(/ (.+)/)[1];
            var timeSlotArr = timeSlot.split(" ");
            if(timeSlotArr[1] === "PM"){
                var time = parseInt(timeSlotArr[0]) +12;
                time = time + ":00:00";
                var finalDate = new Date(monthDayYear + " " + time);
            }
            else{
                var time = parseInt(timeSlotArr[0]);
                time = time + ":00:00";
                var finalDate = new Date(monthDayYear + " " + time);
            }
            var currDay = finalDate.getDay();
        if(parseInt(currDay) === parseInt(day)){
            finalDate.setDate(finalDate.getDate());
            fourWeekSchedule.push(finalDate);
        }
        else if(parseInt(currDay) < parseInt(day)){
            finalDate.setDate(finalDate.getDate() + (parseInt(day) - parseInt(currDay)))
            fourWeekSchedule.push(finalDate);

        }
        else if(parseInt(currDay) > parseInt(day)){
            finalDate.setDate(finalDate.getDate() + ((7 - parseInt(currDay)+ (parseInt(day)))))
            fourWeekSchedule.push(finalDate);
        }
        }
        }
    }
    return fourWeekSchedule;
}
function createExpiration(expiration){
    var expirationDate = new Date();
    if(expiration == 0){
        expirationDate = null;
    }
    else if (expiration == 28){
        expirationDate.setMonth(expirationDate.getMonth() + 1);
    }
    else{
        expirationDate.setDate(expirationDate.getDate() + expiration);
    }
    return expirationDate;
}
function sendListing(button) {
    $(button).on("click", function (e) {
        e.preventDefault();
        var errors = validateInputFields()
        var fourWeekSchedule = createSchedule();
       
        
        var virtual = "";
        for(var x = 0; x < 2; x++){
            if($(".listingTypeItem1").eq(x).hasClass("badge-primary")){
                virtual = $(".listingTypeItem1").eq(x).text();
              }
        }
        // alert(virtual)
       var expiration = parseInt($(".expiration").val());
        for(var x = 0; x < 2; x++){
            if($(".listingTypeItem").eq(x).hasClass("badge-primary")){
              type = $(".listingTypeItem").eq(x).text();
            }
        }
        if(!errors){
            var userId = $("#userId").val();
            var handle = $("#handle").val();
            var courseName = $("#courseName").val().trim();
            var courseCode =  $(".thisCourse").val();
            var grade = $("#grade").val();
            var hourlyRate = $("#hourlyRate").val();
            var school = $("#schoolSignUp").val();
            var building = $("#building").val();
            var room = $("#room").val();
            var maxStudents = $("#maxStudents").val();
            var image = $("#image").val();
            var duration = $.session.get("duration");
            var name = $("#name").val();
            var expiration = expiration *7;
            var startDate = new Date();
            var expirationDate = createExpiration(expiration)
        
            payload = {
                userId:userId,
                handle: handle,
                name:name,
                courseName: courseName,
                courseCode: courseCode,
                grade: grade,
                hourlyRate: hourlyRate,
                duration:duration,
                school: school,
                building: building,
                room:room,
                maxStudents: maxStudents,
                startDate: startDate,
                expirationDate: expirationDate,
                type:type,
                image:image,
                schedule: fourWeekSchedule,
                virtual:virtual
            }
            $.ajax({
                url: "/createSession",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                      listingAdded();
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
        
        }
        
    })
}
 function listingAdded() {
    $("#signUpWrapper").fadeOut();
    setTimeout( function(){
        $(".listingSuccess").fadeIn();
    },1000)
}
function validateInputFields(){
    var errors = false;

    if($("#courseName").val().length === 0){
        $("#courseName").css("border-bottom", "2px solid #dc3545");
        $("#courseNameTxt").text("Select a course")
        errors = true;
    }
    if(parseInt($("#hourlyRate").val()) < 5){
        $("#hourlyRateTxt").text("$5 minimum")
        $("#hourlyRate").parent().parent().css("border-bottom", "2px solid #dc3545");
        errors = true;
    }
    var virtual = "";
    for(var x = 0; x < 2; x++){
        if($(".listingTypeItem1").eq(x).hasClass("badge-primary")){
            virtual = $(".listingTypeItem1").eq(x).text();
          }
    }
    if(virtual === "Physical Location"){
        if($("#building").val() === ""){
            $("#buildingErr").text("Enter a building")
            $("#building").css("border-bottom", "2px solid #dc3545");
            errors = true;
        }
        if($("#room").val() === ""){
            $("#roomErr").text("Enter a room")
            $("#room").css("border-bottom", "2px solid #dc3545");
            errors = true;
        }
    }
    
    if(parseInt($("#maxStudents").val()) < 1){
        $("#maxTxt").text("Max students can't be zero")
        $("#maxStudents").parent().parent().css("border-bottom", "2px solid #dc3545");
        errors = true;
    }
    if(parseInt($("#duration").val()) < 1){
        $("#duration").parent().parent().css("border-bottom", "2px solid #dc3545");
        errors = true;
    }
    if(!$.session.get("schedule0") && !$.session.get("schedule1") && !$.session.get("schedule2") && !$.session.get("schedule3")){
        $(".scheduleErr").show();
        errors = true;
    }
    if($("#grade").val() === "Select Your Grade"){
        $(".gradeErr").show();
        errors = true;
    }
    if($(".expiration").val() === "0"){
        $(".expirationErr").show();
        errors = true;
    }
    if(!$(".terms").prop("checked")){
        errors = true;
        $(".termsMsg").css("color", "#dc3545");
    }
    if($("#courseNameTxt").text()!= ""){
        errors = true;
        alert("COURSE DOESNT EXIST")
    }
    alert(errors)
    if(errors){
        $(".listingErrMsg").text("Errors exist in the form. Correct them and re-submit")
    }
    return errors;
    
}
$(document).ready(function () {
    $("#courseName").on("focusout", function(){
        payload = {
            searchValue: $("#courseName").val(),
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
                     if(($("#courseName").val() === "")){
                         $("#courseName").css("border-bottom","2px solid #dc3545");
                     }
                     else if(result.Courses.length > 0 || result.Courses.length === 0){
                        $("#courseName").css("border-bottom","2px solid #dc3545");
                        $("#courseNameTxt").text("Course not found. If this is a mistake on our end, let us know!");
                       
                     }
                     else{

                     }
                    
             },
             500: function (result) {
                 alert("500 ");
                 console.log(result)
             },
             },
         });
        });
    $.session.remove('schedule0');
        $.session.remove('schedule1');
        $.session.remove('schedule2');
        $.session.remove('schedule3');
    if(window.location.href.includes("editListing")){
        $.session.set('duration', parseInt($("#duration").val()));
    }
    else{
        $.session.set('duration', 1);
    }
    //initialize bootstrap toast
    $('.toast').toast();
    resetCalendar($("#duration"));
    $(".calendarContainer table tr td label").on("click", function () {
     if($(this).parent().hasClass("bg-primary")){
        deleteTimeSelection($(this)); //delete time selection
     }
     else if($(this).parent().hasClass("bg-secondary")){
         $(".toast-body").text("Error: Time has passed")
        $('.toast').toast("show",{
            autohide: false
        });
     }
     else{
       //hide error message when the user selects a time slot
        $(".scheduleErr").hide(); 
        addTimeSelection($(this)); //add time selection 
    }
    });
    
    //send listing to server
    sendListing($("#createListing")); 
    //remove red border on focus
    $(".input-field-hostSession1").on("focus", function(){
        $(this).parent().parent().css("border", "2px solid #343a40");
    })
    $("#building").on("focus", function(){
        
        $("#buildingErr").text("");
    })
    $("#room").on("focus", function(){
        
        $("#roomErr").text("");
    })
    $("#hourlyRate").on("focus", function(){
        
        $("#hourlyRateTxt").text("");
    })
    $("#courseName").on("focus", function(){
        $("#courseNameTxt").text("");
    })
    $(".autocomplete-wrapper").on("click", ".courseCountainer", function(){
        $("#courseName").val($(this).children().eq(0).text());
        $(".thisCourse").val($(this).children().eq(1).text())
        $(".course-autocomplete").hide();
        $(".blocker").hide();
    })
    $("#courseName").on("focus", function(){
        $(".course-autocomplete").show();
        $(".blocker").show();
    })

    $(".blocker").on("click", function(){
        $(this).hide();
        $(".course-autocomplete").hide();

    })

    $("#courseName").on("focus", function(){
        $(".course-autocomplete").show();
        $(this).css("border-bottom", "none");
    })
    $("#grade").on("click",function(){
        $(".gradeErr").hide();
    })
    //load courses for the course input autocomplete
    $("#courseName").on("keyup", function(){
    payload = {
        searchValue: $("#courseName").val(),
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
                 if(($("#courseName").val() === "")){
                     $(".loading-courses").html("<p class='emptySearch'>Search Courses</p>");
                 }
                 else if(result.Courses.length > 0){
                    for( x in result.Courses){
                        courses+= "<div class='courseCountainer'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                         result.Courses[x].CourseCode+"</p></div>";
                    }
                
                     $(".loading-courses").html(courses);
                 }
                
                 else{
                     $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
                 }
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     });
    });

    // $.ajax({
    //     url: '/API/SiteWideSearch' ,
    //     method: 'GET',
    //     error:function(err,str){
    //         alert(err)
    //     }
    //     }).done(function(res) {   
    //         $(".loading-courses").text("Search Course by Title or Name")
    //         $("#courseName").on("keyup", function(){
    //             $(".course-autocomplete ul").html(filterResults1(res,$("#courseName").val()));
    //         });
    // })
    //control which calendar is shown

    $(".expiration").on("change", function(){
        $(".expirationErr").hide();
        $(".dateButtons").hide();
        $(".dateButtons").removeClass("bg-primary");
        $(".dateButtons").eq(0).addClass("bg-primary");
        $(".calendarContainer").hide();
        if($(this).val() == "0"){
            $(".dateButtons").show();
        }
        $("#calendar0").fadeIn();
        for(var i = 0; i < parseInt($(this).val()); i++){
            $(".dateButtons").eq(i).show();
        }
      
    })

    $(".dateButtons").on("click", function(){
        $(".dateButtons").removeClass("bg-primary");
        var idArr = $(this).attr("id").split("")
        $(".calendarContainer").hide();
        $("#calendar"+idArr[idArr.length-1]).fadeIn();
        $(this).addClass("bg-primary");
    })
    $(".terms").on("click", function(){
       $(".termsMsg").css("color","white");
    })
});
