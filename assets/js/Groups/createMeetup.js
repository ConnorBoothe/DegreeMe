function formatMeetup(result){
         var meetupsHTML = '<div class="meetup-container">'+
        '<p class="meetup-host text-light"><a href="/user/'+result.hostHandle+'"><img class="meetup-host-image" src="'+result.hostImage+'"/>'+result.hostHandle+'</a></p>'+
        '<h3 class="text-light meetup-title">'+result.title+'</h3>'+
        '<p class="text-light meetup-date">'+displayDateWithoutToday(new Date(result.date))+' '+
        displayTime(new Date(result.date))+'</p>'+
        "<p class='badge badge-info'>1 attending</p><br>"+
         "<p class='text-light'>Attending</p>" +
        '<button class="btn btn-primary reserveSeat">Reserve Seat</button>';
    meetupsHTML += '</div>';
    return meetupsHTML;

    }


$(document).ready(function(){
   
        $(".date-picker").datepicker({
            minDate: new Date()
        });
       $(".createMeetup").unbind().on("click", function(){
        var hour = 0;
        var min = parseInt($("select[name='min']").val());
        var date = new Date($(".date-picker").datepicker("getDate"));
        date.setHours(date.getHours()+ 5)
        if($("select[name='AMorPM']").val() == "PM"){
            if(parseInt($("select[name='hour']").val()) == 12 ){
                hour = parseInt($("select[name='hour']").val());
            }
            else{
                hour = parseInt($("select[name='hour']").val())+12;

            }
        }
        else {
            if(parseInt($("select[name='hour']").val()) == 12 ){
                hour = 0;
            }
            else {
                hour = parseInt($("select[name='hour']").val());
            }
        }
        date.setHours(hour)
        date.setMinutes(min)
        date.setSeconds(0)
        payload = {
            groupId:$("input[name='groupId']").val(),
            groupName: $("input[name='groupName']").val(),
            title: $("input[name='description']").val(),
            date: date,
            duration: $("select[name='duration']").val()
        }
        $.ajax({
            url: "/createMeetup ",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  console.log("res")
                $(".modal").modal('hide');
                $(".meetup-list").prepend(formatMeetup(result));
              }
              }
        })
    })
    
})