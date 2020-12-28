function appendGroupMembers(res){
    console.log("RES:" +res.Members)
    var members = "";
    for(x in res.Members){
            members += 
            '<div class="messageHandle">'+
            '<span class="online"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.Members[x].MemberHandle+'" data-toggle="tooltip" data-placement="bottom"'+
           'title="Online">'+
            '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" />'+
            '</a>'+
                '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
           
        '</div>';
        
    }
    return members;
}
    $(document).ready(()=>{
        var groupId = window.location.href.split("/")[4];
        $.ajax({
            url: '/groupMembers/'+groupId ,
            method: 'GET',
            error:function(err,str){
               
            }
            }).done(function(res) {
                console.log(res.Members)
                $(".membersRightSideBar").append(appendGroupMembers(res));
            });
    })