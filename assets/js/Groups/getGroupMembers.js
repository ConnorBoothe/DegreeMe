function appendGroupMembers(res){
    var members = "";

    if((res.Members.length-1) == 1 ){
    members +=
    "<p class='messageHeader'>"+(res.Members.length-1) + " MEMBER <span class='invite-button' data-toggle='modal'"+
    "data-target='#inviteModal' title='Invite'><span data-toggle='tooltip' data-placement='right' title='Invite' class='inv-tooltip'>+</span></span></p>";
    }
    else{
        members +=
        "<p class='messageHeader'>"+(res.Members.length-1) + " MEMBERS <span class='invite-button' data-toggle='modal'"+
        "data-target='#inviteModal' title='Invite'><span data-toggle='tooltip' data-placement='right' title='Invite' class='inv-tooltip'>+</span></span></p>";
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
           '<div class="member-menu">'+
            '<ul>'+
            '<li>'+
                    '<a href="/user/'+res.Members[x].MemberHandle+'">Profile</a>'+
                '</li>'+
                '<li class="text text-danger">'+
                'Remove Member'+
            '</li>'+
            '</ul>'+
           '</div>'+
        '</div>';
        }
        else{
            if(res.Members[x].Status == "Accepted") {
        
            if(res.HostHandle == $(".member_id").val()) {
                members += 
                '<div class="messageHandle">'+
                '<span class="online"></span></a>'+
      
                '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" data-toggle="tooltip" data-placement="left"'+
                'title="Online"/>'+
                    '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
                    '<div class="member-menu">'+
                    '<ul>'+
                    '<li>'+
                            '<a href="/user/'+res.Members[x].MemberHandle+'">Profile</a>'+
                        '</li>'+
                        '<li class="text text-danger removeMember">'+
                        'Remove Member'+
                    '</li>'+
                    '</ul>'+
                   '</div>'+
            '</div>';
            }
            else if(res.Members[x].MemberHandle == $(".member_id").val()) {
                members += 
                '<div class="messageHandle">'+
                '<span class="online"></span></a>'+
      
                '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" data-toggle="tooltip" data-placement="left"'+
                'title="Online"/>'+
                    '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
                    '<div class="member-menu">'+
                    '<ul>'+
                    '<li>'+
                            '<a href="/user/'+res.Members[x].MemberHandle+'">Profile</a>'+
                        '</li>'+
                        '<li class="text text-danger removeMember">'+
                        'Leave Group'+
                    '</li>'+
                    '</ul>'+
                   '</div>'+
            '</div>';
            }
            else {
                members += 
                '<div class="messageHandle">'+
                '<span class="online"></span></a>'+
      
                '<img class="messageSideBarImg" src="'+res.Members[x].MemberImage+'" data-toggle="tooltip" data-placement="left"'+
                'title="Online"/>'+
                    '<span class="userHandleTxt">'+res.Members[x].MemberHandle+'</span>'+
                    '<div class="member-menu">'+
                    '<ul>'+
                    '<li>'+
                            '<a href="/user/'+res.Members[x].MemberHandle+'">Profile</a>'+
                        '</li>'+
                       
                    '</ul>'+
                   '</div>'+
            '</div>';
            
            
            }
        
        }
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