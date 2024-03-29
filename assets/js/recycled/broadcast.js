const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
const peerConnections = {};
const { RTCPeerConnection, RTCSessionDescription } = window;
const config = {
  iceServers: [
    { 
      "urls": "stun:stun.l.google.com:19302",
    },
    // { 
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ]
};
// const socket = io.connect(window.location.origin);
$(document).ready(function(){


socket.on("answer", (id, description) => {
  peerConnections[id].setRemoteDescription(description);
});

socket.on("watcher", id => {
  const peerConnection = new RTCPeerConnection(config);
  console.log("Peer Conn: " + peerConnection);
  peerConnections[id] = peerConnection;

  let stream = videoElement.srcObject;
  // stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  // peerConnection.onicecandidate = event => {
  //   if (event.candidate) {
  //     socket.emit("candidate", id, event.candidate);
  //   }
  // };

  // peerConnection
  //   .createOffer()
  //   .then(sdp => peerConnection.setLocalDescription(sdp))
  //   .then(() => {
  //     socket.emit("offer", id, peerConnection.localDescription);
  //   });
});

// socket.on("candidate", (id, candidate) => {
//   $(".video-container").append('<div class="video-sub-container">'+
//   ' <video playsinline autoplay muted></video></div>'
//   )
//   peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
// });

socket.on("disconnectPeer", id => {
  peerConnections[id].close();
  delete peerConnections[id];
});

window.onunload = window.onbeforeunload = () => {
  alert("CLOSE")
  socket.close();
};

// Get camera and microphone
const videoElement = document.querySelector("video");
const audioSelect = document.querySelector("select#audioSource");
const videoSelect = document.querySelector("select#videoSource");

audioSelect.onchange = getStream;
videoSelect.onchange = getStream;

getStream()
  .then(getDevices)
  .then(gotDevices);

function getDevices() {
  return navigator.mediaDevices.enumerateDevices();
}
function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos;
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement("option");
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === "audioinput") {
      option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
      audioSelect.appendChild(option);
    } else if (deviceInfo.kind === "videoinput") {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const audioSource = audioSelect.value;
  const videoSource = videoSelect.value;
  const constraints = {
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
    video: { deviceId: videoSource ? { exact: videoSource } : undefined }
  };
  return navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

function gotStream(stream) {
  window.stream = stream;
  audioSelect.selectedIndex = [...audioSelect.options].findIndex(
    option => option.text === stream.getAudioTracks()[0].label
  );
  videoSelect.selectedIndex = [...videoSelect.options].findIndex(
    option => option.text === stream.getVideoTracks()[0].label
  );
  videoElement.srcObject = stream;
  socket.emit("broadcaster",
  {
    handle: $("input[name='handle']").val(), 
    host: $("input[name='host']").val(), 
    image: $("input[name='userImg']").val(),
    streamId: $("input[name='stream']").val()
  });
}

function handleError(error) {
  console.error("Error: ", error);
}

async function callUser(socketId) {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  
  socket.emit("call-user", {
    offer,
    to: socketId
  });
 }
})