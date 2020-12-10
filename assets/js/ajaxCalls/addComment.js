$(document).ready(function () {
    //submit ajax post request to addComment on click
    $("#comments-button").on("click", function (e) {
        //prevent form submission
        e.preventDefault();
        //get the file attachment
        var filename = $(".comment-file").val().replace(/C:\\fakepath\\/i, '')
        var storageRef = firebase.storage().ref("attachments/" + filename);
        var image = $(".comment-file")[0].files[0];
        //if file attached
        if (image != undefined) {
            storageRef.put(image)
                .then(function () {
                    storageRef.getDownloadURL().then(function (url) {
                        payload = {
                            postId: $("input[name='postId']").val(),
                            message: $("textarea[name='message']").val(),
                            handle: $("input[name='handle']").val(),
                            name: $("input[name='name']").val(),
                            img: $("input[name='img']").val(),
                            attachments:[url]
                        }
                        $.ajax({
                            url: "/addComment",
                            type: 'POST',
                            data: JSON.stringify(payload),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            statusCode: {
                                202: function (result) {
                                    //refresh the page if successful
                                    window.location.href = "/post/"+result.postId;
                                },
                                500: function (result) {
                                    alert("500 " + result.responseJSON.err);
                                },
                            },
                        });
                    })

                })
        }
    })
});