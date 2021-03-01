function appendCourseMembers(res){
    var members = "";

    if((res.length) == 1 ){
    members +=
    "<p class='messageHeader'>"+(res.length) + " STUDENT</p>";
    }
    else{
        members +=
        "<p class='messageHeader'>"+(res.length) + " STUDENTS</p>";
    }
    for(x in res){        
                members += 
                '<div class="messageHandle">'+
                '<span class="online"></span></a>'+
                '<a href="/user/'+res[x].Handle+'">'+
                '<img class="messageSideBarImg" src="'+res[x].Image+'" data-toggle="tooltip" data-placement="left"'+
                'title="Online"/>'+
                    '<span class="userHandleTxt">'+res[x].Handle+'</span>'+
                '</a>'+
                        
                        
                   '</div>'+
            '</div>';
            }
    return members;
}

$(document).ready(function(){
    $.ajax({
        url: '/getStudentsByCourse/'+ $(".courseName").text() ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) {
            console.log(res[0])
            $(".membersRightSideBar").append(appendCourseMembers(res));
        })
})