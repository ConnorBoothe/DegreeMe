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
                window.open(($("input[name='zoomMeeting']").val()));
               if(result.status === "joinMeeting"){
                // $(".joinBtn").removeClass("btn-primary")
                // $(".joinBtn").addClass("btn-danger");
                // $(".joinBtn").text("Leave")
                // $("input[name='status']").val("leaveMeeting");
                $(".joinedHandle").each(function(index){
                     if($(".joinedHandle").eq(index).text() === result.handle){
                         $(".joinedHandle").eq(index).parent().html('<img src="/'+result.image+'" class="joinMeetingImg" />'+
                         ' <span class="joinedHandle">'+result.handle+'</span> joined at '+ result.time);
                         return false;
                     }
                })
               }
            //    else if(result.status === "leaveMeeting"){
            //     $(".joinBtn").removeClass("btn-danger");
            //     $(".joinBtn").addClass("btn-primary")
            //     $(".joinBtn").text("Join")
            //     $("input[name='status']").val("joinMeeting");
            //     $(".joinedHandle").each(function(index){
            //       if($(".joinedHandle").eq(index).text() === result.handle){
            //           $(".joinedHandle").eq(index).parent().html('<img src="/'+result.image+'" class="joinMeetingImg" />'+
            //           ' <span class="joinedHandle">'+result.handle+'</span> left at '+ result.time);
            //           return false;
            //       }
            //  })
            //    }
              
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
         
         
    })
    $(".addLocation-btn").on("click", function(e){
      e.preventDefault();
      var submit = true;
      if($("#building").val() === ""){
        submit = false;
        $("#building").css("border-bottom", "2px solid #dc3545");
      }
      if($("#room").val() === ""){
        submit = false;
        $("#room").css("border-bottom", "2px solid #dc3545");
      }
      if(submit){
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
              $('.toast').toast("show",{
                autohide: false
            });
            $(".createZoomMeeting-container").hide();
            $(".meetingDetails-list").append('<li>'+
            '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-building" fill="currentColor"'+
              'xmlns="http://www.w3.org/2000/svg">'+
              '<path fill-rule="evenodd"'+
               'd="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022zM6 8.694L1 10.36V15h5V8.694zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5V15z" />'+
              '<path'+
                'd="M2 11h1v1H2v-1zm2 0h1v1H4v-1zm-2 2h1v1H2v-1zm2 0h1v1H4v-1zm4-4h1v1H8V9zm2 0h1v1h-1V9zm-2 2h1v1H8v-1zm2 0h1v1h-1v-1zm2-2h1v1h-1V9zm0 2h1v1h-1v-1zM8 7h1v1H8V7zm2 0h1v1h-1V7zm2 0h1v1h-1V7zM8 5h1v1H8V5zm2 0h1v1h-1V5zm2 0h1v1h-1V5zm0-2h1v1h-1V3z" />'+
            '</svg>'+
            ' Building: '+payload.building+
          '</li>'+
          '<li>'+
            '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-geo" fill="currentColor"'+
              'xmlns="http://www.w3.org/2000/svg">'+
              '<path d="M11 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />'+
              '<path d="M7.5 4h1v9a.5.5 0 0 1-1 0V4z" />'+
              '<path fill-rule="evenodd"'+
                'd="M6.489 12.095a.5.5 0 0 1-.383.594c-.565.123-1.003.292-1.286.472-.302.192-.32.321-.32.339 0 .013.005.085.146.21.14.124.372.26.701.382.655.246 1.593.408 2.653.408s1.998-.162 2.653-.408c.329-.123.56-.258.701-.382.14-.125.146-.197.146-.21 0-.018-.018-.147-.32-.339-.283-.18-.721-.35-1.286-.472a.5.5 0 1 1 .212-.977c.63.137 1.193.34 1.61.606.4.253.784.645.784 1.182 0 .402-.219.724-.483.958-.264.235-.618.423-1.013.57-.793.298-1.855.472-3.004.472s-2.21-.174-3.004-.471c-.395-.148-.749-.336-1.013-.571-.264-.234-.483-.556-.483-.958 0-.537.384-.929.783-1.182.418-.266.98-.47 1.611-.606a.5.5 0 0 1 .595.383z" />'+
            '</svg>'+
            ' Room Number: '+payload.room+
          '</li>');
            },
            500: function (result) {
              alert("500 ");
            },
          },
        });
      }
      })
      
})