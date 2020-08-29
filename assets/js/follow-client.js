$(document).ready(function(){
    $("button").hover(function () {
       
        action = $(this).attr("data-status");
        if (action == "unfollow") {
            $(this).html("Unfollow");
            $(this).addClass('btn-danger');
            $(this).removeClass('following-class');
            $(this).removeClass('follow-class');
            $(this).addClass('unfollow-class');
        }
    }, function () {
        action = $(this).attr("data-status");
        if (action == "unfollow") {
            $(this).html("Following");
            $(this).removeClass('btn-danger');
            $(this).removeClass('unfollow-class');
            $(this).addClass('following-class');

         }
    })

//     $('#connectModal').on('show.bs.modal', function (event) {
//         var button = $(event.relatedTarget) // Button that triggered the modal
//         var handle = button.data('handle') // Extract info from data-* attributes
//         // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
//         // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
//         var modal = $(this)
//         modal.find('.modal-body').text('Are you sure you want to unfollow ' + handle)
//         //modal.find('.modal-body input').val(recipient)
//         $('#connectYes').attr("onclick", button.data("onclick"));
// })
//handle follow on finc classmates and user profile
$(".followingButton").on("click", function(){
    //follow(<%=noAtHandle%>, '<%=students[i][0].getHandle()%>','unfollow','no image','#connectModal')"
    if($(this).attr("data-status") === "follow"){
        follow($(this), $(this).prev().prev().val(),'follow',$(this).prev().val(),'#connectModal')
    }
    else if($(this).attr("data-status") === "unfollow"){
        follow($(this), $(this).prev().prev().val(),'unfollow',$(this).prev().val(),'#connectModal')
    }
})
//handle course profile follow
$(".course-profile-info").on("click", ".followingButton", function(){
    if($(this).attr("data-status") === "follow"){
        follow($(this), $(this).prev().prev().val(),'follow',$(this).prev().val(),'#connectModal')
    }
    else if($(this).attr("data-status") === "unfollow"){
        follow($(this), $(this).prev().prev().val(),'unfollow',$(this).prev().val(),'#connectModal')
    }
})
$(".joinButton").on("click", function(){
    if($(this).attr("data-status") === "unjoin"){
        join($(this), $(this).prev().prev().val(),$(this).prev().val(),'#groupProfileModal','unjoin');
        // toggleMakeSession('makeSession');
    }
    else if($(this).attr("data-status") === "join"){
        join($(this), $(this).prev().prev().val(),$(this).prev().val(),'#groupProfileModal','join');
        // toggleMakeSession('makeSession');
    }
})
//attend study session
$(".attendButton").on("click", function(){
    if($(this).attr("data-status") === "attend"){
        attend($(this), $(this).prev().val(),'#groupProfileModal');
    }
    else if($(this).attr("data-status") === "leave"){
        attend($(this), $(this).prev().val(),'#groupProfileModal');    }
})

});