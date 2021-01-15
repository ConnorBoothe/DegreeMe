function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

//functions to allow drag and drop 
function onDragStart(event) {
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  }
$(document).ready(function(){
    var typeMultipleChoice = false;
    var typedPoll = false;
    $(".story-text-span").on("focus", function(){
        $(this).css({opacity: "1.0" });
       if($(this).text() == "Write your message here" ) {
        $(this).text("");
       }
    })
    $(".story-tools li").on("click", function(){
        var type = $(this).children().eq(0).val();
        $("input[name='story-type']").val(type)
        if(type == "image"){
            $(".poll-container").hide();
            $(".multiple-choice-container").hide();
            $(".story-input-container").show();
        }
        else if(type == "poll") {
            $(".poll-container").show();
            $(".multiple-choice-container").hide();
            $(".content-container-add-story").hide();
            $(".story-input-container").hide();
          
        }
        else if(type == "multiple" ) {
          
            $(".multiple-choice-container").show();
            $(".poll-container").hide();
            $(".content-container-add-story").hide();
            $(".story-input-container").hide();
        }
        
    })
    
    // $(".poll-question").focus();
    $("#poll-question").on("focus", ()=>{
        if($("#poll-question").text().trim() == "Ask Something.." ) { 
            $("#poll-question").text("");
        }
       
    })

    $("#multiple-question").on("focus", ()=>{
       
        if($("#multiple-question").text().trim() == "Ask Something..") {
            $("#multiple-question").text("");
        }
       
    })
    $(".answer-text").on("focus", ()=>{
        if($(this).text().trim().includes("Answer")) {
            $(".answer-text").text("");
        }
       
    })
    $(".poll-answer").on("focus", ()=>{
        if($(".poll-answer").text().trim().includes("Option 1")) {
            $(".poll-answer").text("");
        }
       
    })
    

    
})