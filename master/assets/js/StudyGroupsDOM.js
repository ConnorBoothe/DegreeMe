$(document).ready(function(){
    //hide max students field initially, because default is individual session
    $("#maxStudents").parent().parent().hide();
//set hidden input value associated with listing type to value selected from menu
$(".listingTypeItem").on("click", function(){
    $(".listingTypeItem").removeClass("badge-primary");
    $(this).addClass("badge badge-primary");
    $("#listingType").val($(this).text());
    if($(this).text() == "In-Person"){
        $("#maxStudents").parent().parent().show();
        $(".typeInfo").text("You're creating a(n) "+$(this).text()+". Multiple users can join each time slot you select below.");
    }
    else if($(this).text() == "Virtual"){
        $("#maxStudents").parent().parent().hide();
        $(".typeInfo").text("You're creating a(n) "+$(this).text()+". Only one user can join each time slot you select below.");
    }
   
})
//change duration text and update hidden input field
$(".durationSlider").on("change", function(){
    
    if($(this).val() === "0"){
       $(".sessionDuration").text("Once");
       $("#listingDuration").val("Once");

    }
    else if($(this).val() === "1"){
        $(".sessionDuration").text("Weekly");
        $("#listingDuration").val("Weekly");
    }
    else if($(this).val() === "2"){
        $(".sessionDuration").text("Monthly");
        $("#listingDuration").val("Monthly");
    }
    else if($(this).val() === "3"){
        $(".sessionDuration").text("Yearly");
        $("#listingDuration").val("Yearly");
    }
    
})


});