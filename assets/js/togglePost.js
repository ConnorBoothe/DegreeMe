$(document).ready(function(){
    $(".post-container").on("click", function(){
        $(".post-container").css("border-bottom", "none");
        if($(this).children().eq(1).text() === "Help Request"){
            $(this).css("border-bottom", "2px solid #28a745");
            $(".textarea").text("Request help from the DegreeMe community...");
            $(".requestHelpDetails").fadeIn();
            $(".status-update-container").fadeOut();
        }
        if($(this).children().eq(1).text() === "Status Update"){
            $(this).css("border-bottom", "2px solid #f02849");
            $(".textarea").text("What's on your mind?");
            $(".requestHelpDetails").fadeOut();
            $(".status-update-container").fadeIn();
        }
    })
})