function generateMobileCalendar(){
    
    var currDay = new Date().getDay()
    var currTime = new Date().getTime()
    var currDate = new Date();
    var dayArray = ["Sunday", "Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var calendar = "<div class='mobileCourses'><h1>"+
    '<span class="backToMenu"><svg width="1.25em" height="1.25em" viewBox="0 0 16 16" class="bi bi-arrow-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>'+
    '</svg></span>'+
    "My Schedule</h1><button>Set Recurring Schedule</button>";
// <!-- algo to determine current day, and subsequent days -->

  for(var i = 0 ; i <1; i++){  
            var days = orderDays(currDay, dayArray);   
            var times = orderTimes(currDay, dayArray);   
            var dates = orderDates(i);   
            calendar += "<div class='dateBtn-container'><h1 class='weekOfTxt'>Week of</h1>";
            if(i == 0){  
              for(var j =0; j< 4; j++){  
               var dateButtons = orderDates(j);  
               var dateOne = dateButtons[0];   
                if(j == 0){  
                calendar+= '<span class="badge badge-secondary bg-primary dateButtons" id="dateButton'+j+'"><p>'+dateOne+'</p></span>';

                }else{  
                    calendar+= '<span class="badge badge-secondary dateButtons" id="dateButton'+j+'"><p>'+dateOne+'</p></span>';
                  }  
              }  
              calendar+= "<div class='daySelect-container'><select>";
              for(x in dates){  
                if(x == 0 && i == 0){  
                  calendar+= '<option ><span class="badge badge-primary today">Today</span><p class="dateTxtHostSession"></p></option>';
                }else{  
                  calendar+= '<option>  '+days[x]+'  <p class="dateTxtHostSession"> '+  dates[x]  +'</p></option>';
                }  
             }  
            }  
            calendar += "</select></div></div>";
             '<div class="calendarContainer" id="calendar'+i+'">';

           
  
      calendar += '<div class="day-container">';
      calendar += '<div>';
         for(var y = 8; y <=24; y++){
              for(var x = 0; x < 1; x++){  
                console.log((currDate.getHours()))  
                if(currDate.getDay() === times[x] && (y - currDate.getHours()) < 0  && i == 0){  
                //  <!-- if curr date === times[x]  && currTime - 8 === negative, then disable select-->
                calendar += '<div class="bg-secondary"><input type="radio" value="'+(y-parseInt(times[x]))+'"/><label><p class="timeLabel">'+y+' AM</p><p class="newTime"></p></label><div class="deleteTime">'+x+'</div></div>';
                }else{  
                    calendar += '<div><input type="radio" value="'+(y-parseInt(times[x]))+'"/><label><p class="timeLabel">'+y+' AM</p><p class="newTime"></p></label><div class="deleteTime">'+x+'</div></div>';

             }  
              }  
            }
            calendar +='</div>';
            calendar +='</div>';
            calendar +='</div></div>';
     }  
     return calendar;
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
  
  