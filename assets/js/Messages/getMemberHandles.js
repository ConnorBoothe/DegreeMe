function appendMembers(res){
    var members = '<p class="messageHeader">MEMBERS</p>';
    for(x in res.members){
        f
        if(res.statusArray[x].active == "true"){
            members += 
            '<div class="messageHandle">'+
            '<span class="online"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.members[x][0]+'" data-toggle="tooltip" data-placement="bottom"'+
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
            alert("GOt user handle")          
            $(".messageHandle-container").append(appendMembers(res));
        });
})