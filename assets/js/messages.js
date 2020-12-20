
    //connect to the websocket
    var socket = io.connect({transports: ['websocket']});
    socket.connect();
    //initialize DOM variables
    var messageForm = $("#messageForm");
    var chat = $('#messagesContainer');
    //youtube url regex

    // var userHandles = new Array;
    $(document).ready(function () {
        //initialize the image attachment array
        var imageArray = [];
        //imageNumber variable used to route the image to the
        //correct message bubble after it is uploaded to firebase
        var imageNumber = 0;
        //initialize DOM elements used in send message and send image
        var id = $(".threadId").val();
        var sender = $(".userProfileName").eq(0).text();
        var senderImg = $(".userProfileImg").attr("src");
        var messageField = $(".msgInput input");
        //probably removing this
        // $(".messageHandle").each(function (x) {
        //     userHandles.push($(this).text().trim());
        // })
        messageForm.on("submit", function (e) {
            e.preventDefault();
            if(imageArray.length > 0){
                //if text is in the message
                if (messageField.val().trim() != "") {
                    
                    sendMessage(id, sender, senderImg);
                }
                else {
                    //image is sent without text
                    $('audio#pop')[0].play();
                    sendImage(id, sender, senderImg, imageArray, imageNumber);
                }
            }
            else {
                //runs when there are no image attachments
                if (messageField.val().trim() != "") {
                    sendMessage(id, sender, senderImg);
                    //clear the text in message field
                    messageField.val('');
                }
            }
        });
        socket.on("append youtube info", (data, err)=>{
            console.log(data)
            appendYoutubeDetails(data.video.thumbnail, data.video.link, 
                data.video.title);
        })
        socket.on('new message', function (data, err) {
            console.log(data)
            if(err){
                alert(err)
            }
            //play the pop sound
            $('audio#pop')[0].play();
            //append the chat to the DOM
            appendChat(id, data, data.msg._id);
            //if images attached, save images to firebase and send the url to the server to be saved to MessagesDB
            if(imageArray.length > 0 ) {
                sendImage(id, sender, senderImg, imageArray, imageNumber);
            }
        })
        socket.on("append image", function(data){

            imageArray = data.imageArray;
            $(".new-image"+imageNumber).html("<a target='_blank' href='"+data.image+"'><img src='"+data.image+"'/></a>");
            imageNumber++;
            setTimeout(()=>{
                $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);
            },300);            //if there are more images to be saved
            if(data.imageArray.length > 0) {
                sendImage(id, sender, senderImg, imageArray, imageNumber);
            }
            else{
                
            }
            
            //clear attachments
        })
        //image upload to messages
        $(".message-file").on("change", function(){
            var filename = $(".message-file").val().replace(/C:\\fakepath\\/i, '')
            var accept = validateImage(filename);
            if(accept) {
                readURL($(".message-file")[0], imageArray, $(".message-file"));
            }
            else{
                $('.toast-body').show();
                setTimeout(function(){
                    $('.toast-body').hide();
                }, 1000)
                
            }
        })
        //remove image upload
        $(".image-attachments").on("click", ".delete-badge", function(){
            var name = $(this).next().attr("name");
            //remove attachment from array
            removeAttachmentFromArray(name, imageArray);
            //remove attachment from the DOM
            $(this).parent().remove();
        })
        socket.on('disconnect', function(){
            $(".user-disconnected").fadeIn();
            console.log('user disconnected');
        });
    })
