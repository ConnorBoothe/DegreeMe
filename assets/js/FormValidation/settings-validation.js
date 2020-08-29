$(document).ready(function(){

    //If no changes have been made, block form submission
    var changes = false;
    $(".settings-form").on("submit", function(e){
        if($(".editImg").attr("src") === $(".userProfileImg").attr("src")){
            e.preventDefault();
        }
        else{
            changes = true;
        }
        if(!changes){
            $(".noChangeTxt").show();
        }
    })
})