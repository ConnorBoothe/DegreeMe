
$(document).ready(()=> {
    //clear border on focus
   $("#searchInput").on("focus", function(){
       $(this).parent().css({border: "none"})
   })
   //submit change major POST request on button click
    $(".editMajor").on("click", function(){
        if($("#major").text() == "") {
            $(".input-container1Light-settings").css({border: "1px solid #dc3545"});
        }
        else{
            payload = {
                major:$("#major").text(),
              }
            $.ajax({
                url: "/updateMajor",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(".majorSpan").text(result.major);
                    $(".modal").modal("hide");
                    $(".newMajor").html("");
                    updateProgressBar('#addMajor');
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
          
        }
        })
    
    
   
})