$(document).ready(function(){
    $(".zoomInput").on("focus",  function(){
        $(this).css("border","none")
        $(".zoomErr").hide();
    })
    $(".addZoom").on("submit", function(e){
        if(!$(".zoomInput").val().includes("https://us02web.zoom.us")){
            e.preventDefault();
            $(".zoomInput").css("border", "1px solid #dc3545");
            $(".zoomErr").show();
        }
        if(!$(".terms").prop("checked")){
            $(".termsMsg").css("color", "#dc3545");
            e.preventDefault();
          }
    })
})