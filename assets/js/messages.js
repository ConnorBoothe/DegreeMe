    //handles messages front end functionality
    var socket = io.connect({transports: ['websocket']});
    socket.connect();
    //var socket = io.connect('http://67.202.55.10:8080');
    var messageForm = $("#messageForm");
    var chat = $('#messagesContainer');
    var userHandles = new Array;
    $(document).ready(function () {
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
        window.scrollTo(0, $(document).height() + 100);
        $(".messageHandle").each(function (x) {
            userHandles.push($(this).text().trim());
        })
        messageForm.on("submit", function (e) {
            e.preventDefault();
            if ($(".msgInput input").val().trim() != "") {

                window.scrollTo(0, $(document).height());
                socket.emit('send message', {
                    userHandle: $(".userId").val().substring(1),
                    id: $(".threadId").val(),
                    sender: $(".userProfileName").text(),
                    senderImg: $(".userProfileImg").attr("src"),
                    userHandles: userHandles,
                    message: $(".msgInput input").val(),
                    date: new Date
                });
                $(".msgInput input").val('');
            }
        })
        socket.on('new message', function (data, err) {
            if(err){
                alert(err)
            }
            $('audio#pop')[0].play();
            alert("YO");
            alert("HO")
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
                if (data.msg.sender === $(".userProfileName").text()) {
                    chat.append('<div class="sent-wrapper"><div class="containMessageSent">' +
                        '<div class="msg_ ">' +
                        '<p class="messageBody sentMsg bg-primary">' + data.msg
                        .message + '</p></div>' +
                        '<p class="msg-date msg-date-sent">' + displayTimeSince(data.msg.date) + '</p>' +
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
        })
        socket.on('disconnect', function(){
            console.log('user disconnected');
            alert("disconnected")
        });
    })
