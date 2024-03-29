
$(document).ready(function(){
    //AJAX GET request used for Create Conversation autocomplete
    $.ajax({
        url: '/API/NewConversation' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) {
            //populate div with matching users when a new key is pressed
            $(".input-field-message").on("keyup", function(){
                $(".conversation_Suggestions-list").html("");
                for(x in res){
                    //if handle includes input value, display it
                    if((res[x][0].substring(1).includes($(this).val())) & $(this).val() != ""){
                        $(".conversation_Suggestions-list").append("<li class='conversation_item'>"+
                        "<img src='"+ res[x][1]+"' class='conversation_img' alt='Profile Image'/>"+
                        "<div class='convo-user-container'>"+
                        "<p class='convoName'>"+ res[x][0]+"</p>"+
                        "<p class='convoHandle'>"+ res[x][2]+"</p>"+
                        "</div>"+
                        "</li>");
                    }
                }
             });
    });
    //initialize frontend session userHandle var to the current user
    $.session.set("userHandles",[$(".userProfileName").eq(0).text()]);

    //append handle to searchPeople-container when clicked
    $(".conversation_Suggestions-list").on("click",".conversation_item", function(){
        var userHandleArray = [];
        //push current handles into the array
        userHandleArray.push($.session.get("userHandles"));
        //push the new selection into the array
        userHandleArray.push($(this).children().eq(1).children().eq(0).text())
        //reset session variable
        $.session.set("userHandles",userHandleArray);
        $(".input-field-message").val("");
        $(".conversation_Suggestions-list").html("");
        $(".searchPeople-container").append("<p class='badge badge-primary addedUsers'><img src='"+$(this).children().eq(0).attr("src")+"' class='convoAddedImg'/><span class='addedUsersSpan'>"+($(this).children().eq(1).children().eq(0).text())
        +"</span><span class='deleteUser'><button type=button class='close' aria-label=Close>"+
        "<span aria-hidden='true'>&times;</span>"+
        "</button></span></p>");
        
    })
    //clear the list when the user leaves the window
    $(".close").on("click", function(){
        $(".conversation_Suggestions-list").html("");
    })
    //remove a user from userHandleArray
    $(".searchPeople-container").on("click",".deleteUser", function(){
        //split userHandleArray by , to create array that can be manipulated
        var userHandleArray = $.session.get("userHandles").split(",");
        //push current handles into the array
        var user = $(this).parent().children().eq(1).text();
        //find the index of the handle to remove
        var indexToRemove = userHandleArray.indexOf(user);
        //remove the index
        userHandleArray.splice(indexToRemove,1);
        //resave the session variable
        $.session.set("userHandles", userHandleArray);
        //remove the DOM object
        $(this).parent().remove();
    })
    //Create new message thread, add users to it with AJAX POST request
    $(".createThread").on("submit",function(e){
        e.preventDefault();
        var userHandles =$.session.get("userHandles").split(",");
        var subject = userHandles[0];
        var userLengthMinus2 = parseInt(userHandles.length)-2;
        //create message title from userhandles
        if(userHandles.length < 3){
            subject = subject +", "+ userHandles[1];
        }
        else{
            subject = subject +", "+ userHandles[1] + " +"+userLengthMinus2+" more" ;
        }
        //payload that is sent to server-side route (router.post('/createThread'))
        payload = {
            host:$(".userProfileName").text(),
            hostImg:$(".userProfileImg").attr("src"),
            userHandles:userHandles,
            subject:subject,
            date:new Date(),
          }
          //make the POST request and handle the response
        $.ajax({
            url: "/createThread",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  window.location.href = "/messages?messageId="+ result.messageId
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        //redirect to message thread
       
    })
    
    
});