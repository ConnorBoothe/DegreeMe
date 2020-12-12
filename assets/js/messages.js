    //handles messages front end functionality
    //read URL to display image upload preview
    function readURL(input, imageArray) {
        if (input.files && input.files[0]) {
            var filename = $(".message-file").val().replace(/C:\\fakepath\\/i, '');
            imageArray.push({name:filename, image: input.files[0]});
            var reader = new FileReader();
            var image = ""
            reader.onload = function (e) {
                image = "<div class='img-container'>"+
                "<span class='delete-badge badge badge-secondary'>"+
                '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="white" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>'+
                '</svg>'+
                '</span>'+
                "<img name='"+filename+"' src='"+e.target.result+"'/></div>";
                $(".image-attachments").append(image);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    var socket = io.connect({transports: ['websocket']});
    socket.connect();
    var messageForm = $("#messageForm");
    var chat = $('#messagesContainer');
    var userHandles = new Array;
    $(document).ready(function () {
        //initialize the image attachment array
        var imageArray = [];
        $(".check-icon").hide();
        $("#usersBtn").on("click", function () {

            $("#usersDiv").append(
                "<p class='badge badge-dark addedUsers'><span class='addedUsersSpan'>" +
                $("#users").val() +
                "</span><span class='deleteUser'>x</span></p>");
            $("#users").val("");
        })
        $("#usersDiv").on("click", ".deleteUser", function () {
            var addedArray = [];
            var user = $(this).prev().text();
            var x = 0;

            $(this).parent().remove();
            addedArray.push($(".addedUsers").eq(x).text());
            x++;
        })
        
        $(".messageHandle").each(function (x) {
            userHandles.push($(this).text().trim());
        })
        messageForm.on("submit", function (e) {
            e.preventDefault();
            if(imageArray.length > 0){
                        
                        if ($(".msgInput input").val().trim() != "") {

                            window.scrollTo(0, $(document).height());
                            socket.emit('send message', {
                                userHandle: $(".userId").val().substring(1),
                                id: $(".threadId").val(),
                                sender: $(".userProfileName").eq(0).text(),
                                senderImg: $(".userProfileImg").attr("src"),
                                userHandles: userHandles,
                                message: $(".msgInput input").val(),
                                date: new Date,
                                hasImage:true
                            });
                            $(".msgInput input").val('');
                        }
        }
        else {
            if ($(".msgInput input").val().trim() != "") {

                window.scrollTo(0, $(document).height());
                socket.emit('send message', {
                    userHandle: $(".userId").val().substring(1),
                    id: $(".threadId").val(),
                    sender: $(".userProfileName").eq(0).text(),
                    senderImg: $(".userProfileImg").attr("src"),
                    userHandles: userHandles,
                    message: $(".msgInput input").val(),
                    date: new Date,
                    hasImage:false
                });
                $(".msgInput input").val('');
            }
        }
            
        })
        
        socket.on('new message', function (data, err) {
            if(err){
                alert(err)
            }
            $('audio#pop')[0].play();
            var iterator = $(".chatName").length;
            for (var x = 0; x < iterator; x++) {
                var href = $(".chatName").eq(x).parent().parent().attr("href");
                href = href.split("=")[1];
                if (data.msg.id === href && x != 0) {
                    var move = $(".messageSideBarContainer").children().eq(x);
                    $(".messageSideBarContainer").children().eq(x).remove();
                    $(".messageSideBarContainer").prepend(move);
                }
            }
            //route message to correct locations
            var messageQueryId = window.location.toString().split("=");
            
            if (data.msg.id === messageQueryId[1]) {
                if (data.msg.sender === $(".userProfileName").eq(0).text()) {
                    chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
                        '<div class="msg_ ">' +
                        '<p class="messageBody sentMsg bg-primary">' + data.msg
                        .message + '</p></div>' +
                        '<p class="msg-date msg-date-sent"></p>' +
                        '</div></div>');
                } else {
                    chat.append('<div class="containMessageReceived">' +
                        '<img class="messageImg" src="' + data.msg.senderImg +
                        '" /><p class="sender_handle"' +
                        data.msg.sender +
                        '</p><div class="msg_1" style="left:0px">' +
                        '<p class="messageBody receivedMsg">' + data.msg.message +
                        '</p>' +
                        '</div>' +
                        '<p class="msg-date msg-date-sent">' + displayTimeSince(data.msg.date) + '</p>' +
                        '</div>');
                    window.scrollTo(0, $(document).height() + 100);
                }
            }
            var messageId = "";
            for (var x = 0; x < $(".chatName").length - 1; x++) {
                var hrefAttr = $(".chatName").eq(x).parent().parent().attr("href")
                    .split("=");
                if ((hrefAttr[1] === data.msg.id) && $(".pageName").text() != $(
                        ".chatName").eq(x).children().eq(0).text()) {

                    var messageId = $(".chatName").eq(x).children().eq(0).text();
                    var notifCount = parseInt($(".chatName").eq(x).parent()
                        .children().eq(0).text());
                    $(".chatName").eq(x).parent().children().eq(0).show();
                    var newCount = notifCount++;
                    $(".chatName").eq(x).parent().children().eq(0).text(
                        notifCount++);
                    if (!($(".chatName").eq(x).parent().children().eq(0).hasClass(
                            "messageNotification"))) {
                        $(".chatName").eq(x).parent().prepend(
                            "<span class='badge badge-danger messageNotification'>1</span>"
                        );
                    }
                }
            }
                //if images attached, save images to firebase and send the url to the server to be saved to MessagesDB
                if(imageArray.length > 0 ) {
                chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
                '<div class="msg_">' +
                '<div class="messageBody sentMsg bg-primary new-image">'+
                '<div class="spinner-border" role="status">'+
                    '<span class="sr-only"></span>'+
                '</div>'+
                '<span class="loading-span">Loading Image</span>'+
            '</div>'+
                '<p class="msg-date msg-date-sent"></p>' +
                '</div></div>');
                var storageRef = firebase.storage().ref("attachments/" + imageArray[0].name);
                storageRef.put(imageArray[0].image)
                    .then(function () {
                         storageRef.getDownloadURL().then(function (url) {
                            socket.emit("send image", 
                            {
                                id:$(".threadId").val(),
                                image:url
                            })
                         })
                        })
                }
            
        })
        socket.on("append image", function(data){
            $(".new-image").html("<a href='"+data.image+"'><img src='"+data.image+"'/></a>");
        })
        //image upload to messages
        $(".message-file").on("change", function(){
           readURL($(".message-file")[0], imageArray);
        })
        //remove image upload
        $(".image-attachments").on("click", ".delete-badge", function(){
            var name = $(this).next().attr("name");
            //remove image from image array
            for(var i = 0; i < imageArray.length; i++) {
               if(imageArray[i].name == name){
                    imageArray.splice(i, 1);
                    break;
               }
            }
            $(this).parent().remove();
        })
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    })
