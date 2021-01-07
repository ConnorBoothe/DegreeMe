const socket = io('/');
const videoDiv = document.getElementById('videoDiv');
const videoDivMember = document.getElementById('videoDivMember');
var userHandle = document.getElementById("userHandle").value;
var host = document.getElementById("host").value;
var hostId = document.getElementById("hostId").value;
var userId = document.getElementById("userId").value;
var inStream = document.getElementById("inStream").value;

//checking if the user is in a stream
if(inStream==="true"){
    console.log(inStream);
    alert("you are already in a stream you have to exit that stream before you can get into this one");
    window.location.replace("/home");
    
  
}

//connect to the peerjs server
const myPeer = new Peer(undefined,{
    port: 443,
    host: "0.peerjs.com"
})
console.log(" ::"+hostId)
let myStream;
const myVideo = document.createElement('video');
//myVideo.muted = true;
//myVideo.audio = false;
//myVideo.controls = true;
//this isnt
 //myVideo.play();
const peers = {};
let users = [];
let peerList = [];
//get user video/audio
var getUserMedia = navigator.mediaDevices.getUserMedia({video:true,audio:true});

    if(userHandle===host){
    getUserMedia.then(function(stream){
        addVideoStreamHost(myVideo, stream);
        myStream = stream;
        $.ajax({
            url:"/videochat/updatehoststatus/",
            type:"POST",
            success:function(data){
                console.log(data);
            },
            error: function(error){
                console.log(error)
            }
        })

    })
}else{
    getUserMedia.then
    (function(stream){
        myStream = stream;
        addVideoStreamMember(myVideo, stream);
    })
}
 
    myPeer.on("call", call => {
        $.getJSON("/videochat/getCallerHandle/" ,  function(data){
            let caller = data.caller;
            console.log(caller)
            alert("here is a call");
            getUserMedia.then(function(stream){
                alert("here is a stream");
                call.answer(stream);
                const video = document.createElement('video');
                
                call.on("stream", userVideoStream =>{
                    console.log("Added stream 1")
                    if(caller===host){
                        console.log("adding host")
                        addVideoStreamHost(video, userVideoStream, caller);
                    }
                    else{
                        console.log("adding member")
                        addVideoStreamMember(video, userVideoStream, caller);
                    }
                            
                        
                    
                })

                peerList.push(call.peerConnection);
                call.on('close', function(){
                    video.remove();
              });
    
            })
     

        })
     
     
    })
    socket.on("user-connected", userId =>{
        
        alert("here is a user-connected");
        console.log("user connected: "+ userId)
        getUserMedia.then(function(stream){
            alert("here is a user stream");
            console.log(stream);
            connectToNewUser(userId, stream);
        })
        
    })



socket.on("user-disconnected",function(userId){
    
    if(peers[userId]){
        peers[userId].close();
    }

    console.log(userId+ " disconnected")

    payload = {
        roomId:""
    }
    // $.ajax({
    //     url: "/leaveStream",
    //     type: 'POST',
    //     data: JSON.stringify(payload),
    //     headers: {
    //       "Content-Type": "application/json"
    //     }, statusCode: {
    //     //   202: function (result) {
    //     //     $("input[name='showChat']").val(result.chatStatus);
    //     //     toggleChat(result.chatStatus)
    //       },
    //       500: function (result) {
    //         alert("500");
    //       },
    //     })
      });
   


myPeer.on("open",  id => {
    //emit when new user joins the room
    socket.emit('join-room',roomID, id, userHandle, userId)
    console.log(id + " joined")
});



$("#stopSharing").hide();
$("#shareScreen").on("click",function(e){
    
    /*
    
    navigator.mediaDevices.getDisplayMedia({video:true,audio:true}).then(function(stream){
        if(userHandle===host){
        addVideoStreamHost(myVideo,stream, userHandle);}
        else{
        addVideoStreamMember(myVideo,stream, userHandle);}
        users.forEach(peer => {
            myPeer.call(peer,stream)
        });
    })*/
    screenshare();
    $(this).hide();
    $("#stopSharing").show();
})

$("#stopSharing").on("click", function(e){
/*    getUserMedia.then(function(stream){
        if(userHandle===host){
            addVideoStreamHost(myVideo,stream, userHandle);}
            else{
            addVideoStreamMember(myVideo,stream, userHandle);}
            users.forEach(peer => {
                myPeer.call(peer,stream)
            });
    })*/
    stopScreenShare();
    $(this).hide();
    $("#shareScreen").show();
})

