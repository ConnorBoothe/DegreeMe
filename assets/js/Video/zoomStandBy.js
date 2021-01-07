const socket = io('/');
const videoDiv = document.getElementById('videoDiv');
const videoDivMember = document.getElementById('videoDivMember');
var userHandle = document.getElementById("userHandle").value;
var host = document.getElementById("host").value;
var hostId = document.getElementById("hostId").value;
var userId = document.getElementById("userId").value;
//connect to the peerjs server
const myPeer = new Peer(undefined,{
    port: 443,
    host: "0.peerjs.com"
})
let isHostIn = false;

//Our custom function.
function send(){
    $.ajax({
        type: "get",
        url: "/videochat/gethoststatus/",
        success:function(data)
        {
            isHostIn = data.isHostIn;
            //console.log the response
            console.log(data);
            if(isHostIn){
                location.reload();
                return;
            }
            //Send another request in 10 seconds.
            setTimeout(function(){
                send();
            }, 10000);
        }
    });
    
}
    
  
        
send();
    


