function formatMeetups(result){
    var meetupsHTML = "";
    for(var i = 0; i < result.meetups.length; i++) { 
        meetupsHTML += '<div class="meetup-container">'+
        '<p class="meetup-host text-light"><a href="/user/'+result.meetups[i].hostHandle+'"><img class="meetup-host-image" src="'+result.meetups[i].hostImage+'"/>'+result.meetups[i].hostHandle+'</a></p>'+
        '<h3 class="text-light meetup-title">'+result.meetups[i].title+'</h3>'+
        '<p class="text-light meetup-date">'+displayDateWithoutToday(new Date(result.meetups[i].date))+' '+
        displayTime(new Date(result.meetups[i].date))+'</p>'+
        "<p class='badge badge-info'>"+result.meetups[i].attendees.length+" attending</p><br>"+
        "<input type='hidden' value='"+result.meetups[i]._id+"' />";
        var isMember = false
        for(var x = 0; x < result.meetups[i].attendees.length; x++){
            if(result.meetups[i].attendees[x].handle == $(".handle").val()){
                isMember=true;
              
            }
        }
        if(isMember){
            meetupsHTML += "<p class='text-light'>Reserved</p>" ;
        }
        else{
            meetupsHTML += '<button class="btn btn-primary reserveSeat">Reserve Seat</button>';

        }
    meetupsHTML += '</div>';
    }
    return meetupsHTML;
}
$(document).ready(function(){
    
    $.ajax({
        url: '/getGroupMeetups/'+$("input[name='groupId']").val() ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) {  
            $(".meetup-list").html(formatMeetups(res));  
    })
    $(".meetup-list").on("click",".reserveSeat", function(){
        payload = {
            title:"",
            streamId: "",
            date: "",
            meetupId:$(this).prev().val()
            }
        $.ajax({
            url: "/joinMeetup",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                
              }
              }
        })
    })
        })