function addVideoStreamHost(video, stream, caller){
    console.log("here we are adding the host to the stream")
    stream.image = $(".userProfileImg").attr("src");
    stream.username = $(".userProfileName").eq(0).text();
    video.srcObject = stream;
    video.controls = true;
    console.log("Welcome "+userHandle+"!! isn't that"+host+" ")   
    
    $(video).addClass('hostVid');
    $(video).addClass('hostVidSpec');
    $(video).addClass(' '+caller);
    $(videoDiv).append(video)
    
    var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
    && video.readyState > 2;

    if (!isPlaying) {
        console.log("its not playing")
        var myPlayPromise = video.play();
        if (myPlayPromise !== undefined) {
            myPlayPromise.then(_ => {
              // Automatic playback started!
              // Show playing UI.
            })
            .catch(error => {
              // Auto-play was prevented
              // Show paused UI.
              console.log(error)
            });
          }
        }
    // video.addEventListener("loadmetadata", () => {
    //      video.play();  
    // });
}

function addVideoStreamMember(video, stream, caller){
    console.log(stream)
    stream.image = $(".userProfileImg").attr("src");
    stream.username = $(".userProfileName").eq(0).text();
    video.srcObject = stream;
    video.controls = true;
    console.log("trying to get in as a member") 
    video===myVideo?console.log("the same"):console.log("not the same");
    var isPlaying = myVideo.currentTime > 0 && !myVideo.paused && !myVideo.ended 
    && myVideo.readyState > 2;
    if (!isPlaying) {
        console.log("its not playing")
       
        }
    if (isPlaying) {
            console.log("its playing")
           
            }

    console.log("trying to play")
    $(video).addClass('hostVid');
    $(video).addClass(' '+caller);
    var row1 = $("#row1").children().length;
    var row2 = $("#row2").children().length;
    if(row1<=2){
        $("#row1").append(video)
    }
    else{
        $("#row2").append(video)
    }
    
    var playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        console.log(error)
      });
    }
    // video.addEventListener("loadmetadata", () => {
    //      video.play();  
    // });
}

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    
    
    
    $.ajax({
        url:"/videochat/postCallerHandle/"+userHandle,
        type:"POST",
        success:function(data){
            console.log(data);
        },
        error: function(error){
            console.log(error)
        }
    })
    call.on("stream", userVideoStream => {
        console.log("added stream 2")
        
    
            addVideoStreamMember(video, userVideoStream)
        
    });

 
    call.on("close", () => {
        alert("close")
        video.remove();
    })
    users.push(userId);
    peerList.push(call.peerConnection);
    peers[userId] = call;
    console.log(peers)
}

//screenShare
const screenshare = () =>{
    navigator.mediaDevices.getDisplayMedia({ 
        video:{
          cursor:'always'
        },
        audio:{
               echoCancellation:true,
               noiseSupprission:true
        }
   
    }).then(stream =>{
        let videoTrack = stream.getVideoTracks()[0];
            videoTrack.onended = function(){
              stopScreenShare();
            }
            for (let x=0;x<peerList.length;x++){
              
              let sender = peerList[x].getSenders().find(function(s){
                 return s.track.kind == videoTrack.kind;
               })
               
               sender.replaceTrack(videoTrack);
          }
      
     })
     
    }
   
   function stopScreenShare(){
     let videoTrack = myStream.getVideoTracks()[0];
     for (let x=0;x<peerList.length;x++){
             let sender = peerList[x].getSenders().find(function(s){
                 return s.track.kind == videoTrack.kind;
               }) 
             sender.replaceTrack(videoTrack);
     }       
   }

/*
lifecycle.addEventListener('statechange', function(event) {

    if (event.originalEvent == 'visibilitychange' && event.newState == 'hidden') {
      var URL = "/videochat/leaveStream/";
      var fd = new FormData();
      fd.append('roomID', roomID);
      fd.append('userId', userId);
  
      navigator.sendBeacon(URL, fd);
      alert("queuing beacon")
    }
  });*/
  $(document).ready(function(){
    var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];

    // get the correct attribute name
    function getHiddenPropertyName(prefix) {
      return (prefix ? prefix + 'Hidden' : 'hidden');
    }
    
    // get the correct event name
    function getVisibilityEvent(prefix) {
      return (prefix ? prefix : '') + 'visibilitychange';
    }
    
    // get current browser vendor prefix
    function getBrowserPrefix() {
      for (var i = 0; i < browserPrefixes.length; i++) {
        if(getHiddenPropertyName(browserPrefixes[i]) in document) {
          // return vendor prefix
          return browserPrefixes[i];
        }
      }
    
      // no vendor prefix needed
      return null;
    }
    
    // bind and handle events
    var browserPrefix = getBrowserPrefix();
    var unloading = false;
    window.addEventListener("beforeunload", function() {
     unloading = true;
  
             console.log("1: beforeunload, could ask for confirmation");
    });
    function handleVisibilityChange() {
      if(document[getHiddenPropertyName(browserPrefix )]&&unloading) {
        // the page is hidden
        alert("queuing beacon")
        var URL = "/videochat/leaveStream/"+roomID+"/"+userId;
        var fd = new FormData();
        fd.append('roomID', roomID);
        fd.append('userId', userId);
    
        navigator.sendBeacon(URL, fd);
      } 
    }

    document.addEventListener(getVisibilityEvent(browserPrefix), handleVisibilityChange, false);
    
  })
