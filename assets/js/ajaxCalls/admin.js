$(document).ready(function(){
    $(".reviewAppBtn").on("click", function(){
    var appId = "";
    var userId = "";
    var course = "";
    if($(this).text() == "Accept"){
        appId = $(this).prev().val();
        userId = $(this).prev().prev().val();
        course = $(this).prev().prev().prev().val();
    }
    else{
        appId = $(this).prev().prev().val();
        userId = $(this).prev().prev().prev().val();
        course = $(this).prev().prev().prev().prev().val();
    }
    payload = {
        appId:appId,
        status:$(this).text(),
        userId:userId,
        course:course
    }
    $.ajax({
        url: "/reviewTutorApplication",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
              alert("STATUS: " + result.status)
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
    })
})