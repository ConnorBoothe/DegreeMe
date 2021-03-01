$(document).ready(function(){
    window.addEventListener('scroll', () =>{
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
    console.log(scrolled);
    })

    // $("button").hover(function(){
    //         action = $(this).attr("data-status");
    //         // if (action == "unjoin"){
    //         //     $(this).html("Leave");
    //         //     //$(this).removeClass('btn-success');
    //         //     $(this).addClass('btn-danger');
    //         // }
    //     },function(){
    //         action = $(this).attr("data-status");
    //         if (action == "unjoin"){
    //             $(this).html("Joined");
    //             $(this).removeClass('btn-danger');
    //             $(this).addClass('btn-success');
    //         }
    //     })

        // $('#studyGroupModal').on('show.bs.modal', function (event) {
        //         var button = $(event.relatedTarget) // Button that triggered the modal
        //         var group = button.data('group') // Extract info from data-* attributes
        //         // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        //         // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        //         var modal = $(this)
        //         modal.find('.modal-body').text('Are you sure you want to leave ' + group)
        //         //modal.find('.modal-body input').val(recipient)
        //         // $('#studyGroupYes').attr("onclick",button.data("onclick"));
        // })

        $(".group-options").on("click", ".joinButton", function(){
                if($(this).attr("data-status") == "join"){
                    join($(this), $(this).prev().prev().val(),$(this).prev().val(),'#studyGroupModal','join')
                }
                else if ($(this).attr("data-status") == "unjoin"){
                    join($(this), $(this).prev().prev().val(),$(this).prev().val(),'#studyGroupModal','unjoin')
                }
                  
        })
        //not usinng anymore
        // $(".joinedButton").on("click", function(){
        //         join($(this), $(this).prev().prev().val(),$(this).prev().val(),'#studyGroupModal','unjoin')
        //         // alert($(this).attr("id"), $(this).prev().prev().val(),$(this).prev().val(),'#studyGroupModal','unjoin')
        //         // console.log($(this).attr("id"), $(this).prev().prev().val(),$(this).prev().val(),'#studyGroupModal','unjoin')
        // })


})