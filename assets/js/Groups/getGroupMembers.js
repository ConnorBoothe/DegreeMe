$(document).ready(()=>{
    $(document).ready(()=>{
        var groupId = window.location.href.split("/")[4];
        $.ajax({
            url: '/groupMembers/'+groupId ,
            method: 'GET',
            error:function(err,str){
               
            }
            }).done(function(res) {
                console.log(res)
            });
    })
})