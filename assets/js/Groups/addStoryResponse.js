
$(document).ready(function(){
    $(".story-img-div").on("click", ".poll-answer", function(){
        // $(this).addClass("bg-success");
        if($(this).hasClass("poll-option1")){
            $(this).css({backgroundColor: "#6c62f0", color: "white"})
        }
        else{
            $(this).css({backgroundColor: "#28c10d",color:"white"})
        }
        $(this).css({color: "white", border:"2px solid #3020ff"});
        payload= {
            type: $("input[name='storyType']").val(),
            storyId: $("input[name='storyId']").val(),
            answer: $(this).text()
        }
        $.ajax({
            url: "/addStoryResponse",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(function () {
                    $(".story-option-item").each((x)=>{
                        if($(".story-option-item").eq(x).text() == result.answer) {
                            $(".percentage").eq(x).text(result.matchingPercentage+"%");
                            $(".percentage").eq(1-x).text(result.otherPercentage+"%");
                            
                        }
                    })
                    $(".story-option-item").prop("disabled", true);
                    $(".story-option-item").css({opacity: "0.8"})
                 $(".percentage").show();
                 $(".percentage").animate({
                    fontSize: "32px"
                }, 100);
               
                })
    
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
    $(".story-img-div").on("click", ".answer-container", function(){
      payload= {
        type: $("input[name='storyType']").val(),
        storyId: $("input[name='storyId']").val(),
        answer: $(this).text()
    }
      $.ajax({
        url: "/addStoryResponse",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
            console.log(result)
         $(".answer-container").prop("disabled", "true");
            $(function () {
             
              var correctOption = "";
              console.log(result.answer)
              console.log(result.correct)

                $(".answer-container").each((x)=>{
                  if($(".answer-container").eq(x).text() == result.answer && result.answer == result.correctAnswer){
                    $(".answer-container").eq(x).addClass("correct-answer-option-final")
                  }
                  else if($(".answer-container").eq(x).text() == result.answer && result.answer != result.correctAnswer){
                    $(".answer-container").eq(x).css({color:"white", backgroundColor: "#dc3545" })
                    for(var i = 0; i < $(".answer-container").length; i++) {
                      if($(".answer-container").eq(i).text() == result.correctAnswer ){
                        $(".answer-container").eq(i).addClass("correct-answer-option")
                      }
                    }
                  }
                })
                          })

          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
    })
})