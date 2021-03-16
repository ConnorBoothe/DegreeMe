function getYoutubeVideo(video){
    return youtubeRegEx.test(video) 
}
function appendComment(comment){
    var commentHTML = 
    '<div class="comment-container">'+
        '<span>'+
            '<img class="discImg" src="'+comment.commenterImg+'" />'+
            '<a href= "../user/'+comment.commenterHandle+'">'+comment.commenterHandle+
            '<span class="text-light userName-text" ></span></a>'+
        '</span>';
        if(!comment.message.includes("http")) {
           commentHTML+= '<p class="text-light comments-text">'+comment.message+'</p>';
        }
        else {
            commentHTML+= '<p class="text-light comments-text"></p>';

        }
        if(comment.attachments.length > 0){
            commentHTML += 
            '<a href="'+comment.attachments[0].file+'">'+
                '<img class="comment-img"'+
                'src="'+comment.attachments[0].file+'"/>'+
            '</a>';
        }
        
    '</div>';
    return commentHTML;
}
function appendYoutubeComment(comment){
    var commentHTML = 
    '<div class="comment-container">'+
        '<span>'+
            '<img class="discImg" src="'+comment.commenterImg+'" />'+
            '<a href= "../user/'+comment.commenterHandle+'">'+comment.commenterHandle+
            '<span class="text-light userName-text" ></span></a>'+
            '<a target="_blank" href="'+comment.attachments[0].file[0]+'">'+
                '<div>'+
                '<div class="thumbnail-container"><img src="'+comment.attachments[0].file[1]+'" class="yt-thumbnail"/></div>'+
                '<span class="text-light yt-title">'+ comment.attachments[0].file[2] +'</span></div></div>' +
                '</a>'+
            '<span class="text-light userName-text" ></span></a>'+
        '</span>';
        commentHTML += '</div>';
    return commentHTML;
}
$(document).ready(function () {
    var imageArray = [];
    $("#attachment").on("change", function(){
        readURL($("#attachment")[0], imageArray, $("#attachment"));
        console.log(imageArray)
    })
    $(".commentMsg").on("focus", ()=>{
        $(".commentMsg").css("border", "none");

    })
    $(".image-attachments").on("click", ".delete-badge", function(){
        var name = $(this).next().attr("name");
        //remove attachment from array
        removeAttachmentFromArray(name, imageArray);
        //remove attachment from the DOM
        $(this).parent().remove();
    })
    //submit ajax post request to addComment on click
    $("#comments-button").on("click", function (e) {
        //prevent form submission
        e.preventDefault();
        if($(".commentMsg").val() === ""){
           
            $(".commentMsg").css("border", "1px solid #dc3545");
        }
        else {

        
        $(".commentTabs").append(
        '<div class="loading-post">'+
            '<div class="spinner-border" role="status">'+
                '<span class="sr-only"></span>'+
            '</div>'+
            '<h3 class="text-light posting-comment">Posting Comment</h3>'+
        '</div>')
        //get the file attachment
        var filename = $(".comment-file").val().replace(/C:\\fakepath\\/i, '')
        var storageRef = firebase.storage().ref("attachments/" + filename);
        var image = $(".comment-file")[0].files[0];
        //if file attached
        var isVideo = getYoutubeVideo($(".commentMsg").val());
       //if an image is uploaded
        if (image != undefined && !isVideo) {
            $(".image-attachments").html("");
            storageRef.put(image)
                .then(function () {
                    storageRef.getDownloadURL().then(function (url) {
                        //if there is a message and an image
                        if($("textarea[name='message']").val() != ""){
                            payload = {
                                postId: $("input[name='postId']").val(),
                                message: $("textarea[name='message']").val(),
                                handle: $("input[name='handle']").val(),
                                name: $("input[name='name']").val(),
                                img: $("input[name='img']").val(),
                                attachments:[url]
                            }
                        }
                            else {
                                payload = {
                                    postId: $("input[name='postId']").val(),
                                    message: url,
                                    handle: $("input[name='handle']").val(),
                                    name: $("input[name='name']").val(),
                                    img: $("input[name='img']").val(),
                                    attachments:[url]
                                }
                            }
                        $(".commentMsg").val("");

                        $.ajax({
                            url: "/addComment",
                            type: 'POST',
                            data: JSON.stringify(payload),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            statusCode: {
                                202: function (result) {
                                    console.log(result)
                                    $(".commentMsg").text("");
                                    $(".loading-post").remove();
                                    $(".commentTabs").append(appendComment(result.post));
                                    //refresh the page if successful
                                    // window.location.href = "/post/"+result.postId;
                                },
                                500: function (result) {
                                    alert("500 " + result.responseJSON.err);
                                },
                            },
                        });
                    })
                })
            }
        //if comment is a youtube url
        else if(isVideo){
            $.ajax({
                type: 'GET',
                async: false,
                url: 'https://www.googleapis.com/youtube/v3/search',
                data: {
                    key: Youtube_API_Key,
                    q: $(".commentMsg").val(),
                    part: 'snippet',
                    maxResults: 1,
                    type: 'video',
                    videoEmbeddable: true,
                },
                success: function(data){
                        payload = {
                            postId: $("input[name='postId']").val(),
                            message: $("textarea[name='message']").val(),
                            handle: $("input[name='handle']").val(),
                            name: $("input[name='name']").val(),
                            img: $("input[name='img']").val(),
                            isVideo: true,
                            attachments: [['https://www.youtube.com/watch?v=' + data.items[0].id.videoId,
                                data.items[0].snippet.thumbnails.default.url,  data.items[0].snippet.title]
                        ],
                            }
                            $(".commentMsg").val("");
                        $.ajax({
                            url: "/addComment",
                            type: 'POST',
                            data: JSON.stringify(payload),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            statusCode: {
                                202: function (result) {
                                    $(".loading-post").remove();
                                    // $(".commentsTabs").append(appendComment(result));
                                   $(".commentTabs").append(appendYoutubeComment(result.post));
                                    //refresh the page if successful
                                    // window.location.href = "/post/"+result.postId;
                                },
                                500: function (result) {
                                    alert("500 " + result.responseJSON.err);
                                },
                            },
                        });
                    },
                error: function(response){
                    console.log("Request Failed");
                }
              });
        }
        //if comment is text only
        else{

            payload = {
                postId: $("input[name='postId']").val(),
                message: $("textarea[name='message']").val(),
                handle: $("input[name='handle']").val(),
                name: $("input[name='name']").val(),
                img: $("input[name='img']").val()
            }
            $(".commentMsg").val("");

            $.ajax({
                url: "/addComment",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                },
                statusCode: {
                    202: function (result) {
                        $(".commentMsg").text("");
                        $(".loading-post").remove();
                        // $(".commentsTabs").append(appendComment(result));
                       console.log(result.post)
                       $(".commentTabs").append(appendComment(result.post));
                        //refresh the page if successful
                        // window.location.href = "/post/"+result.postId;
                    },
                    500: function (result) {
                        alert("500 " + result.responseJSON.err);
                    },
                },
            });
           
        }
    }
    })

});