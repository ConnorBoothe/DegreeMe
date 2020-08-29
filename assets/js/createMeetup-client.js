$(document).ready(function(){
    $.session.set("type", "Virtual")
    $("input[name='type']").on("click", function(){
    
        if($(this).val() === "In-person"){
            $(".building-container").show();
            $(".zoom-container").hide();
            $.session.set("type", "In-person")
            
        }
        else{
            $(".building-container").hide();
            $(".zoom-container").show();
            $.session.set("type", "Virtual")
        }
    })
$(".input-field").on("focus", function(){
    if($(this).attr("name") != "type"){
        $(this).parent().css("border-bottom", "2px solid #007bff")
    }
    
})
    $(".createMeetup").on("click", function(e){
        var blockSubmission = false;
        if($.session.get("type") === "Virtual"){
            if($("input[name='zoomLink']").val() == ""){
                blockSubmission = true;
                $("input[name='zoomLink']").parent().css("border-bottom", "2px solid #dc3545")
    
            }
            else if($("input[name='zoomLink']").val().indexOf("us02web.zoom.us") === -1){
                blockSubmission = true;
                $("input[name='zoomLink']").parent().css("border-bottom", "2px solid #dc3545");
                $(".zoomErrTxt").text("Not a valid zoom link")
            }
        }
        else if($.session.get("type") === "In-person"){
            if($("input[name='building']").val() == ""){
                blockSubmission = true;
                $("input[name='building']").parent().css("border-bottom", "2px solid #dc3545")
            }
            if($("input[name='room']").val() == ""){
                blockSubmission = true;
                $("input[name='room']").parent().css("border-bottom", "2px solid #dc3545")
            }
        }
        if($("input[name='description']").val() == ""){
            blockSubmission = true;
            $("input[name='description']").parent().css("border-bottom", "2px solid #dc3545")

        }
        if($("input[name='date']").val() == ""){
            blockSubmission = true;
            $("input[name='date']").parent().css("border-bottom", "2px solid #dc3545")

        }
        if($("input[name='time']").val() == ""){
            blockSubmission = true;
            $("input[name='time']").parent().css("border-bottom", "2px solid #dc3545")

        }
        if($("input[name='duration']").val() == ""){
            blockSubmission = true;
            $("input[name='duration']").parent().css("border-bottom", "2px solid #dc3545")

        }
        $("input[name='zoomLink']").on("focus", function(){
            $(".zoomErrTxt").text("");
        })
        
        if(blockSubmission){
            e.preventDefault();
        }
    })
})