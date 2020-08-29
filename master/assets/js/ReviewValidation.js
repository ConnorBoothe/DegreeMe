$(document).ready(function(){
    $(".reviewSubmit").on("click", function(e){
        if($(".reviewMsg").val() === ""){
            $(".reviewMsg").css("border", "1px solid red");
            $(".reviewMsgErr").text("Enter a short review");
            e.preventDefault();
        }
        else{
            $(".reviewMsgErr").text("");
        }
        if($("input[name='star']:checked").val() === undefined){
            $(".reviewStarErr").text("Leave a star rating");
            e.preventDefault();
        }
        else{
            $(".reviewStarErr").text("");
        }
    })
})