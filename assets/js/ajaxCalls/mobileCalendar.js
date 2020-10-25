function generateMobileCalendar(){
    
    var currDay = new Date().getDay()
    var currTime = new Date().getTime()
    var currDate = new Date();
    var dayArray = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var calendar = "<div class='mobileCourses'><h1>"+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "My Schedule</h1>";
// <!-- algo to determine current day, and subsequent days -->

  for(var i = 0 ; i <1; i++){  
            var days = orderDays(currDay, dayArray);   
            var times = orderTimes(currDay, dayArray);   
            var dates = orderDates(i);   
            calendar += "<div class='dateBtn-container'><h1 class='weekOfTxt'>Selecting time slots below will make you an active tutor for that time slot on a weekly recurring basis.</h1>";
            if(i == 0){  
              calendar+= "<div class='daySelect-container'><select>"+
              "<option>Sunday</option>"+
              "<option>Monday</option>"+
              "<option>Tuesday</option>"+
              "<option>Wednesday</option>"+
              "<option>Thursday</option>"+
              "<option>Friday</option>"+
              "<option>Saturday</option>"+
              "</select></div></div>";
             '<div class="calendarContainer" id="calendar">';
  
      calendar += '<div class="day-container">';
      calendar += '<div class="">';
         for(var y = 0; y <=24; y++){
              for(var x = 0; x < 1; x++){  
                    calendar += '<div class="day-wrapper"><input type="checkbox" value="'+(y-parseInt(times[x]))+'"/><label><p class="timeLabel">'+y+' AM</p><p class="newTime"></p></label><div class="deleteTime">'+x+'</div><div class="calendarLine"></div></div>';
          
              }  
            }
            calendar +='</div>';
            calendar +='</div>';
            calendar +='</div></div>';
     }  
     return calendar;
}
}
  $(document).ready(function(){
    // show calendar
    $("#showNotifications").on("click",".mySchedule",function(){
        $('#showNotifications').html(generateMobileCalendar());
    });
    
//mobile version
$("#showNotifications").on("click", ".dateButtons", function(){
    $(".dateButtons").removeClass("bg-primary");
    var idArr = $(this).attr("id").split("")
    $(".calendarContainer").hide();
    $("#calendar"+idArr[idArr.length-1]).fadeIn();
    $(this).addClass("bg-primary");
})
  })
  
  