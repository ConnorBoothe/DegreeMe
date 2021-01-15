
    //connect to the websocket
    var socket = io.connect({transports: ['websocket']});
    socket.connect();

    $(document).ready(function () {
        //initialize the image attachment array
        var imageArray = [];
        //imageNumber variable used to route the image to the
        //correct message bubble after it is uploaded to firebase
        var imageNumber = 0;
        //initialize DOM elements
        var messageForm = $("#messageForm");
        var sender = $(".userProfileName").eq(0).text();
        var senderImg = $(".userProfileImg").attr("src");
        var messageField = $(".msgInput input");
        var currPage = window.location.href.split("/")[3];
        var id = "";
        var sendCount = 0;
        chat = $('#messagesContainer');
       
        messageForm.on("submit", function (e) {
            sendCount = 0;
           id = $(".threadId").val()
            
            e.preventDefault();
            if(imageArray.length > 0){
                //if text is in the message
                if (messageField.val().trim() != "") {
                    sendMessage(id, sender, senderImg);
                }
                else {
                    //image is sent without text
                    $('audio#pop')[0].play();
                    sendImage(id, sender, senderImg, imageArray, imageNumber, chat);
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
            
            if(data.sender == $("input[name='userId']").val()) {

            appendYoutubeDetails(data.video.thumbnail, data.video.link, 
                data.video.title, chat);
            }
            else{
                appendSentYoutubeDetails(data.video.thumbnail, data.video.link, 
                    data.video.title, chat, data.sender, data.senderImg); 
            }
        })
        socket.on('new message', function (data, err) {
            if(err){
                alert(err)
            }
            id = $(".threadId").val();
            
            //play the pop sound
            $('audio#pop')[0].play();
            //append the chat to the DOM
            appendChat(id, data, data.msg._id, chat);
            //if images attached, save images to firebase and send the url to the server to be saved to MessagesDB
            if(imageArray.length > 0 ) {
                sendImage(id, sender, senderImg, imageArray, imageNumber);
            }
        })
        socket.on("append image", function(data){
            id = $(".threadId").val()
            imageArray = data.imageArray;
            var actualSender = "";
            if(sendCount == 0) {
                actualSender = sender;
            }
            sendCount++;
            if(data.sender == $("input[name='userId']").val()) {
             
                $(".new-image"+imageNumber).html("<a target='_blank' href='"+data.image+"'><img src='"+data.image+"'/></a>");
            }
            else if(data.sender != $("input[name='userId']").val()) {
                chat.append('<div class="containMessageReceived">' +
                '<div class="msg_">' +
                '<div class="messageBody receivedMsg message-image">' +
                "<a target='_blank' href='"+data.image+"'><img src='"+data.image+"'/></a>"+
                '</div>' +
                '<a class="messageImg" href="/user/'+data.sender+'"><img data-toggle="tooltip" data-placement="right" title="'+data.sender+'" class="messageImg"  src='+data.senderImg+'/></a>'+
                '</div>');
             }
            imageNumber++;
            setTimeout(()=>{
                $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);
            },300);            //if there are more images to be saved
            if(data.imageArray.length > 0) {
                sendImage(id, actualSender, senderImg, imageArray, imageNumber, chat);
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
