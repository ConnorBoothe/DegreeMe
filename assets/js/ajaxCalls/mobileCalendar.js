const dayArray = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function formatCalendarTime(rawTime){
  if(rawTime === 12){
    return "12 PM";
  }
  else if (rawTime === 0){
    return "12 AM";
  }
  else{
    if(rawTime > 11){
      return rawTime%12 +" PM";
    }
    else{
      return rawTime%12 +" AM";
    }
  }
}
//control calendar display
function showDayCalendar(selector){
  selector.on("change", ".daySelect-container select", function(){
    $.session.set("day", dayArray[parseInt($(this).val())])
    $('.calendarContainer').html(generateMobileCalendar(dayArray[parseInt($(this).val())]));
    $(".calendarContainer").hide();
    $(".calendarContainer").fadeIn();
  })
}

function addTimeslot(day, time, calendarLine){
      payload= {
        day:day,
        time:time
      }
      $.ajax({
        url: "/addTimeslot",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
        "Content-Type": "application/json"
        }, statusCode: {
        202: function (result) {
            calendarLine.addClass("calendarLine-selected");
            calendarLine.removeClass("calendarLine");
        },
        500: function (result) {
            alert("500");
        },
        },
    });
}
function removeTimeslot(day, time, calendarLine){
  payload= {
    day:day,
    time:time
  }
  $.ajax({
    url: "/removeTimeslot",
    type: 'POST',
    data: JSON.stringify(payload),
    headers: {
    "Content-Type": "application/json"
    }, statusCode: {
    202: function (result) {
        calendarLine.removeClass("calendarLine-selected");
        calendarLine.addClass("calendarLine");
    },
    500: function (result) {
        alert("500 ");
    },
    },
});
}
function formatCalendarHeader(){
  var calendar = '<div class="mobileCourses">';
  if(window.innerWidth < 1000){
    calendar += '<h1>'+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "My Schedule</h1>";
  }
    calendar += "<div class='dateBtn-container'><h1 class='weekOfTxt'>Selecting time slots below will make you an active tutor for that time slot on a weekly recurring basis.</h1></div>"+
            "<div class='daySelect-container'><select class='day-select'>";
            for(x in dayArray){
             calendar+= "<option value="+x+">"+dayArray[x]+"</option>";
            }
            calendar+= "</select></div>";
      return calendar;
}
//format mobile calendar
function formatMobileCalendar(data){
        var calendar = "";
              calendar+= '<div class="calendarContainer" id="calendar">'
              calendar += '<div class="day-container">';
              calendar += '<div class="">';
                 for(var y = 0; y <24; y++){
                    if(data.includes(y)){
                        calendar += '<div class="day-wrapper"><input class="calendar-checkbox" type="checkbox" value="'+y+'" checked/><label><p class="timeLabel">'+formatCalendarTime(y)+'</p><p class="newTime"></p></label><div class="calendarLine-selected"></div></div>';
                    }
                    else{
                      calendar += '<div class="day-wrapper"><input class="calendar-checkbox" type="checkbox" value="'+y+'"/><label><p class="timeLabel">'+formatCalendarTime(y)+'</p><p class="newTime"></p></label><div class="calendarLine"></div></div>';

                    } 
              }
              calendar +='</div>';
              calendar +='</div>';
              

return calendar;
}
//insert user schedule here
function generateMobileCalendar(day){
  var calendarCount = $.session.get("calendarCount");
  var data = "";
  payload= {
    day:day
  }
  $.ajax({
    url: "/getScheduleByDay",
    type: 'POST',
    data: JSON.stringify(payload),
    headers: {
    "Content-Type": "application/json"
    }, statusCode: {
    202: function (result) {
      data = result.data;
     
        if(calendarCount > 0){
          $(".calendarContainer").html(formatMobileCalendar(data));
        }
        else{
          $(".calendarContainer").html(formatMobileCalendar(data));
        }
        $.session.set("calendarCount", ++calendarCount);
    },
    500: function (result) {
        alert("500");
    },
    },
});
}
  $(document).ready(function(){
    //control calendar display
    showDayCalendar($("#showNotifications"));
    showDayCalendar($(".modal"));

    $("#showNotifications").on("change", ".calendar-checkbox", function(){
      //add timeslot
      if($(this).prop("checked") == true){
        addTimeslot($.session.get("day"), parseInt($(this).val()), $(this).next().next());
      }
      //remove time slot
      else{
        removeTimeslot($.session.get("day"), parseInt($(this).val()), $(this).next().next());
      }
    });
    // show calendar
    $("#showNotifications").on("click",".mySchedule",function(){
      $.session.set("day", "Sunday");
      $.session.set("calendarCount", 0);

      $('#showNotifications').html(formatCalendarHeader() + formatMobileCalendar($.session.get("day")));
      generateMobileCalendar($.session.get("day"));
    });
  //mobile version
  $("#showNotifications").on("click", ".dateButtons", function(){
      $(".dateButtons").removeClass("bg-primary");
      var idArr = $(this).attr("id").split("")
      $(".calendarContainer").hide();
      $("#calendar"+idArr[idArr.length-1]).fadeIn();
      $(this).addClass("bg-primary");
  })

  //desktop Version
  $(".tutorSchedule").on("click",function(){
    $.session.set("day", new Date().getDay());
    $.session.set("calendarCount", 0);

    $('#availability .modal-body').html(formatCalendarHeader() + formatMobileCalendar($.session.get("day")));
    generateMobileCalendar($.session.get("day"));
  });
  

})

  