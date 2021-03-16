
function getFirstTutorRooms(course) {
    var currLocation = window.location.href.split("/")[3];
        payload = {
            course: course,
            day: new Date().getDay(),
            time: new Date().getHours()
        }
    $.ajax({
        async: true,
        url: "/getTutorRooms",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }, statusCode: {
            202: function (result) {
                console.log(result)
                var tutorRooms = '<div class="recentActivity-title">' +
                    '<div class="rooms-container">' +
                    '<div class="find-room-container">' +
                    '<input type="hidden" class="date-select" name="date-select" value="' + new Date() + '"/>' +
                    '<ul>';
                    if(currLocation == "home" || currLocation == "user"){
                        tutorRooms += '<li>' +
                        '<div class="course-select">' +
                        '<span class="text-light courseName-text">' + result.courses[0].courseCode + '</span>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                        '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                        '</svg>' +
                        '<div class="course-dropdown">' +
                        '<ul>';
                    for (x in result.courses) {
                        tutorRooms +=
                            '<li class="text-light">' +
                            result.courses[x].courseCode +
                            '</li>';
    
                    }
                    tutorRooms += '</ul>' +
                        '</div></div>' +
                        '</li>';
                    }
                   
                    tutorRooms += '<li>' +
                    '<div class="course-select-day">' +
                    '<span class="text-light day-text">Today</span>' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                    '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                    '</svg>' +
                    '<div class="course-dropdown-day day-dropdown">' +
                    '<input type="hidden" name="day-value" value="' + new Date().getDay() + '"/>' +
                    '<ul>';
                var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                var today = new Date().getDay();
                var endIteration = today + 7;
                var iterator = 1

                for (var i = today; i < endIteration; i++) {
                    if (i == today) {
                        tutorRooms +=
                            '<li class="text-light">' +
                            '<input type="hidden" value="' + i % 7 + '"/> <span>Today</span>' +
                            '<input type="hidden" value="' + new Date() + '"/></li>';
                    }
                    else {
                        tutorRooms +=
                            '<li class="text-light">' +
                            '<input type="hidden" value="' + i % 7 + '"/> <span>' +
                            daysOfWeek[i % 7] + '</span>';
                        var date = new Date();
                        date.setDate(date.getDate() + iterator);
                        tutorRooms += '<input type="hidden" value="' + date + '"/></li>';
                        iterator++;
                    }


                }
                var currTime = new Date().getHours();
                var amText = "PM";
                if(currTime == 12 || currTime == 0) { 
                    currTime = 12;
                }
                else {
                    currTime = currTime%12;
                }
                if(currTime < 12){
                    amText = "AM";
                }
                tutorRooms += '</ul>' +
                    '</div></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="course-select-day time-select">' +
                    '<span class="text-light time-text">' + currTime + '</span>' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                    '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                    '</svg>' +
                    '<div class="course-dropdown-day time-dropdown">' +
                    '<ul>';
                // var currHour = new Date().getHours();
                // var endIteration = currHour + +12;
                
           
                tutorRooms += '</ul>' +
                    '</div></div>' +
                    '</li>' +
                    '<li>' +
                    '<div class="course-select-day amPm-select">' +
                    '<span class="text-light am-text">'+amText+'</span>' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                    '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                    '</svg>' +
                    '<div class="course-dropdown-day amPm-dropdown">' +
                    '<ul>' +
                    '<li class="text-light">' +
                    'AM' +
                    '</li>' +
                    '<li class="text-light">' +
                    'PM' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</li>' +
                    '</ul>' +
                    '</div>';

                tutorRooms += '<ul class="roomsList">';
                for (var i = 0; i < result.tutors.length; i++) {
                    tutorRooms += '<li ' +
                        ' ><img class="room-item roomImg "' +
                        'src=' + result.tutors[i][2] + '/>' +
                        '<p class="text-light text-center room-username">' + result.tutors[i][4] + '</p>' +
                        "<a href='/room/" + result.tutors[i][3] + "'class='btn btn-primary rooms-btn'>Join Room</a></li>";

                }
            
                
                tutorRooms += '</ul>' +
                    '</div>' +
                    '</div><div class="findTutorMobile-results"></div>'
                    if(window.location.href.split("/")[3] == "home") {
                         $(".timeline-wrapper").html(tutorRooms);
                    }
                    else if(window.location.href.split("/")[3] == "user"){
                        $(".profile-item-list").html(tutorRooms);
                    }
                    else if(window.location.href.split("/")[3] == "course"){
                        $(".question-container").html(tutorRooms);
                    }
                    var noRooms = "";
                    if(result.times.length == 0) {
                        $(".time-select").hide();
                        $(".amPm-select").hide();
                        noRooms += "<p class='text-light'>No " 
                        +$(".first-course").val()+ " tutors available today"
                        +"</p><img class='no-tutors-img'"
                        +"src='../assets/img/undraw_camping.svg'/>"
                        $(".roomsList").html(noRooms)
                    }
                    //if there are no available tutors for time slot
                    else if(result.tutors.length == 0) {
                        $(".time-select").hide();
                        $(".amPm-select").hide();
                        noRooms += "<p class='text-light'>No " 
                        +$(".first-course").val()+ " tutors available at "
                        +new Date().getHours()+"</p><img class='no-tutors-img'"
                        +"src='../assets/img/undraw_camping.svg'/>"
                        $(".roomsList").html(noRooms)
                    }
            },
            500: function (result) {
                alert("500");
            },
        },
    });

}

