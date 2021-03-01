function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top >= 0) {
        return true;
    }
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
                                $("input[name='handle']").val(),block));
                           
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