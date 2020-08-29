$(document).ready(function(){
    $.ajax({
        url: '/API/notificationCount' ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) { 
            if(parseInt(res) === 0){
                $(".bdge").hide(); 
            }
            else{
                $(".bdge").text(res);  
            } 
    });
    $('.bell').on("click",function(){
        payload = {
            handle: $('.userProfileName').text(),
          }
        $.ajax({
            url: "/zeroNotifications",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  //hide badge if 0 (should be zero)
                  if(result.notificationCount === 0){
                    $(".bdge").hide();
                  }
                  else{
                    $(".bdge").text(result.notificationCount.toString())
                  }
                
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        if($('#showNotifications').css("display") == "none"){
            $('#showNotifications').show();
            $(".blocker").show();
        }
        else{
            $('#showNotifications').hide();
        }
    })
    $('.message').on("click",function(){
        if($('#showNotifications').css("display") == "none"){
            $(".blocker").show();
        }
        
    })
    $('.userProfileName ').on("click",function(){
        if($('#showNotifications').css("display") == "none"){
           
            $(".blocker").show();
        }
    })
    $('.bell').on("click",function(){
        if($('#showNotifications').css("display") == "none"){
            $('#showNotifications').show();
            $(".blocker").show();
        }
        else{
            $('#showNotifications').hide();
        }
    })
    //notifcation bell on hover events
    $('.bell').on("mouseover",function(){
        $('.hint').html($(this).attr('name'))
        //$(this).children().show();
    })
    
    //update notifications on click
$(".bell").on("click", function(){
    //if menu is displaying account items, or if it is hidden
    if($("#showNotifications").children().eq(0).text() !== "Notifications" || $("#showNotifications").css("display") == "none"){
        $("#recentNotifications").text("Notifications");
        $('#showNotifications').show();
        $.ajax({
            url: '/API/Notifications' ,
            method: 'GET',
            error:function(err,str){
                alert(err)
            }
            }).done(function(res) {    
                var notifications = "";
                for(var x=0; x < res.length; x++){

                    if(res[x].seen === true){
                        if(res[x].type.includes("Congrats!")){
                            notifications +=  '<a class="notifLink" href='+res[x].url+'><li class=" notifications"><img class="notifImg" src="../'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><div><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></div></li></a>';
                        }
                        else{
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                            '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                             '<button class=" notifLink"><li class=" notifications"><img class="notifImg" src="../'+res[x].img+'"/><p class="notif">'+res[x].name+ ' '+res[x].type+ '</p><p class="dateTxt1 text-secondary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                                                }
                    }
                    else{
                        if(res[x].type.includes("Congrats!")){
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                             '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                            '<button class=" notifLink"><div class="blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="../'+res[x].img+'"/><p class="notif">'+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                        }
                        else{
                            notifications += "<form method='POST' action='/seenNotif' class='seenNotif'>"+'<input type="hidden" name="url" value="'+res[x].url+'"/>'+
                            '<input type="hidden" name="notifId" value="'+res[x]._id+'"/>'+
                             '<button class=" notifLink"><div  class=" blue-dot bg-primary"></div><li class=" notifications"><img class="notifImg" src="../'+res[x].img+'"/><p class="notif">'+res[x].name+ ' '+res[x].type+ '</p><p class="dateTxt1 text-primary">'+displayTimeSince(res[x].date)+'</p></li></button></form>';
                        
                        }
                    }
                }
                if(notifications != ""){
                    $("#showNotifications ul").html(notifications)
                }
                else{
                    $("#showNotifications ul").html("<p class='emptyNotifications'>Notifications will display here.</p>")
                }
                
        });
    }
     //hide menu on second click of same item
     else if( $("#recentNotifications").text() == "Notifications" ){
        $('#showNotifications').hide();
        $(".blocker").hide();
    }
})

//mark notification as seen when clicked
$("#showNotifications").on("submit",".seenNotif", function(e){
    e.preventDefault();
    payload = {
        notifId:$(this).children().eq(1).val(),
        url:$(this).children().eq(0).val()
        
      
      }
    $.ajax({
        url: "/Seen",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
             window.location.href= result.url;
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
})
//mark notification as seen when clicked
$("#showNotifications").on("click",".sawMessage", function(e){
    payload = {
        threadId:$(this).prev().val(),
        handle:$(this).prev().prev().val()
      }
    $.ajax({
        url: "/SeenMsg",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
              //hide badge if 0 (should be zero)
             window.location.href= result.threadURL;
            
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
    e.preventDefault();


});
//user menu item is clicked
$(".userHeader").on("click", function(){
     //if menu is displaying notifications, or if it is hidden
    if($("#showNotifications").css("display") == "none" || $("#showNotifications").children().eq(0).text() == "Notifications"){
        $("#showNotifications").show();
    }
    //hide on double click
    else if($("#showNotifications").children().eq(0).text() == "Account"){
        $("#showNotifications").hide();
        $(".blocker").hide();
    }
    $("#recentNotifications").text("Account");
    $("#showNotifications ul").html('<ul>'+
        '<a id="" href="/Settings"><li><span class="accountIcon"><svg class="bi bi-gear-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z"/>'+
      '</svg></span><span class="text-light profileMenuTitle">Settings</span></li></a>'+
        '<a id="" href="/MyFinances"><li><span class="accountIcon"><svg class="bi bi-bar-chart-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<rect width="4" height="5" x="1" y="10" rx="1"/>'+
        '<rect width="4" height="9" x="6" y="6" rx="1"/>'+
        '<rect width="4" height="14" x="11" y="1" rx="1"/>'+
      '</svg></span><span class="text-light profileMenuTitle">My Finances</span></li></a>'+
      '<a id="" href="/User/'+$(".userProfileName").text()+'"><li><span class="accountIcon"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-person-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
      +'<path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>'
    +'</svg></span><span class="text-light profileMenuTitle">My Profile</span></li></a>'+
    '<a id="" href="/TutoringSessions"><li><span class="accountIcon"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-calculator-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
    '<path fill-rule="evenodd" d="M12 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>'+
    '<path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"/>'+
  '</svg></span><span class="text-light profileMenuTitle">My Tutoring Sessions</span></li></a>'+
      '<a href="mailto:connorboothe@gmail.com"><li><span class="accountIcon"><svg class="bi bi-chat-square-dots" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>'
      +'<path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>'
   +'</svg></span><span class="text-light profileMenuTitle">Customer Support</span></li></a>'+
   '<a id="logout" href="/logout"><li><span class="accountIcon"><svg class="bi bi-exclamation-triangle" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
   '<path fill-rule="evenodd" d="M7.938 2.016a.146.146 0 0 0-.054.057L1.027 13.74a.176.176 0 0 0-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 0 0 .066-.017.163.163 0 0 0 .055-.06.176.176 0 0 0-.003-.183L8.12 2.073a.146.146 0 0 0-.054-.057A.13.13 0 0 0 8.002 2a.13.13 0 0 0-.064.016zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>'+
   '<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>'+
 '</svg></span><span class="text-light profileMenuTitle">Log Out</span></li></a>'+
    '</ul>');
});
$(".message").on("click", function(){
    if($("#recentNotifications").text() !== "Messages" || $("#showNotifications").css("display") == "none"){
        $("#showNotifications").show();
        $("#recentNotifications").text("Messages");
        $.ajax({
            url: '/API/Threads' ,
            method: 'GET',
            error:function(err,str){
                alert(err)
            }
            }).done(function(res) {  
                var threads =  "<form method='POST' action='/seenMsg' class='seenMsg'>" +
                '<div class=" "><button  type="button" class="startConversation-button" data-toggle="modal" data-target="#exampleModal1"><h4 class="startConversation" >Start a Conversation</h4></button></div>';
                for(var x=res.length-1; x>=0; x--){
                    if(res[x].unreadCount === 0){
                        threads +=  '<a href=../messages?messageId='+res[x].threadId+'><li class=" notifications"><div><div class="blue-dot"></div> <img class="notifImg" src="../'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p><p class="text-secondary">Created '+displayTimeSince(res[x].timestamp)+'</p></div></a></li>';
                     
                    }
                    else{
                        threads +=  
                        '<li class=" notifications"><div>'+
                        "<input type= 'hidden' name='handle' value='"+$(".userProfileName").text()+"'/>"+
                        "<input type= 'hidden' name='threadId' value='"+res[x].threadId+"'/>"+
                       
                         '<button class="sawMessage"><div class="blue-dot bg-primary"></div> <img class="notifImg" src="'+res[x].hostImg+'"/><p class="notif">'+res[x].subject+'</p><p> '+ "<p class='text-primary'>"+res[x].unreadCount+" unread messages</p>"+'</p></div></button></li>';
                    }
                 
                }
                threads+= "</form>";
                $("#showNotifications ul").html(threads)
        });
    }
    else{
        $("#showNotifications").hide();
        $(".blocker").hide();
    }


})
$.ajax({
    url: '/API/Threads' ,
    method: 'GET',
    error:function(err,str){
        alert(err)
    }
    }).done(function(res) {   
        var count = 0;
       for(var x=res.length-1; x>=0; x--){
            count+= res[x].unreadCount;
        }
        if(count > 0){
            $(".bdge1").text(count)
        }
        else{
            $(".bdge1").hide();
        } 
});
})