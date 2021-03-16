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
    // var changeColor = "background";
    var textAdded = false;
    var linkAdded= false;
    //change font size of text element
    $(".add-story-wrapper").on("click", ".textBox-wrapper ul li",
     function(){
         $(".textBox-wrapper ul li").removeClass("selected-textsize")
        $(this).addClass("selected-textsize");
        switch($(this).text()){
            case "Small":
                $(this).parent().prev().css({fontSize: "14px"});
                break;
            case "Medium":
                $(this).parent().prev().css({fontSize: "22px"});
                break;
            case "Large":
                $(this).parent().prev().css({fontSize: "30px"});
                break;
        }
    })
    //change font size of link
    $(".add-story-wrapper").on("click", ".link-wrapper ul li",
    function(){
        $(".link-wrapper ul li").removeClass("selected-textsize")
       $(this).addClass("selected-textsize");
       switch($(this).text()){
           case "Small":
               $(this).parent().prev().css({fontSize: "14px"});
               break;
           case "Medium":
               $(this).parent().prev().css({fontSize: "22px"});
               break;
           case "Large":
               $(this).parent().prev().css({fontSize: "30px"});
               break;
       }
   })
   //focus poll question on click
    //add text element to story
    $(".poll-question").on("click", function(){
        $(this).focus();
        $(".poll-container").draggable( 'disable' )
    })
    $(".add-text").on("click", ()=>{
        $("input[name='story-type']").val();
        if(!textAdded) {
            $("input[name='hasText']").val(true);
            var textBox = "<div class='textBox-wrapper'><p class='textBox' contenteditable='true'>Write text</p>"+
            "<ul><li class='selected-textsize'>Small</li><li>Medium</li><li>Large</li></ul>"+
            "</div>";
            $(".add-story-wrapper").append(textBox);
            $(".text-color").show();
            $(".textBox-li").css({marginBottom: "-2px"});
            $(".add-story-wrapper .textBox-wrapper").draggable({
                containment: ".add-story-wrapper",
                cursor:"move"
            });
            textAdded = true;
        }
        else{
            if($(".textBox").css("display") == "none") {
                $("input[name='hasText']").val(true);
                $(".text-color").show();
                $(".textBox").show();
                $(".textBox").focus();
                $(".textBox-li").css({marginBottom: "-2px"});
            }
            else {
                $("input[name='hasText']").val(false);
                $(".text-color").hide();
                $(".textBox").hide();
            }
        }
    })
    //add link to story
    //add text element to story
    $(".link-li").on("click", ()=>{
        if(!linkAdded) {
            $("input[name='hasLink']").val(true)
            var link = "<div class='link-wrapper'><span class='http'>"+
            '<svg data-toggle="tooltip" data-title="Link" data-placement="left" xmlns="http://www.w3.org/2000/svg" width="1.75em" height="1.75em" fill="white" class="bi bi-link-45deg" viewBox="0 0 16 16">'+
                '<path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>'+
                '<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>'+
            "</svg>"+
          "</span><p class='link' contenteditable='true'>Insert link</p>"+
            "<ul><li class='selected-textsize'>Small</li><li>Medium</li><li>Large</li></ul>"+
            "</div>";
            $(".add-story-wrapper").append(link);
            $(".text-color").show();
            $(".add-story-wrapper .link-wrapper").draggable({
                containment: ".add-story-wrapper",
                cursor:"move"
            });
            linkAdded = true;
        }
        else{
            if($(".link").css("display") == "none") {
                $("input[name='hasLink']").val(true)
                $(".text-color").show();
                $(".link").show();
                $(".link").prev().show();
                $(".link").focus();
                $(".textBox-li").css({marginBottom: "-2px"});
            }
            else {
                $("input[name='hasLink']").val(false)
                $(".text-color").hide();
                $(".link").prev().hide();
                $(".link").hide();
            }
        }
    })
    $(".text-options-fadeout").on("mouseover", function(){
         $(".textBox-wrapper ul").hide();
         $(".link-wrapper ul").hide();
     })
    //show font size menu
    //focus textBox
    $(".add-story-wrapper").on("click",".textBox", function(){
        $(".text-color").show();
        $(".textBox-li").css({marginBottom: "0px"});
        $(".textBox").focus();
        $(this).next().show();
        //disable drag so text can be typed
        $(".add-story-wrapper .textBox-wrapper").draggable( 'disable' )
            //clear text on focus if text == "Write text"

        if($(".textBox").text() == "Write text") {
            $(".textBox").text("");
        }
    })
     //focus link text
     $(".add-story-wrapper").on("click",".link", function(){
        changeColor = "text";
        $(".text-color").show();
        $(".textBox-li").css({marginBottom: "0px"});
        $(".link").focus();
        $(this).next().show();
        //disable drag so text can be typed
        $(".add-story-wrapper .link-wrapper").draggable( 'disable' )
            //clear text on focus if text == "Write text"

        if($(".link").text() == "Insert link") {
            $(".link").text("");
        }
    })
    //enable drag, hide color picker
    $(".add-story-wrapper").on("focusout", ".textBox",
     function(e){
        $(".textBox-wrapper").draggable( 'enable' )
        $(".text-color").hide();
        $(".textBox-li").css({marginBottom: "20px"});
     })
     //enable drag of poll container
    $(".add-story-wrapper").on("focusout", ".poll-question",
    function(e){
        
       $(".poll-container").draggable( 'enable' )
    
    })
     //enable drag, hide color picker
    $(".add-story-wrapper").on("focusout", ".link",
    function(e){
       $(".link-wrapper").draggable( 'enable' )
       $(".text-color").hide();
       $(".textBox-li").css({marginBottom: "20px"});
    })
    $(".textBox-wrapper ul li").on("click", function(){
        $(".textBox").focus();
        $(".textBox-wrapper ul li").removeClass("selected-textsize")
    })
    $(".link-wrapper ul li").on("click", function(){
        $(".link").focus();
        $(".link-wrapper ul li").removeClass("selected-textsize")
    })
    // $("#colorpicker1").tinycolorpicker();
    var typeMultipleChoice = false;
    var typedPoll = false;
    $("#flat").spectrum({
        flat: true,
        showInput: true,
        color: 'blue' 
       });
       $("#flat1").spectrum({
        flat: true,
        showInput: true,
        color: 'blue' 
       });
        var backgroundColor = "";
        //background color
    $("#flat").on("change.spectrum move.spectrum", ()=>{
        backgroundColor = $("#flat").spectrum('get').toHexString();
       
            $(".sp-picker-container").css({backgroundColor:$("#flat").spectrum('get').toHexString()});
            $(".add-story-body").css({backgroundColor:$("#flat").spectrum('get').toHexString()});
    })
    $("#flat1").on("change.spectrum move.spectrum", ()=>{
        $(".textBox").css({color:$("#flat1").spectrum('get').toHexString()});
        $(".link").css({color:$("#flat1").spectrum('get').toHexString()});
    });
    $(".story-text-span").on("focus", function(){
        $(this).css({opacity: "1.0" });
       if($(this).text() == "Write your message here" ) {
        $(this).text("");
       }
    })
    //show duration menu
    $(".duration-img").on("click",function(){
        //show selection menu above
        if($(".duration-options").css("display") == "none") {
            $(".duration-options").show();
        }
        else {
            $(".duration-options").hide();
        }
    })
    //change duration
    $(".duration-options ul li").on("click",function(){
        $(".duration-text").text($(this).text())
        $(".duration-options").hide();
    });
    //show background color palette
    $(".background-color-change svg").on("click", function(){
        if($(this).next().css("display") == "none") {
            $(this).css("transform", "rotate(30deg)")
            $(this).next().show();
        }
        else{
            $(this).next().hide();
            $(this).css("transform", "rotate(-25deg)")

        }
        
    })
    $(".story-tools li").on("click", function(){
        var type = $(this).children().eq(0).val();
        $("input[name='story-type']").val(type)
        if(type == "image"){
            // $(".poll-container").hide();
            // $(".multiple-choice-container").hide();
            $(".story-input-container").show();
        }
        else if(type == "poll") {
            if($(".poll-container").css("display") == "none") {
                $(".poll-container").draggable({
                    containment: ".add-story-wrapper",
                    cursor:"move"
                });
                $(".poll-container").css("display", "inline-block");
                $(".multiple-choice-container").hide();
            
            }
            else {
                $(".poll-container").hide();
            }
            
            
          
        }
        else if(type == "multiple" ) {
            $(".multiple-choice-container").draggable({
                containment: ".add-story-wrapper",
                cursor:"move"
            });
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