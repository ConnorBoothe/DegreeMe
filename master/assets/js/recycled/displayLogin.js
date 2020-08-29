//Hide login button on index page, show everywhere else
$(document).ready(function(){
    var locationArray = window.location.href.toString().split("/");
    if(locationArray[3] === ""){
        $(".login-nav").hide();
    }
    else{
        $(".login-nav").show();
    }
})