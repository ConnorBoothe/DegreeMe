$(document).ready(()=>{
    $(".class-list-item ").on("click", function(){
            payload = {
                class:$(this).text(),
              }
            $.ajax({
                url: "/updateClass",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(".classSpan").text(result.class);
                    $(".modal").modal("hide");
                    updateProgressBar('#addStanding');
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
        })
    
})