$(document).ready(function(){
    $(".story-text-span").on("focus", function(){
        $(this).css({opacity: "1.0" });
       if($(this).text() == "Write your message here" ) {
        $(this).text("");
       }
    })
   
    
    

    
})