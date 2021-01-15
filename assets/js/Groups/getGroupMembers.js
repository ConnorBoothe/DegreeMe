function appendGroupMembers(res){
    var members = "";

    if((res.Members.length-1) == 1 ){
    members +=
    "<p class='messageHeader'>"+(res.Members.length-1) + " MEMBER</p>";
    }
    else{
        members +=
        "<p class='messageHeader'>"+(res.Members.length-1) + " MEMBERS</p>";
    }
    var admin = "";
    for(x in res.Members){
        if(res.Members[x].MemberRole == "Admin") {
            admin += 
            "<p class='messageHeader'>1 ADMIN</p>"+
            '<div class="messageHandle">'+
            '<span class="online"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.Members[x].MemberHandle+'" data-toggle="tooltip" data-placement="left"'+
           'title="Online">'+
            '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" />'+
            '</a>'+
                '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
           
        '</div>';
        }
        else{
            members += 
            '<div class="messageHandle">'+
            '<span class="online"></span></a>'+
            '<a class="member-tooltip" href="/user/'+res.Members[x].MemberHandle+'" data-toggle="tooltip" data-placement="left"'+
           'title="Online">'+
            '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" />'+
            '</a>'+
                '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
           
        '</div>';
        }
    }
    return admin+members;
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