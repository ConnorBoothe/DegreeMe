$(document).ready(function(){
    $.session.set("status", "Study Group Created. View It Here");
    if($.session.get("status")){
        //alert($.session.get("status"));
        $.session.clear();
    }
    setTimeout(function(){
        // $(".statusAlert").animate({marginTop: "55px"});
    },300)

    $(".close").on("click", function(){
        // $(".statusAlert").animate({marginTop: "0px"});
       
    })
   

})