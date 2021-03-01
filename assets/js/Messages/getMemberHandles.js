function appendMembers(res){
    var members = '';
    for(x in res.members){
        
        if(res.statusArray[x].active){
            members += 
            '<div class="messageHandle">'+
            '<span class="online"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.members[x][0]+'" data-toggle="tooltip" data-placement="left"'+
           'title="Online">'+
            '<img class="messageSideBarImg" src="'+res.members[x][1]+'" />'+
            '</a>'+
                '<span class="userHandleTxt">'+res.members[x][0]+'</span>'+
           
        '</div>';
        }
        else {
            members += 
            '<div class="messageHandle">'+
            '<span class="offline"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.members[x][0]+'" data-toggle="tooltip" data-placement="bottom"'+
           'title="Offline">'+
            '<img class="messageSideBarImg" src="'+res.members[x][1]+'" />'+
            '</a>'+
                '<span class="userHandleTxt">'+res.members[x][0]+'</span>'+
           
        '</div>';
        }      
        
    }
    return members;
}
$(document).ready(function(){
    var threadId = $(".threadId").val();
    $.ajax({
        url: '/messageMembers/'+ threadId ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) {   
            $(".messageHandle-container").append(appendMembers(res));
        });
})