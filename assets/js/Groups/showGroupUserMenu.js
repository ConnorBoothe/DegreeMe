$(document).ready(function(){
    $(".membersRightSideBar").on("click", ".messageSideBarImg", function(){
        if($(this).next().next().css("display") != "none") {
            $(this).next().next().hide();
        }
        else {
            $(this).next().next().show();
        }
    })
})