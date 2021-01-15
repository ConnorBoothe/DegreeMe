$(document).ready(function(){

const socket = io('/');
const videoDiv = document.getElementById('videoDiv');
const videoDivMember = document.getElementById('videoDivMember');
const videoGrid = document.getElementById('video-grid')
const gallery = document.getElementById('gallery');
var userHandle = document.getElementById("userHandle").value;
var host = document.getElementById("host").value;
var hostId = document.getElementById("hostId").value;
var userId = document.getElementById("userId").value;
var inStream = document.getElementById("inStream").value;
var previousStream = document.getElementById("previousStream").value;
window.onbeforeunload = function() {
  return "message"; // Probably won't be shown because custom messages have been dropped in all major browsers
};
function keepAlive(){
    $.ajax({
        type: "get",
        url: "/videochat/gethoststatus/",
        success:function(data)
        {
            var isHostIn = data.isHostIn;
            //console.log the response
            console.log(data);
            if(!isHostIn){
              $.ajax({
                url:"/videochat/leaveStream/"+roomID+"/"+userId,
                type:"POST",
                async: false,
                success:function(data){
                  window.onbeforeunload = null;
                    location.reload();
                    $(window).off('beforeunload');
                },
                error: function(error){
                    console.log(error)
                }
            })
                
            }
            //Send another request in 10 seconds.
            setTimeout(function(){
                keepAlive();
            }, 10000);
        }
    });
    
}

//checking if the user is in a stream
if(inStream==="true"){
    console.log(inStream);
   if(confirm("you are already in a stream do you want to enter this one anyway?")){
    $.ajax({
        url:"/videochat/leaveStream/"+previousStream+"/"+userId,
        type:"POST",
        async: false,
        success:function(data){
            if(data.message==="user left room")
            location.reload();
        },
        error: function(error){
            console.log(error)
        }
    })

   }else{
    window.location.replace("/home");
}
  
}
else{


//connect to the peerjs server
const myPeer = new Peer(undefined,{
    port: 443,
    host: "0.peerjs.com"
})
console.log(" ::"+hostId)
let myStream;
let myScreenShareStream;
const myVideo = document.createElement('video');
myVideo.muted = true;
//myVideo.audio = false;
myVideo.controls = false;
myVideo.autoplay = true;
//this isnt
 //myVideo.play();
const peers = {};
let users = [];
let peerList = [];
//get user video/audio
var getUserMedia = navigator.mediaDevices.getUserMedia({video:true,audio:{echoCancellation:true,
    noiseSuppression:true}});

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
        addVideoStreamMember(myVideo, stream, userHandle);
    })
}
 
    myPeer.on("call", call => {
        $.getJSON("/videochat/getCallerHandle/" ,  function(data){
            let caller = data.caller;
            console.log(caller)
            
            getUserMedia.then(function(stream){
                
                call.answer(stream);
                const video = document.createElement('video');
                
                call.on("stream", userVideoStream =>{
                    console.log("Added stream 1")
                    if(caller===host){
                        console.log("adding host")
                        addVideoStreamHost(video, userVideoStream);
                    }
                    else{
                        console.log("adding member")
                        addVideoStreamMember(video, userVideoStream);
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
        
        
        console.log("user connected: "+ userId)
        getUserMedia.then(function(stream){
            
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

$("#leaveStream").on("click",function(e){
  $.ajax({
    url:"/videochat/leaveStream/"+roomID+"/"+userId,
    type:"POST",
    async: false,
    success:function(data){
        if(data.message==="user left room")
        window.close();
    },
    error: function(error){
        console.log(error)
    }
})

})

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
    keepAlive();
    console.log("here we are adding the host to the stream")
    stream.image = $(".userProfileImg").attr("src");
    stream.username = $(".userProfileName").eq(0).text();
    video.srcObject = stream;
    console.log("Welcome "+userHandle+"!! isn't that"+host+" ")  
    $(video).addClass('hostVid');
    $(video).addClass('hostVidSpec');
    $(video).addClass(' '+caller);
    videoGrid.append(video)
    
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
    videoGrid.append(video);
  
    
 
    
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
    
            addVideoStreamMember(video, userVideoStream);
        
    });

 
    call.on("close", () => {
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
        myScreenShareStream = stream;
        myVideo.srcObject = stream;
        var playPromise = myVideo.play();
    
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

    myScreenShareStream.getTracks().forEach(track => track.stop())
    myVideo.srcObject = myStream;
    var playPromise = myVideo.play();

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
     let videoTrack = myStream.getVideoTracks()[0];
     for (let x=0;x<peerList.length;x++){
             let sender = peerList[x].getSenders().find(function(s){
                 return s.track.kind == videoTrack.kind;
               }) 
               
             sender.replaceTrack(videoTrack);
     }       
   }

   

const muteUnmute = () => {
  const enabled = myStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myStream.getVideoTracks()[0].enabled = true;
  }
}
$(document).on('click','.main__mute_button',muteUnmute);
$(document).on('click','.main__video_button',playStop);


const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
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


    var timerVar = setInterval(countTimer, 1000);
    var totalSeconds = 0;
    function countTimer() {
           ++totalSeconds;
           var hour = Math.floor(totalSeconds /3600);
           var minute = Math.floor((totalSeconds - hour*3600)/60);
           var seconds = totalSeconds - (hour*3600 + minute*60);
           if(hour < 10)
             hour = "0"+hour;
           if(minute < 10)
             minute = "0"+minute;
           if(seconds < 10)
             seconds = "0"+seconds;
           var time = hour + ":" + minute + ":" + seconds;
           return time;
        }


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
        /*
        if(userHandle===host){
            navigator.sendBeacon("endPointToSaveDuration");
        }*/


        var URL = "/videochat/leaveStream/"+roomID+"/"+userId;
        var fd = new FormData();
        fd.append('roomID', roomID);
        fd.append('userId', userId);
    
        navigator.sendBeacon(URL, fd);
      } 
    }

    document.addEventListener(getVisibilityEvent(browserPrefix), handleVisibilityChange, false);
}
  })
