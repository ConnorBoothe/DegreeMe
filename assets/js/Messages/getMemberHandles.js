$(document).ready(function(){
    var threadId = $(".threadId").val();
    $.ajax({
        url: '/messageMembers/'+ threadId ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) {  
            console.log(res.members[0][0])
            var members = "";
            for(x in res.members){
                members += 
                '<div class="messageHandle">'+
                   '<a href="/user/'+res.members[x][0]+'">'+
                        '<div class="online"></div>'+
                        '<img class="messageSideBarImg" src="'+res.members[x][1]+'" />'+
                        '<span class="userHandleTxt">'+res.members[x][0]+'</span>'+
                    '</a>'+
                '</div>';
            }
            $(".messageHandle-container").append(members);
        });
})