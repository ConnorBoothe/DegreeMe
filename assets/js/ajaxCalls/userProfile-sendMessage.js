$(document).ready(function(){
    $(".profileMessage").on("submit", function(e){
        e.preventDefault();
        //newThread(host, hostImg, userHandles, datetime, subject)
        alert($("input[name='receiverHandle']").val())
        alert($("input[name='receiverImg']").val())
        payload = {
            host:$("input[name='host']").val(),
            hostImg:$("input[name='hostImg']").val(),
            receiver:$("input[name='receiverHandle']").val(),
            receiverImg:$("input[name='receiverImg']").val(),
            message:$(".messageText").val(),
        }
        $.ajax({
            url: "/sendDirectMessage",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                    window.location.href = "/messages?messageId=" + result.messageId;
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
})