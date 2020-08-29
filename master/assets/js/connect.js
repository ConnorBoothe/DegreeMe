$(document).ready(function(){
    $("#searchInput").focus(function(){
        //alert("yo")
        $(this).prev().css("border","2px solid blue");
    })
})

//ConfirmDialog('Are you sure');
function confirmUnfollow(b,handle) {
  $('<div></div>').appendTo('body')
    .html('<div><h6>Are you sure you want to unfollow '+ handle +'?</h6></div>')
    .dialog({
      modal: true,
      title: 'Delete message',
      zIndex: 10000,
      autoOpen: true,
      width: 'auto',
      resizable: false,
      buttons: {
        Yes: function() {
          follow(b,handle);

          $('body').append('<h1>Confirm Dialog Result: <i>Yes</i></h1>');

          $(this).dialog("close");
        },
        No: function() {
          $('body').append('<h1>Confirm Dialog Result: <i>No</i></h1>');

          $(this).dialog("close");
        }
      },
      close: function(event, ui) {
        $(this).remove();
      }
    });
};

function follow(b, handle, status, image, modalId){
    button = b
    payload = {
        handle: handle,
        image:image,
        action: status,
    }
    $.ajax({
        url: "/"+payload.action,
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            202: function(action, msg) {
              if (payload.action == "follow"){
                $(button).html("Following");
                $(button).attr("data-status", "unfollow");
                $(button).removeClass("btn-primary ");
                $(button).css("color","white");
                $(button).addClass("following-class");
                // $(button).attr("onclick","");
                // $(button).attr("data-onclick","follow("+button.id+", \'"+handle+"\','unfollow', 'no image','"+modalId+"')");
                // $(button).attr("data-toggle","modal");
                // $(button).attr("data-target",modalId);
                $(button).attr("data-handle",handle);
                var likeCount = parseInt($(".followers-list").children().eq(0).children().eq(0).children().eq(0).text());
                likeCount++;
                if(likeCount == 1){
                  $(".followers-list").children().eq(0).children().eq(0).children().eq(0).text(likeCount + " Follower")
                }
                else{
                  $(".followers-list").children().eq(0).children().eq(0).children().eq(0).text(likeCount + " Followers")
                }
               
              }else{
                $(button).html("Follow");
                $(button).attr("data-status","follow");
                $(button).removeClass("following-class");
                $(button).addClass("follow-class");
                $(this).removeClass('btn-danger');
                $(button).removeClass("btn-danger");
                $(button).addClass("btn-primary followingButton");
                // $(button).attr("onclick","follow(this, \'"+handle+"\','follow','no image','"+modalId+"')");
                // $(button).attr("data-onclick","");
                // $(button).attr("data-toggle","");
                $(button).attr("data-target","");
                $(button).attr("data-handle","");
                // $(modalId).modal('hide');

                var likeCount = parseInt($(".followers-list").children().eq(0).children().eq(0).children().eq(0).text());
                likeCount--;
                if(likeCount == 1){
                  $(".followers-list").children().eq(0).children().eq(0).children().eq(0).text(likeCount + " Follower")
                }
                else{
                  $(".followers-list").children().eq(0).children().eq(0).children().eq(0).text(likeCount + " Followers")
                }
              }
            },
            500:  function(action, msg) {
              alert(action)
              alert(msg)
                alert( "500" );

            },
          },
    })
    
}