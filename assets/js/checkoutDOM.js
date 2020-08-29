$(document).ready(function(){
    $(".date-container").on("click", function(){
        if($(".date-select").css("display") == "none"){
            $(".date-select").show();
            $(".blocker").show();
        }
        else{
            $(".date-select").hide();
            $(".blocker").hide();
        }
    });
    $(".date-select ul li").on("click", function(){
        $(".dateTimeText").text($(this).children().eq(2).text());
        $(".timeSlot").val($(this).children().eq(1).val());
        $(".timeId").val($(this).children().eq(0).val())
        $(".date-select").hide();
        $(".blocker").hide();
    })
    $(".blocker").on("click", function(){
        $(".blocker").hide();
        $(".date-select").hide();

    })
})