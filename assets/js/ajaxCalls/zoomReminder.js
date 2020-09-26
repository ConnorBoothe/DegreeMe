$(document).ready(function(){
    
    $(".sendReminder").on("click", function(){
        payload = {
            handle:$(".hostHandle").val(),
            meetingId: $(".meetingId").val()
        }
        $.ajax({
            url: "/sendZoomReminder",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
               alert("Email invite sent");
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
   
})