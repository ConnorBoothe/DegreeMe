const socket = io("http://127.0.0.1/messages:8080");

socket.on("chat-message", data=>{
    console.log(data);
})