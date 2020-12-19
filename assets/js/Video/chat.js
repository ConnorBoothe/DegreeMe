function toggleChat(chatStatus){
    if(chatStatus){
        $(".chat-container").show()
        $(".show-chat").hide()
        $(".video-sub-container").css("width","76%");
        payload = {
            streamId: $("input[name='streamId']").val()
        }
        $.ajax({
            url: "/videoChat",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".headerLinkTitle").text(result.host + "'s Room");
                var messages = "";
                for(var x = result.messages.length-1; x >0; x--){
                    messages += '<div class="text-light chat-message">'+
                    '<img class="chat-img" src="'+result.messages[x].senderImg+'"/><span class="chat-handle">'+result.messages[x].sender+' </span>'+
                    "<div class='chat-text-container'><p class='text-light chat-text'>"+result.messages[x].message+'</p></div></div>';
                }
                $(".chat-wrapper").html(messages);
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    }
    else{
        $(".chat-container").hide()
        $(".show-chat").show()
        $(".video-sub-container").css("width","100%");
    }
    
    
}
$(document).ready(function(){
  $("#videoDiv").on("mouseover","video", function(){
    
    $(this).prev().fadeIn();
    setTimeout(function(){
      $(".member-div p").fadeOut();
    }, 3000);
  })
  // $("#videoDiv").on("mouseout","video", function(){
  //   $(".member-div p").fadeOut();
  // })
    //place host user handle in title
    
    //toggle video action buttons on hover
//     $(".video-sub-container").on("mouseover", function(){
//         $(".actions-list1").fadeIn();
//         $(".video-actions-list").fadeIn();
//     })

//     $("#horizontalHeader").on("mouseover", function(){
//             $(".actions-list1").fadeOut();
//             $(".video-actions-list").fadeOut();
//     })
//     $(".chat-members-container").on("mouseover", function(){
        
//         $(".actions-list1").fadeOut();
//         $(".video-actions-list").fadeOut();
// })
// $(".below-video-frame").on("mouseover", function(){
        
//     $(".actions-list1").fadeOut();
//     $(".video-actions-list").fadeOut();
// })
// $(".chat-container").on("mouseover", function(){
        
//     $(".actions-list1").fadeOut();
//     $(".video-actions-list").fadeOut();
// })
    var chatVal = $("input[name='showChat'").val();
//         $(".showControls").on("click", function(){
//             if($(".controls").css("display") == "none"){
//                 $(".controls").show();
//             }
//             else{
//                 $(".controls").hide();
//             }
            
//         })

        // toggleChat(chatVal);
        if(chatVal == "true"){
            $(".chat-container").show();
            $(".show-chat").hide();
            $(".video-sub-container").css("width","74%");
        }
        else{
            $(".chat-container").hide();
            $(".show-chat").show();
            $(".video-sub-container").css("width","100%");
        }
      $(".chatbox").on("focus", function(){
          $(this).parent().css("border", "none");
      })
      //give span focus when chat container is clicked
      $(".send-chat-container").on("click",function(){
        $(".chatbox").focus();
        if($(".chatbox").text() == "Write your message here"){
            $(".chatbox").text("")
        }
      })
    $(".chat-btn").on("click", function (e) {

        e.preventDefault();
        if ($(".chatbox").text().trim() != "") {
            socket.emit('new chat', {
                id: $("input[name='streamId']").val(),
                sender: $(".userProfileName").eq(0).text(),
                message: $(".chatbox").text(),
                img: $(".userProfileImg").attr("src")
            });
            $(".chatbox").text('Write your message here');
        }
        else {
            $(".chatbox").parent().css("border", "1px solid #dc3545");
        }
    })
    socket.on('append chat', function (data, err) {
        alert("Incoming chat")
        if(err){
            alert(err)
        }
       var chat = $(".chat-wrapper");
        //route message to correct locations
        // var messageQueryId = window.location.toString().split("=");
        
        // if (data.msg.id === messageQueryId[1]) {
            chat.prepend(' <div class="text-light chat-message">'+
                '<img class="chat-img" src="'+data.img+'"/> <span class="chat-handle">'+data.sender+' </span>'+
                "<div class='chat-text-container'><p class='text-light chat-text'>"+data.message+
                '</p></div>'+
            '</div>');
              
        // }
    })
    socket.on("member added", (members) => {
        alert("new member")
        var membersHtml = "";
        //loop through members of the stream
        for(var i = 0; i < members.members.length; i++){
          //create members html structure
          membersHtml += '<div class="member-container">'+
          '<a class="chat-tooltip" data-toggle="tooltip" data-placement="top"'+
          'title="'+members.members[i].handle+'">'+
          '<img class="member-img" src="'+members.members[i].image+'"/>'+
        '</a>'+
        '</div>';
        }
        //insert html into members wrapper
        $(".members-wrapper").html(membersHtml);
      })
    //hide chat window
    $(".collapse-chat").on("click", function(){
        var showChat = true;
        if($("input[name='showChat']").val() == "true"){
            showChat = false;
        }
        else{
            showChat = true;
        }
        payload = {
            showChat: showChat
        }
        $.ajax({
            url: "/toggleChat",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $("input[name='showChat']").val(result.chatStatus);
                toggleChat(result.chatStatus)
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    })
})