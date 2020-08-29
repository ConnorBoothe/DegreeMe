$(document).ready(function(){
    $(".joinBtn").on("click", function(){
        // id, type, handle, time, image
        payload = {
            status: $("input[name='status']").val(),
            meetingId: $("input[name='meetingId']").val(),
            time:  new Date()
        }
        $.ajax({
            url: "/meeting/"+payload.status,
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
               if(result.status === "joinMeeting"){
                $(".joinBtn").removeClass("btn-primary")
                $(".joinBtn").addClass("btn-danger");
                $(".joinBtn").text("Leave")
                $("input[name='status']").val("leaveMeeting");
                $(".joinedHandle").each(function(index){
                     if($(".joinedHandle").eq(index).text() === result.handle){
                         $(".joinedHandle").eq(index).parent().html('<img src="/'+result.image+'" class="joinMeetingImg" />'+
                         ' <span class="joinedHandle">'+result.handle+'</span> joined at '+ result.time);
                         return false;
                     }
                })
               }
               else if(result.status === "leaveMeeting"){
                $(".joinBtn").removeClass("btn-danger");
                $(".joinBtn").addClass("btn-primary")
                $(".joinBtn").text("Join")
                $("input[name='status']").val("joinMeeting");
                $(".joinedHandle").each(function(index){
                  if($(".joinedHandle").eq(index).text() === result.handle){
                      $(".joinedHandle").eq(index).parent().html('<img src="/'+result.image+'" class="joinMeetingImg" />'+
                      ' <span class="joinedHandle">'+result.handle+'</span> left at '+ result.time);
                      return false;
                  }
             })
               }
              
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
         
         
    })
    $(".addLocation-btn").on("click", function(e){
      e.preventDefault();
      payload = {
        meetingId: $(".meetingId").val(),
        building: $("#building").val(),
        room: $("#room").val(),
    }
      $.ajax({
        url: "/addLocation",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
          $(".createZoomMeeting-container").html("<h2>"+result.status+"</h2>");
            alert("POST RAN")
          },
          500: function (result) {
            alert("500 ");
          },
        },
      });
    })
})