function getFirstTutorRoomsUserProfile(userId) {
    //(userId, day, time, userHandle, courseCode){

        payload = {
            userId: userId,
            day: new Date().getDay(),
            time: $(".time-text").val(),
            userHandle:$("input[name='handle']").val(),
            courseCode: $(".first-course").val()
        }
    $.ajax({
        async: true,
        url: "/getTutorRoomsUserProfile",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }, statusCode: {
            202: function (result) {
                console.log(result)
                var tutorRooms = '<div class="recentActivity-title">' +
                    '<div class="rooms-container">' +
                    '<div class="find-room-container">' +
                    '<input type="hidden" class="date-select" name="date-select" value="' + new Date() + '"/>' +
                    '<ul>';
                        tutorRooms += '<li>' +
                        '<div class="course-select">' +
                        '<span class="text-light courseName-text">' + result.courses[0].courseCode + '</span>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                        '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                        '</svg>' +
                        '<div class="course-dropdown">' +
                        '<ul>';
                    for (x in result.courses) {
                        tutorRooms +=
                            '<li class="text-light">' +
                            result.courses[x].courseCode +
                            '</li>';
    
                    }
                    tutorRooms += '</ul>' +
                        '</div></div>' +
                        '</li>';
                    
                   
                    tutorRooms += '<li>' +
                    '<div class="course-select-day">' +
                    '<span class="text-light day-text">Today</span>' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#d4d4d4" class="bi bi-caret-down-fill" viewBox="0 0 16 16">' +
                    '<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>' +
                    '</svg>' +
                    '<div class="course-dropdown-day day-dropdown">' +
                    '<input type="hidden" name="day-value" value="' + new Date().getDay() + '"/>' +
                    '<ul>';
                var daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                var today = new Date().getDay();
                var endIteration = today + 7;
                var iterator = 1

                for (var i = today; i < endIteration; i++) {
                    if (i == today) {
                        tutorRooms +=
                            '<li class="text-light">' +
                            '<input type="hidden" value="' + i % 7 + '"/> <span>Today</span>' +
                            '<input type="hidden" value="' + new Date() + '"/></li>';
                    }
                    else {
                        tutorRooms +=
                            '<li class="text-light">' +
                            '<input type="hidden" value="' + i % 7 + '"/> <span>' +
                            daysOfWeek[i % 7] + '</span>';
                        var date = new Date();
                        date.setDate(date.getDate() + iterator);
                        tutorRooms += '<input type="hidden" value="' + date + '"/></li>';
                        iterator++;
                    }


                }
                tutorRooms += '</ul>' +
                    '</div></div>' +
                    '</li>';
                    
                tutorRooms += ''+
                    '</div>';

                tutorRooms += '<ul class="roomsList">';
                for (var i = 0; i < result.schedule.length; i++) {
                    var date = new Date();
                    if(result.schedule[i].day - date.getDay() > 0) {
                        date.setDate(date.getDate()+ Math.abs(day - date.getDay()))
                    }
                    else{
                        date.setDate(date.getDate()+ (7-Math.abs(result.schedule[i].day  - date.getDay())))
                    }
                    date.setHours(result.schedule[i].time)
                    date.setMinutes(0)
                        if(new Date().getDay() == date.getDay() &&
                        result.schedule[i].time == new Date().getHours()) {
                            tutorRooms +=
                            '<li>' +
                        '<p class="text-light text-center room-username time-text">' + displayTime(date) + '</p>'+
                            "<a href='/room/"+$("input[name='streamId']").val() + "'class='btn btn-primary rooms-btn'>Join</a></li>";

                        }
                        else if(new Date().getDay() == date.getDay() &&
                        result.schedule[i].time > new Date().getHours()){
                            tutorRooms+= 
                            '<li>' +
                        '<p class="text-light text-center room-username time-text">' + displayTime(date) + '</p>'+
                        "<input type='hidden' value='" + $(".headerLinkPageTitle").text() + "'/>"+
                        "<button class='btn btn-primary rooms-btn reserveSeat'>Reserve</button>"+
                        "<input type='hidden' value='" + $("input[name='streamId']").val() + "'/>" +
                        "<input type='hidden' value='" + $("input[name='userId']").val() + "'/></li>";
                
                        }
                        }
                tutorRooms += '</ul>' +
                    '</div>' +
                    '</div><div class="findTutorMobile-results"></div>';
                    $(".loading-span").text("");
        $(".spinner-container1").hide();
                        $(".profile-item-list").html(tutorRooms);
            },
            500: function (result) {
                alert("500");
            },
        },
    });

}
function getTutorRooms(course, day, time, amPm) {
    var realTime = 0;
    if (amPm === "PM") {
        realTime = parseInt(time) + 12
    }
    else if (amPm === "AM") {
        realTime = parseInt(time)
    }
    if (course == "") {
        payload = {
            course: undefined
        }
    }
    else {
        payload = {
            course: course,
            day: day,
            time: realTime
        }
    }
    $.ajax({
        async: true,
        url: "/getTutorRooms",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }, statusCode: {
            202: function (result) {
                var tutorRooms = "";
                // var currHour = new Date().getHours();
                // var endIteration = currHour + +12;

                if(result.times.length > 0) { 
                    var times = "<ul>";
                    for (var i = 0; i < result.times.length; i++) {
                            times +=
                                '<li class="text-light">' +
                                '<input type="hidden" value="' + result.times[i] + '"/>' +
                                '<span>' + result.times[i] + '</span>' +
                                '</li>';
                        
                    }
                    times += '</ul>';
                }
                else{
                    if($(".day-text").text() == "Today") {
                        var times = "<p class='no-tutors text-light'>No " +$(".courseName-text").text()+ " tutors available " +$(".day-text").text();
                    }
                    else { 
                        var times = "<p class='no-tutors text-light'>No " +$(".courseName-text").text()+ " tutors available this " +$(".day-text").text();

                    }
                }
                
                $(".time-dropdown").html(times);
                console.log(result.times)
                //if there are no available times on this day
                if(result.times.length == 0) {
                    
                    $(".time-select").hide();
                    $(".amPm-select").hide();
                    if($(".day-text").text() == "Today"){
                        $(".roomsList").html("<p class='text-light'>No " 
                    +$(".courseName-text").text()+ " tutors available today "
                   +"</p><img class='no-tutors-img' src='../assets/img/undraw_camping.svg'/>")
               
                    }
                    else {
                        $(".roomsList").html("<p class='text-light'>No " 
                        +$(".courseName-text").text()+ " tutors available on "
                        +$(".day-text").text()+"</p><img class='no-tutors-img' src='../assets/img/undraw_camping.svg'/>")
                   
                    }
                    }
                //if there are no available tutors for time slot
                else if(result.tutors.length == 0) {
                    $(".time-select").show();
                    $(".amPm-select").show();
                    $(".roomsList").html("<p class='text-light'>No " +$(".courseName-text").text()+ " tutors"+
                    " available at "+$(".time-text").text()+" "+$(".am-text").text()+"</p><img class='no-tutors-img' src='../assets/img/undraw_camping.svg'/>");
                }
                //if tutors are available now
                else {
                    $(".time-select").show();
                    $(".amPm-select").show();
                for (var i = 0; i < result.tutors.length; i++) {
                    console.log(result.tutors[i])

                    tutorRooms += '<li> ' +
                        '<img class="room-item roomImg "' +
                        'src=' + result.tutors[i][2] + '/>' +
                        '<p class="text-light text-center room-username">' + result.tutors[i][4] + '</p>';


                    if (parseInt(day) != new Date().getDay() || parseInt(realTime) != new Date().getHours()) {
                        if (result.tutors[i][5] == "true") {
                            tutorRooms += "<input type='hidden' value='" + result.tutors[i][1] + "'/><button class='btn btn-primary rooms-btn reserveSeat' disabled='true'>Reserved</button>";
                        }
                        else {
                            tutorRooms += "<input type='hidden' value='" + result.tutors[i][1] + "'/><button class='btn btn-primary rooms-btn reserveSeat'>Reserve</button>";
                        }
                    }
                    else {
                        tutorRooms += "<a href='/room/" + result.tutors[i][3] + "'class='btn btn-primary rooms-btn'>Join Room</a>"
                    }
                    tutorRooms += "<input type='hidden' value='" + result.tutors[i][3] + "'/>" +
                        "<input type='hidden' value='" + result.tutors[i][0] + "'/></li>";
                }
                    $(".roomsList").html(tutorRooms);
                }
            },
            500: function (result) {
                alert("500");
            },
        },
    });
}
function getTutorRoomsUserProfile(userId, day) {
    payload = {
        userId: userId,
        day: day,
        time:new Date().getHours(),
        userHandle:$("input[name='handle']").val(),
        courseCode: $(".courseName-text").text()
    }
    $.ajax({
        async: true,
        url: "/getTutorRoomsUserProfile",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }, statusCode: {
            202: function (result) {
                console.log(result.schedule)
                var tutorRooms = "";
                for (var i = 0; i < result.schedule.length; i++) {
                    var date = new Date();
                    if(result.schedule[i].day - date.getDay() > 0) {
                        date.setDate(date.getDate()+ Math.abs(result.schedule[i].day - date.getDay()))
                    }
                    else{
                        date.setDate(date.getDate()+ (7-Math.abs(result.schedule[i].day  - date.getDay())))
                    }
                    date.setHours(result.schedule[i].time)
                    date.setMinutes(0);
                    if(parseInt(result.schedule[i].day) === new Date().getDay()) {
                        if( parseInt(result.schedule[i].time) === new Date().getHours()){
                            tutorRooms += '<li>' +
                            '<p class="text-light text-center room-username">' + displayTime(date) + '</p>' +
                            '<input type="hidden" value="'+$(".headerLinkPageTitle").text()+'"'+
                            "<a href='/room/"+$("input[name='streamId']").val()+"' class='btn btn-primary rooms-btn'>Join</a>"+
                            // "<input type='hidden' value='" + result.tutors[i][3] + "'/>" +
                            // "<input type='hidden' value='" + result.tutors[i][0] + "'/></li>";
                            "</li>";
                    
                        }
                        else if(parseInt(result.schedule[i].time) > new Date().getHours()) {
                            tutorRooms += '<li>' +
                            '<p class="text-light text-center room-username">' + displayTime(date) + '</p>' +
                            "<a href=''class='btn btn-primary rooms-btn'>Reserve</a></li>";
                        }
                        }
                else {
                    tutorRooms += '<li>' +
                    '<p class="text-light text-center room-username">' + displayTime(date) + '</p>' +
                    "<input type='hidden' value='" + $(".headerLinkPageTitle").text() + "'/>";
                    if (result.schedule[i].reservedStatus == "true") {
                        tutorRooms += "<button class='btn btn-primary rooms-btn reserveSeat' disabled='true'>Reserved</button>";
                    }
                    else {
                        tutorRooms += "<button class='btn btn-primary rooms-btn reserveSeat'>Reserve</button>";
                    }
                    
                }
                tutorRooms += "<input type='hidden' value='" + $("input[name='streamId']").val() + "'/>" +
                        "<input type='hidden' value='" + $("input[name='userId']").val() + "'/></li>";
                    }
                   
                $(".roomsList").html(tutorRooms);
            },
            500: function (result) {
                alert("500");
            },
        },
    });
}
function showDropdown(selector){
    if (selector.children().eq(2).css("display") == "none") {
        $(".course-dropdown-day").hide();
        $(".course-dropdown").hide();
        selector.children().eq(2).show()
    }
    else {
        $(".course-dropdown-day").hide();
        $(".course-dropdown").hide();
        selector.children().eq(2).hide()
    }
}
function filterTime(selector, course) {
    $(".time-text").text(selector.text())
    getTutorRooms(course, $("input[name='day-value']").val(),
        selector.text(), $(".am-text").text())
}
function filterDay(selector, course){
    $("input[name='day-value']").val(selector.children().eq(0).val())
    $(".day-text").text(selector.children().eq(1).text())
    getTutorRooms(course,
        selector.children().eq(0).val(),
        $(".time-text").text(), $(".am-text").text())
    $("input[name='date-select']").val(selector.children().eq(2).val())
}
function filterAmPm(selector, course){
    $(".am-text").text(selector.text())
    getTutorRooms(course,
        $("input[name='day-value']").val(), $(".time-text").text(), selector.text())
}

