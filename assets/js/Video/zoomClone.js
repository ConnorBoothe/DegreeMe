const socket = io('/');
const videoDiv = document.getElementById('videoDiv');
var userHandle = document.getElementById("userHandle").value;
var host = document.getElementById("host").value;
var userId = document.getElementById("userId").value;
//connect to the peerjs server
const myPeer = new Peer(undefined,{
    host: "/",
    port: "3001"
})
const myVideo = document.createElement('video');
myVideo.muted = true;
myVideo.audio = false;
myVideo.controls = true;
myVideo.setAttribute("class", "memberVideo")
//this isnt
 myVideo.play();
const peers = {};
//get user video/audio
navigator.mediaDevices.getUserMedia({
    video:true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream, userHandle);
    myPeer.on("call", call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on("stream", userVideoStream =>{
            console.log("Added stream")
            addVideoStream(video, userVideoStream, "@cboothe");
        })
    })
    socket.on("user-connected", userId =>{
        console.log("user connected: "+ userId)
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

function addVideoStream(video, stream, handle){
    console.log(stream)
    stream.image = $(".userProfileImg").attr("src");
    stream.username = $(".userProfileName").eq(0).text();
    video.srcObject = stream;
    video.controls = true;
    if(handle === host){
        video.setAttribute("class", "hostVid")
        $(videoDiv).append(video)
     }
    else if(handle != host){
        video.setAttribute("class", "memberVideo")

    }
    $(".member-div").append(video);
    video.play();
    // video.addEventListener("loadmetadata", () => {
    //      video.play();  
    // });
}
function connectToNewUser(userId, stream){
    alert("connect")
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream, "@cboothe" )
    });
    call.on("close", () => {
        alert("close")
        video.remove();
    })

    peers[userId] = call;
    console.log(peers)
}