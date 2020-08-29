$(document).ready(function(){
    $(".gradeChoice").on("click",function(){
        $(".gradeText").text($(this).val());
    })
});