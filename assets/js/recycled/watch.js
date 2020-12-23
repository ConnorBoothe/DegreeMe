// let peerConnection;
// // const config = {
// //   iceServers: [
// //       { 
// //         "urls": "stun:stun.l.google.com:19302",
// //       },
// //       // { 
// //       //   "urls": "turn:TURN_IP?transport=tcp",
// //       //   "username": "TURN_USERNAME",
// //       //   "credential": "TURN_CREDENTIALS"
// //       // }
// //   ]
// // };
// const socket = io.connect(window.location.origin);
// const video = document.querySelector("video");
// const enableAudioButton = document.querySelector("#enable-audio");
// enableAudioButton.addEventListener("click", enableAudio)
// //start screen capture
// async function startCapture(displayMediaOptions) {
//   let captureStream = null;

//   try {
//     captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
//   } catch(err) {
//     console.error("Error: " + err);
//   }
//   return captureStream;
// }
// $(document).ready(function(){


// socket.on("offer", (id, description) => {
// console.log("offer")
//   peerConnection = new RTCPeerConnection(config);
//   console.log("Peere Conn: " + peerConnection)
//   peerConnection
//     .setRemoteDescription(description)
//     .then(() => peerConnection.createAnswer())
//     .then(sdp => peerConnection.setLocalDescription(sdp))
//     .then(() => {
//       socket.emit("answer", id, peerConnection.localDescription);
//     });
//   peerConnection.ontrack = event => {
//     video.srcObject = event.streams[0];
//   };
//   peerConnection.onicecandidate = event => {
//     if (event.candidate) {
//       socket.emit("candidate", id, event.candidate);
//     }
//   };
// });


// socket.on("candidate", (id, candidate) => {
//   console.log("Candidate")
//   peerConnection
//     .addIceCandidate(new RTCIceCandidate(candidate))
//     .catch(e => console.error(e));
// });
// socket.on("connect", () => {
//   socket.emit("watcher", {
//     handle: $("input[name='handle']").val(), 
//     role: $("input[name='host']").val(), 
//     image: $("input[name='userImg']").val(),
//     streamId: $("input[name='stream']").val()
//   }
//     );
// });

// socket.on("broadcaster", () => {
//   alert("New member")
  
//   socket.emit("watcher");
// });

// socket.on("leave stream", () => {
//   socket.emit("remove member", {

//   })
//   alert("Disconnect peer")
//   peerConnection.close();

// });

// window.onunload = window.onbeforeunload = () => {
//   alert("UNLOAF")
//   socket.close();
// };
// })
// function enableAudio() {
//   if(video.muted) {
//     // console.log("Enabling audio")
//     $(".toggleMute").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-mic-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
//     '<path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>'+
//     '<path fill-rule="evenodd" d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>'+
//   '</svg>');
//   video.muted = false;
//   }
//   else{
//     $(".toggleMute").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-mic-mute-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
//     '<path fill-rule="evenodd" d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963L11 7.879zM5 6.12l4.486 4.486A3 3 0 0 1 5 8V6.121zm8.646 7.234l-12-12 .708-.708 12 12-.708.707z"/>'+
//   '</svg>');
//     video.muted = true;
//   }
// }
