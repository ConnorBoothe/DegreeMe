
$(document).ready(function(){
  //make request tutor placeholder disappear onfocus
  $(".input").on("focus", function(){
    $(".textarea").attr("content", "");
  })  
  $('[data-toggle="popover"]').popover({
    html : true,
    sanitize  : false
})
   $(".timeline").on("click", ".like-button", function(){
     var likeButton = $(this);
       if(!$(this).hasClass("hasLiked")){
        // likeButton.prop('disabled', true)
        payload = {
            postId: $(this).parent().parent().prev().val(), 
            handle:$(".userProfileName").text()
          }
          console.log(payload)
        $.ajax({
            url: "/addLike",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                likeButton.addClass("hasLiked")
                var currCount = parseInt(likeButton.children().eq(0).text())+1;
                likeButton.children().eq(0).text(currCount)
                likeButton.children().eq(1).animate({fontSize:"18px"},100)
                likeButton.children().animate({color:"#dc3545"},100)
                likeButton.children().eq(1).animate({fontSize:"22px"},100)
                likeButton.prop('disabled', false)
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
       }
       else{
        likeButton.prop('disabled', true)
        payload = {
            postId: $(this).parent().parent().prev().val(), 
            handle:$(".userProfileName").text()
          }
        $.ajax({
            url: "/removeLike",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                likeButton.removeClass("hasLiked")
                var currCount = parseInt(likeButton.children().eq(0).text())-1;
                likeButton.children().eq(0).text(currCount)
                likeButton.children().eq(1).animate({fontSize:"18px"},100)
                likeButton.children().animate({color:"#a9a9a9"},100)
                likeButton.children().eq(1).animate({fontSize:"22px"},100)
                likeButton.prop('disabled', false)
           
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
       }
   })
   
})