function reserveSeat(selector, timeVal){
    var day = "";
    var time = "";
    if(window.location.href.split("/")[3] != "user"){
        time = parseInt($(".time-text").text());
        day = parseInt($("input[name='day-value']").val())
        if($(".am-text").text() == "PM"){
            time +=12;
        }
        }
        else{
            var day = parseInt($(".date-select").val())
            var time= parseInt(timeVal.split(":")[0]);
            var amPm = timeVal.split(" ")[1];
            if(amPm == "PM"){
                time +=12; 
            }
        }
    var date = new Date();
    if(day - date.getDay() > 0) {
        date.setDate(date.getDate()+ Math.abs(day - date.getDay()))
    }
    else{
        date.setDate(date.getDate()+ (7-Math.abs(day  - date.getDay())))
    }
        date.setHours(time)
        date.setMinutes(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setUTCMilliseconds(0);

        var course = "";
        if(window.location.href.split("/")[3] == "home" ||
        window.location.href.split("/")[3] == "user"){
            course = $(".courseName-text").text();
        }
        else{
            
            course = $(".headerLinkTitle").text();
        }
       
        payload = {
            hostHandle:selector.prev().val(),
            date:date,
            course: course,
            streamId: selector.next().val(),
            hostId:selector.next().next().val()
        }
        $.ajax({
            url: "/addMeetup",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                selector.text("Reserved")
                selector.prop("disabled", "true")

            },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        console.log(payload)
}

