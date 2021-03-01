$(document).ready(function(){
    $(".groupRequestBtn").on("click", function(){
        payload = {
            groupId:$("input[name='groupId']").val(),
            hostHandle:$(".userHandleTxt").eq(0).text(),
            groupName: $(".private-group-name").text()
        }
        $.ajax({
            url: "/privateGroupRequest ",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  $(".groupRequestBtn").prop("disabled", "true");
                  $(".requestSent").fadeIn();
              }
            }
        })
    })

    $(".request-response").on("click", function(){
        payload = {
            groupId:$("input[name='groupId']").val(),
            response:$(this).text(),
            handle:$(this).parent().children().eq(0).children().eq(1).text()
            }
        $.ajax({
            url: "/requestResponse ",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  $(".private-group-div ul li").each(function(x){
                    if($(this).children().eq(0).children().eq(0).children().eq(1).text()
                    == result.handle) {
                        $(this).remove();
                    }
                  })
                 
              }
            }
        })
    })
})