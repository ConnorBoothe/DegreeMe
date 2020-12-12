$(document).ready(function(){
    //Create new message thread, add users to it with AJAX POST request
    $(".createThread").on("submit",function(e){
        e.preventDefault();
        var userHandles =$.session.get("userHandles").split(",");
        var subject = userHandles[0];
        var userLengthMinus2 = parseInt(userHandles.length)-2;
        //create message title from userhandles
        if(userHandles.length < 3){
            subject = subject +", "+ userHandles[1];
        }
        else{
            subject = subject +", "+ userHandles[1] + " +"+userLengthMinus2+" more" ;
        }
        //payload that is sent to server-side route (router.post('/createThread'))
        payload = {
            host:$(".userProfileName").text(),
            hostImg:$(".userProfileImg").attr("src"),
            userHandles:userHandles,
            subject:subject,
            date:new Date(),
          }
          //make the POST request and handle the response
        $.ajax({
            url: "/createThread",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  window.location.href = "/messages/"+ result.messageId
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        //redirect to message thread
       
    })
})