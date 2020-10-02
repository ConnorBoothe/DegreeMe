$(document).ready(function(){
    $("#comments-button").on("click",  function(e){
        if($(".commentMsg").val() === ""){
            e.preventDefault();
            $(".commentMsg").css("border", "2px solid #dc3545");
        }
    })
   
})