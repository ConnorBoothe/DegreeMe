function sendInviteHandleAutocomplete(value){
    payload = {
        searchValue:value,
        type:"Users" 
     }
     $.ajax({
         url: "/siteWideSearch",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
                 var users = "";
                 if((value === "")){
                      $(".handle-container").html("<p class='emptySearch'>Search Users</p>");
                 }
                 else if(result.Users.length > 0){
                     for( x in result.Users){
                         users+= "<div class='courseCountainer'><img class='searchUser' src="+result.Users[x].img+"><p class='searchName'>"+result.Users[x].first_name+ " "+
                             result.Users[x].last_name+"<p class='userHandle'>"+result.Users[x].handle+
                             "</p></p></div>";
                     }
                     $(".handle-container").html(users);
                 }
                 else{
                     $(".handle-container").html("<p class='noMatch'>No matching Results</p>");
                 }
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     }) 
}
function sendEmailInvite(emails){
    payload = {
        emails:emails,
        message:$(".inviteMsg").val(),
        action:$(".emailAction").val()
     }
     $.ajax({
         url: "/sendPlatformInvite",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
            $(".inviteMsg").val("");
            $(".addedEmails").html("");
           sendToEmails = [];
         },
         500: function (result) {
             alert("500");
             console.log(result)
         },
         },
     }); 
}
function sendHandleInvite(handles){
    payload = {
        handles:handles,
        group:$(".group-name-link").text(),
        groupId:$("input[name='groupId']").val(),
        message:$(".inviteMsg").val(),
        action:$(".emailAction").val()
     }
     $.ajax({
         url: "/sendHandleInvite",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
            $(".inviteMsg").val("");
            $(".addedEmails").html("");
           sendToHandles = [];
         },
         500: function (result) {
             alert("500");
             console.log(result)
         },
         },
     }); 
}

$(document).ready(function(){
    if(window.location.href.toString().includes("discover")){
        // $(".modal-title").text("Invite classmates to degreeMe via email")
    }
    var sendToEmails =  [];
    var sendToHandles = [];
    var emailRegEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   $(".emails").on("focus", function(){
    $(".emailErr").hide();
   })
   //ensure that a valid email is entered,
   //then append to container
    $(".addEmailBtn").on("click",  function(){
        if(emailRegEx.test($(".emails").val())){
            sendToEmails.push($(".emails").val());
            $(".addedEmails").append("<p class='appendEmails'>"+$(".emails").val()+"</p>");
            $(".emails").val("");
        }
        else{
            $(".emailErr").show();
        }
    })
    $(".sendInviteEmail").on("click", function(){
      //if type email
      if($(".invite-text").text() == "Email") {
        sendEmailInvite(sendToEmails);
    }
    //if type handle
    else if($(".invite-text").text()  == "Handle") {
        sendHandleInvite(sendToHandles);
    }
    })
    $(".emails").on("keyup",function(){
        
        if($(".invite-text").text() == "Handle"){
            $(".handle-container").show();
            sendInviteHandleAutocomplete($(this).val());
           
        }
    })
    $(".handle-container").on("click", ".courseCountainer", function(){
        
        $(".addedEmails").append("<p class='appendEmails'>"+$(this).children().eq(2).text()+"</p>");
        $(".handle-container").hide();
        $(".emails").val("");
        sendToHandles.push($(this).children().eq(2).text());
    })
    $(".invite-type-select").on("click", function(){
        var inviteText = $(".invite-text").text();

        if(inviteText == "Email") {
            $(".emails").attr("placeholder", "Enter user name or handle")
            $(".invite-text").text("Handle");
            $(".addedEmails").html("");
            $(".addEmailBtn").hide();
            
        }
        else {
            $(".invite-text").text("Email");
            $(".emails").attr("placeholder", "Enter an email address")
            $(".addedEmails").html("");
            $(".addEmailBtn").show();
        }
    })
    $(".sendPlatformEmail").on("click", function(){
        sendEmailInvite();
    })
})