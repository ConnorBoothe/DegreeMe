//functions used to send messages and images in chat
//yt url regex
const youtubeRegEx = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const Youtube_API_Key = "AIzaSyBYIBBdubBz9TS5VspamQIascTlKjQ2y5A";
//read URL to display image upload preview
function readURL(input, imageArray, inputVal) {
    if (input.files && input.files[0]) {
        var filename = inputVal.val().replace(/C:\\fakepath\\/i, '');
        imageArray.push({ name: filename, image: input.files[0] });
        var reader = new FileReader();
        var image = "";
        reader.onload = function (e) {
            image = "<div class='img-container'>" +
                "<span class='delete-badge badge badge-secondary'>" +
                '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="white" xmlns="http://www.w3.org/2000/svg">' +
                '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                '</svg>' +
                '</span>' +
                "<img name='" + filename + "' src='" + e.target.result + "'/></div>";
            $(".image-attachments").append(image);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
//save image to firebase and save to DB using websocket
function sendImage(id, sender, senderImg, imageArray, imageNumber) {
    $(".image-attachments").html("");
    chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
        '<div class="msg_">' +
        '<div class="messageBody sentMsg bg-primary message-image new-image'+imageNumber+'">' +
        '<div class="spinner-border" role="status">' +
        '<span class="sr-only"></span>' +
        '</div>' +
        '<span class="loading-span">Loading Image</span>' +
        '</div>' +
        '<p class="msg-date msg-date-sent"></p>' +
        '</div></div>');
        $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);

    var storageRef = firebase.storage().ref("attachments/" + imageArray[0].name);
    storageRef.put(imageArray[0].image)
        .then(function () {
            storageRef.getDownloadURL().then(function (url) {
                imageArray.splice(0,1)
                
                socket.emit("send image", 
                    {
                        id: id,
                        sender: sender,
                        senderImg: senderImg,
                        content: url,
                        date: new Date,
                        imageArray: imageArray

                    })
            })
        })
}
function sendMessage(id, sender, senderImg) {
    window.scrollTo(0, $(document).height());
    socket.emit('send message', {
        id: id,
        sender: sender,
        senderImg: senderImg,
        content: $(".msgInput input").val(),
        date: new Date,
        hasImage: false
    });
}
function appendYoutubeDetails(thumbnail, link, title) {
    chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
                '<div class="msg_ ">' +
                '<a target="_blank" href="'+link+'">'+
                '<div class="messageBody sentMsg bg-primary">'+
                '<img class="yt-logo" src= "../assets/img/yt-logo.svg"/>'+
                '<div class="thumbnail-container"><img src="'+thumbnail+'" class="yt-thumbnail"/></div>'+
                '<span class="text-light yt-title">'+ title +'</span></div></div>' +
                '</a>'+
                '<p class="msg-date msg-date-sent"></p>' +
                '</div></div>');
                
                setTimeout(()=>{
                    $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);
                },100);

                

}
//append chat to the DOM on new message
function appendChat(threadId, data, messageId) {
    console.log(messageId)
    if (data.msg.threadId === threadId) {
        if (data.msg.sender === $(".userProfileName").eq(0).text()) {
            //if youtube link
            if(youtubeRegEx.test(data.msg.content)){
                $.ajax({
                    type: 'GET',
                    url: 'https://www.googleapis.com/youtube/v3/search',
                    data: {
                        key: Youtube_API_Key,
                        q: data.msg.content,
                        part: 'snippet',
                        maxResults: 1,
                        type: 'video',
                        videoEmbeddable: true,
                    },
                    success: function(data){
                        
                            var thumbnail = data.items[0].snippet.thumbnails.default.url;
                            var link ='https://www.youtube.com/watch?v=' + data.items[0].id.videoId;
                            var title = data.items[0].snippet.title; 
                        socket.emit("send youtube link",
                            {
                                id: messageId,
                                thumbnail: thumbnail,
                                link: link,
                                title: title
                            })

                    },
                    error: function(response){
                        console.log("Request Failed");
                    }
                  });
            }
            else {
                chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
                '<div class="msg_ ">' +
                '<p class="messageBody sentMsg bg-primary">' + data.msg.content + '</p></div>' +
                '<p class="msg-date msg-date-sent"></p>' +
                '</div></div>');
                $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);

            }
            
        } else {
            if(youtubeRegEx.test(data.msg.content)){
                alert("YOUTUBE!!!")
            }
            chat.append('<div class="containMessageReceived">' +
                '<img class="messageImg" src="' + data.msg.senderImg +
                '" /><p class="sender_handle"' +
                data.msg.sender +
                '</p><div class="msg_1" style="left:0px">' +
                '<p class="messageBody receivedMsg">' + data.msg.content +
                '</p>' +
                '</div>' +
                '<p class="msg-date msg-date-sent">' + displayTimeSince(data.msg.date) + '</p>' +
                '</div>');
            window.scrollTo(0, $(document).height() + 100);
        }
    }
}
// //remove attachment from the DOM
function removeAttachmentFromArray(name, imageArray){
    //remove image from image array
    for(var i = 0; i < imageArray.length; i++) {
       if(imageArray[i].name == name){
            imageArray.splice(i, 1);
            break;
       }
    }
}
function formatTime(date) {
    var difference = Math.abs(new Date() - (new Date(date)));
    var secDifference = parseInt(difference / 1000);
    var minDifference = parseInt(secDifference / 60);
    var hourDifference = parseInt(minDifference / 60);
    var dayDifference = parseInt(hourDifference / 24);
    if(secDifference < 60){
        return secDifference + " seconds ago";
    }
    else if(secDifference < 120){
        return minDifference + " minute ago";
    }
    else if(secDifference > 60 && minDifference < 60){
        return minDifference + " minutes ago";
    }
    else if(minDifference < 120){
        return hourDifference + " hour ago";
    }
    else if(minDifference > 120 && hourDifference < 24){
        return hourDifference + " hours ago";
    }
    else if(hourDifference < 48){
        return dayDifference + " day ago";
    }
    else{
        return dayDifference + " days ago";
    }
  }
  function formatDate(date) {
    var dateArray = date.toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
    for (var x = 0; x < monthArray.length; x++) {
      if (monthArray[x].includes(dateArray[1])) {
        month = monthArray[x];
      }
    }
    if (todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2]) {
      return "Today";
    } else if (month == "") {
      return "";
    } else {
    if(dateArray[2].split("")[0] == "0"){
      return month + " " +dateArray[2].split("")[1];
    }
    else{
      return month + " " + dateArray[2];
    }
    }
  }
  function unescapeApostrophe(string){
    var escapedApostrophe = "&#39;";
    if(string.includes(escapedApostrophe)){
         var newString = string.replace(/&#39;/g, "'");
         return newString;
    }
    else{
        return string;
    }
}
function validateImage(image){
    var imageLowerCase = image.toLowerCase();
    if(imageLowerCase.includes("png") || imageLowerCase.includes("jpeg") ||
    imageLowerCase.includes("jpg") ||imageLowerCase.includes("pdf") ){
        return true;
    }
    else {
        return false;
    }
    
}