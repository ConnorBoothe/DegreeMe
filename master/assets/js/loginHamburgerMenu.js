$(document).ready(function(){
    $(".popOutMenu").hide();
    $(".hamburgerContainer").click(function() {
        if ($(".popOutMenu").css("display")=="none"){
            $(".popOutMenu").show();
        }
          else {
            $(".popOutMenu").hide();
          }
        
        
        });
});