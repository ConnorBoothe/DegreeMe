$(document).ready(function(){
    $(".third-button").on("click", function(){
        if($(".popout-container").css("display") == "none"){
            $(".popout-container").show();
        }
        else{
            $(".popout-container").hide();
        }
        
    })
})