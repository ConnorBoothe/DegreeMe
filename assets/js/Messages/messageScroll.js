function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0) {
        return true;
    }
}
function prependNext50(messages, handle, block) {
    var messageHTML = '<div class="messageTop'+block+'"></div>';
    for (var x = messages.length - 1; x >= 0; x--) {
        // check if session handle === sender
        if (handle === messages[x].sender) {
            if (messages[x].type == "file") {
                messageHTML += '<div class="sent-wrapper">' +
                    '<div class="containMessageSent">' +
                    '<div class="msg_">' +
                    '<p class="msgSender"></p>' +
                    '<p class="messageBody sentMsg bg-primary message-attachment">';
                if (messages[x].content.includes(".pdf")) {
                    messageHTML += '<iframe class="pdf-iframe" src="' + messages[x].content + '"></iframe>' +
                        '<p class="text-center"><a target="_blank" class="text-light"' +
                        'href="' + messages[x].content + '">View Full Screen</a></p>';
                } else {
                    messageHTML += '<a target="_blank" href="<%=messages[x].content%>">' +
                        '<img src="' + messages[x].content + '" />' +
                        '</a>';
                }
                messageHTML += '</p>' +
                    '</div>' +
                    '<p class="msg-date msg-date-sent">' + formatTime(new Date(messages[x].dateTime)) +
                    '</p>' +
                    '</div>' +
                    '</div>';
            } else {
                messageHTML += '<div class="sent-wrapper">' +
                    '<div class="containMessageSent">' +
                    '<div class="msg_">';
                if (messages[x].youtubeData[0] != undefined) {
                    messageHTML += '<a target="_blank" href="' + messages[x].youtubeData[0].link + '">' +
                        '<div class="messageBody sentMsg bg-primary">' +
                        '<img class="yt-logo" src= "../assets/img/yt-logo.svg"/>' +
                        '<div class="thumbnail-container">' +
                        '<img src="' + messages[x].youtubeData[0].thumbnail + '" class="yt-thumbnail"/>' +
                        '</div>' +
                        '<span class="text-light yt-title">' + unescapeApostrophe(messages[x].youtubeData[0].title) + '</span>' +
                        '</div>' +
                        '</a>';
                } else {
                    messageHTML += '<p class="messageBody sentMsg bg-primary">' + messages[x].content + '</p>';
                }
                messageHTML += '</div>' +
                    '<p class="msg-date msg-date-sent">' + formatTime(new Date(messages[x].dateTime)) + '</p>' +
                    '</div>' +
                    '</div>';
            }
        } else {
            if (messages[x].type == "file") {
                messageHTML += '<div class="sent-wrapper">' +
                    '<div class="containMessageSent">' +
                    '<div class="msg_">' +
                    '<p class="msgSender"></p>' +
                    '<p class="messageBody sentMsg bg-primary message-attachment">';
                if (messages[x].content.includes(".pdf")) {
                    messageHTML += '<iframe class="pdf-iframe" src="' + messages[x].content + '"></iframe>' +
                        '<p class="text-center"><a target="_blank" class="text-light"' +
                        'href="' + messages[x].content + '">View Full Screen</a></p>';
                } else {
                    messageHTML += '<a target="_blank" href="<%=messages[x].content%>">' +
                        '<img src="' + messages[x].content + '" />' +
                        '</a>';
                }
                messageHTML += '</p>' +
                    '</div>' +
                    '<p class="msg-date msg-date-sent">' + formatTime(new Date(messages[x].dateTime)) +
                    '</p>' +
                    '</div>' +
                    '</div>';

            } else {
                messageHTML += '<div class="sent-wrapper">' +
                    '<div class="containMessageSent">' +
                    '<div class="msg_">';
                if (messages[x].youtubeData[0] != undefined) {
                    messageHTML += '<a target="_blank" href="' + messages[x].youtubeData[0].link + '">' +
                        '<div class="messageBody sentMsg bg-primary">' +
                        '<img class="yt-logo" src= "../assets/img/yt-logo.svg"/>' +
                        '<div class="thumbnail-container">' +
                        '<img src="' + messages[x].youtubeData[0].thumbnail + '" class="yt-thumbnail"/>' +
                        '</div>' +
                        '<span class="text-light yt-title">' + unescapeApostrophe(messages[x].youtubeData[0].title) + '</span>' +
                        '</div>' +
                        '</a>';
                } else {
                    messageHTML += '<p class="messageBody sentMsg bg-primary">' + messages[x].content + '</p>';
                }
                messageHTML += '</div>' +
                    '<p class="msg-date msg-date-sent">' + formatTime(new Date(messages[x].dateTime)) + '</p>' +
                    '</div>' +
                    '</div>';
            }
        }
    }
    return messageHTML;
}


$(document).ready(function () {
    //variable that tracks which set of messages to grab
    //ie 0 = first 0-49, 1 = 50-99
    var block = 0;
    //scroll to bottom of page on load
    $(".messageBlock").scrollTop($(".messageBlock")[0].scrollHeight);
    // const box = document.querySelector('.messageTop');

    $(".messageBlock").on("scroll", () => {
        if(document.querySelector(".messageTop"+block)) {

       
        if (isInViewport(document.querySelector(".messageTop"+block))) {
            //make ajax request to get the next set of 50 messages
            var oldMessageTop = $(".messageTop"+block);
            block++;
            // $('.messageTop').remove();
            payload = {
                threadId: $(".threadId").val(),
                block: block
            }
            $.ajax({
                url: "/getMessageSet",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                }, statusCode: {
                    202: function (result) {
                        //prepend
                        if(result.messages.length > 0) {
                            $("#messagesContainer").prepend(prependNext50(result.messages,
                                $(".userHandle").text(),block));
                           
                           $(".messageBlock").scrollTop(oldMessageTop.offset().top)
                        }
                        
                    },
                    500: function (result) {
                        alert("500 " + result.responseJSON.err);
                    },
                },
            });
        }
    }

    });
})