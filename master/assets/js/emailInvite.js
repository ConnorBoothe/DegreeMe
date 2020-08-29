$(document).ready(function(){
    $.session.set("sendToEmails", [])
    var emailRegEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   $(".emails").on("focus", function(){
    $(".emailErr").hide();
   })
    $(".addEmailBtn").on("click",  function(){
        if(emailRegEx.test($(".emails").val())){
            var emails = [];
            emails.push($.session.get("sendToEmails"));
            emails.push($(".emails").val());
            $.session.set("sendToEmails", emails);
            $(".addedEmails").append("<p class='appendEmails'>"+$(".emails").val()+"</p>");
            $(".emails").val("");
        }
        else{
            $(".emailErr").show();
        }
    })
    $(".sendInviteEmail").on("click", function(){
        payload = {
            emails:$.session.get("sendToEmails"),
            message:$(".inviteMsg").val(),
            groupName:$(".hiddenGroup").val(),
            groupId:$(".hiddenGroupId").val(),
            action:$(".emailAction").val()
         }
         $.ajax({
             url: "/sendEmailInvite",
             type: 'POST',
             data: JSON.stringify(payload),
             headers: {
             "Content-Type": "application/json"
             }, statusCode: {
             202: function (result) {
                 if(result.action === "send invite error"){
                    $(".inviteFriends").text("An error occurred");
                 }
                 else{
                    $(".inviteFriends").text("Email sent");
                 }
             },
             500: function (result) {
                 alert("500 ");
                 console.log(result)
             },
             },
         });  
    })
})