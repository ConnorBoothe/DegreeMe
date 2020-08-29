// $(function(){
//     //localhost socket
//     // var socket = io.connect('http://127.0.0.1:8080');
//     //live socket 
//     var socket = io.connect('http://127.0.0.1:8080');
//     socket.on('connect_failed', function(err){
//         alert(err)
//     })
//     var userHandles = new Array;
//     $(document).ready(function(){
//         $("#usersBtn").on("click", function(){
//             $(".noUsersAdded").hide();
//             //if input field contains @
//             if($("#users").val().includes("@")){
//                 $("#usersDiv").append("<p class='badge badge-dark addedUsers'><span>"+$("#users").val()+"</span><span class='deleteUser'>x</span></p>");
//             }
//             else{
//                 $("#usersDiv").append("<p class='badge badge-dark addedUsers'><span>@"+$("#users").val()+"</span><span class='deleteUser'>x</span></p>");
//             }
//            //empty input field
//             $("#users").val("");
//          })
//          $("#usersDiv").on("click",".deleteUser", function(){
            
//            if($("#usersDiv").children().length < 3){
//             $(".noUsersAdded").show();
//            }
//             var addedArray = [];
//             var x = 0;
//                 $(this).parent().remove();
//                 addedArray.push($(".addedUsers").eq(x).text());
//                 x++;
// })
//     $(".messageHandle").each(function(){
//         userHandles.push($(this).text());
//     })
//     // alert("userHandles")
//     // $(".createThread").on("submit",function(e){
//     //     e.preventDefault();
//     //     alert("new thread submitted")
//     //     //e.preventDefault();
//     //     var userHandles = [$(".msgFormBigTxt span").text()];
//     //   $(this).hide();
//     //     setTimeout(function () {
//     //     $(".success-checkmark").show();
//     //     $(".check-icon").show();
//     //     }, 10);
//     //     setTimeout(function () {
           
//     //     //location.reload();
//     //     }, 700);
//     //     $(document).ready(function() {
//     //     $('.redo').click(function() {
//     //     $('.success, .error').toggle();
//     //     });
//     //     });
       
//     // })
    
//     // socket.on('append thread', function(data){
//     //     $(".messageSideBarContainer").prepend("<a href='/messages?messageId="+data.id+"'><div class='messageSideBar'>"+
          
//     //       "<span class='badge badge-danger messageNotification'>New</span>"+
//     //       "<img class='chatImg' src="+data.img+">"+
//     //       "<div class='chatName'>"+
//     //           "<span>" + data.subject +"</span><br>"+
//     //           "<span class='chatRecentMessage'>Created by<span class='host'>" + data.host + "</span></span>"+
//     //       "</div>"+
          
//     //   "</div>"+
//     //   "</a>");
//     //     //window.location.replace("http://127.0.0.1:3000/messages?messageId="+data.id)

//     // });
// })
// })