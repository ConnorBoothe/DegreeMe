function formatSingleDiscussion(discussion){
  var discussionHTML = "";
    if(discussion.courseName === $(".courseName").text()){
     
      if(discussion.anonymous == true){
    
      discussionHTML +=  '<div class="question">'+
      '<div class="question-container1">'+
      '<span class="discName">Anonymous</span>'+
      '<p class="dateText">'+formatDate(new Date(discussion.date))+"</p>";
      discussionHTML += '<p class="questionText">'+discussion.post+'</p>';
      if(discussion.attachments.length > 0){
        discussionHTML += "<div class='question-img-container'><img class='question-img1' src='"+discussion.attachments[0].file+"'/>"+
       '<div><a target="_blank" class="pdf-link" href="'+discussion.attachments[0].file+'">View Full Screen</a></div></div>';
      }
      if(parseInt(discussion.commentCount) === 1){
        discussionHTML +=
      '<p><a class="responseLink" href="/post/'+discussion.timelineId+'?discussion='+discussion._id+'">'+discussion.commentCount+' Comment</a></p>';
      }
      else{
        discussionHTML +=
        '<p><a class="responseLink" href="/post/'+discussion.timelineId+'?discussion='+discussion._id+'">'+discussion.commentCount+' Comments</a></p>';
        
      }             
      if(handle === discussion.userHandle){
        discussionHTML+=
      '<form action="removeDiscussion" method="POST"  class="removeDiscussion">'+
      '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
      '<input type="hidden" name="discId" value="'+discussion._id+'"/ >'+
      '<input type="hidden" name="course" value="'+discussion.courseName+'"/ >'+
      '</form>'+
      
    
    
      '</div>'
  '</div>';
}
else{
    discussionHTML+=
      '</div>'
  '</div>';
}
    }
    else if(discussion.anonymous === false){
        discussionHTML +=  '<div class="question">'+
      '<div class="question-container1">'+
      '<a href="/user/'+discussion.userHandle+'">'+
      '<img class="discImg" src="'+discussion.userImg+'"/>'+
      '<span class="discName">'+discussion.userHandle+'</span></a>'+
      '<p class="dateText">'+formatDate(new Date(discussion.date))+"</p>";
      discussionHTML += '<p class="questionText">'+discussion.post+'</p>';
      if(discussion.attachments.length > 0){
        discussionHTML += "<div class='question-img-container'><img class='question-img1' src='"+discussion.attachments[0].file+"'/>"+
       '<div><a target="_blank" class="pdf-link" href="'+discussion.attachments[0].file+'">View Full Screen</a></div></div>';
      }
      if(parseInt(discussion.commentCount) === 1){
        discussionHTML +=
      '<p><a class="responseLink" href="/post/'+discussion.timelineId+'?discussion='+discussion._id+'">'+discussion.commentCount+' Comment</a></p>';
      }
      else{
        discussionHTML +=
        '<p><a class="responseLink" href="/post/'+discussion.timelineId+'?discussion='+discussion._id+'">'+discussion.commentCount+' Comments</a></p>';
        
      }              

        discussionHTML+=
        '<form action="removeDiscussion" method="POST" class="removeDiscussion">'+
        '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
        '<input type="hidden" name="discId" value="'+discussion._id+'"/ >'+
        '<input type="hidden" name="course" value="'+discussion.courseName+'"/ >'+
        '</form>'+
      '</div>'
  '</div>';
  }
}
console.log("YO")
console.log(discussionHTML)
return discussionHTML;

}
$(document).ready(function(){
    var imageArray = [];
    $("#attachment").on("change", function(){
        var filename = $(".askQuestion-file").val().replace(/C:\\fakepath\\/i, '')
        var accept = validateImage(filename)
        if(accept) {
            readURL($("#attachment")[0], imageArray, $("#attachment"));
        }
        else {
            $('.toast-body').show();
            setTimeout(function(){
                $('.toast-body').hide();
            }, 1000)        }
        console.log(imageArray)
    })
    $(".image-attachments").on("click", ".delete-badge", function(){
        var name = $(this).next().attr("name");
        //remove attachment from array
        removeAttachmentFromArray(name, imageArray);
        //remove attachment from the DOM
        $(this).parent().remove();
    })
    $("#postQuestion").on("click", function(e){
        e.preventDefault();
        var course = $(".courseName");
        var message = $("#message");
        var filename = $(".askQuestion-file").val().replace(/C:\\fakepath\\/i, '')
        var storageRef = firebase.storage().ref("attachments/"+filename);
        var image = $(".askQuestion-file")[0].files[0];
        // alert( message.val());
        //input validation
            if(message.val() == ""){
                message.css("border", "1px solid #dc3545")

            }
        else if(image != undefined) {
        storageRef.put(image)
        .then(function(){
            storageRef.getDownloadURL().then(function(url) {
                payload = {
                    message:message.val(),
                    course:course.text(),
                    image:url
                 }
                 $.ajax({
                     url: "/askQuestion",
                     type: 'POST',
                     data: JSON.stringify(payload),
                     headers: {
                     "Content-Type": "application/json"
                     }, statusCode: {
                     202: function (result) {
                        $(".modal").modal("hide");
                        $(".questionTxt").val("");
                        $(".modal").modal("hide");
                        $(".image-attachments").html("");
                        $("#attachment").val("");
                        var discussion = formatSingleDiscussion(result.result);
                         $(".discussion-container").prepend(discussion)
                        console.log(result)
                     },
                     500: function (result) {
                         alert("500 ");
                         
                     },
                     },
                 });
            })
        })
        }
        //post question without image
        else {
            payload = {
                message:message.val(),
                course:course.text(),
                image:"none"
             }
            $.ajax({
                url: "/askQuestion",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                "Content-Type": "application/json"
                }, statusCode: {
                202: function (result) {
                    $(".questionTxt").val("");
                    $(".modal").modal("hide");

                    var discussion = formatSingleDiscussion(result.result);
                         $(".discussion-container").prepend(discussion)
                    // location.href = "/";   
                       },
                500: function (result) {
                    alert("500 ");
                    console.log(result)
                },
                },
            });
        }
    })
})