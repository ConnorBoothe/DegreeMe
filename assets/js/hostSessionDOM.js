$(document).ready(function(){
    //hide max students field initially, because default is individual session
    if($(".listingTypeItem.bg-primary").text() == 'Individual Session'){
        $("#maxStudents").parent().parent().hide();
    }
//set hidden input value associated with listing type to value selected from menu
$(".listingTypeItem").on("click", function(){
    $(".listingTypeItem").removeClass("badge-primary");
    $(this).addClass("badge badge-primary");
    $("#listingType").val($(this).text());
    if($(this).text() == "Group Session"){
        $("#maxStudents").parent().parent().show();
        $(".typeInfo").text("Multiple users can join each time slot you select below.");
    }
    else if($(this).text() == "Individual Session"){
        $("#maxStudents").parent().parent().hide();
        $(".typeInfo").text("Only one user can join each time slot you select below.");
    }
   
})
//set hidden input value associated with listing type to value selected from menu
$(".listingTypeItem1").on("click", function(){
    $(".listingTypeItem1").removeClass("badge-primary");
    $(this).addClass("badge badge-primary");
    $("#listingType1").val($(this).text());
    if($(this).text() == "Online"){
        $(".location-container").hide();
        $(".typeInfo1").text("When a user purchases this listing, you will be prompted to create a Zoom meeting.");
    }
    else if($(this).text() == "Physical Location"){
        $(".location-container").show();
        $(".typeInfo1").text("When a user purchases this listing, you will be prompted to select a location for the tutoring session.");
    }
   
})
//change duration text and update hidden input field
$(".durationSlider").on("change", function(){
    
    if($(this).val() === "0"){
       $(".sessionDuration").text("Expires in 1 week");
       $("#listingDuration").val("1 week");

    }
    else if($(this).val() === "1"){
        $(".sessionDuration").text("Expires in 2 weeks");
        $("#listingDuration").val("2 weeks");
    }
    else if($(this).val() === "2"){
        $(".sessionDuration").text("Expires in 1 month");
        $("#listingDuration").val("1 month");
    }
    else if($(this).val() === "3"){
        $(".sessionDuration").text("Does not expire");
        $("#listingDuration").val("Continuous");
    }
    
})


});