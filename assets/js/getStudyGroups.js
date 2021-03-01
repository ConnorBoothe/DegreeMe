$(document).ready(function () {
    if(window.innerWidth < 1000){
        $(".memberCount").on("click", function(){
           $(".groupSideBar").show();
        })
        $(".close-mobile-members").on("click", function(){
            $(".groupSideBar").hide();
         })

    }
  
    if($(".joinButton").text() == "Join Group"){
        $("#makeSession").hide();
        $(".groupMessage").show();

    }
    $(".getStudyGroupsByCourse").on("submit", function (e) {
        //e.preventDefault();
        //socket.emit('get users by major', {major:$("#searchInput").val()});
    })


        //Now that we have the data, we can insert it into the html using .html() function
        payload = {
            group: $("#searchInput").val()
        }
        $.ajax({
            url: '/API/StudyGroups',
            method: 'GET',
            data: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }, statusCode: {
                202: function (result) {
                    //Now that we have the data, we can insert it into the html using .html() function
                    studyGroups = getStudyGroupByCourse(data);
                    $("#majorTable > tbody").empty();
                    for (var i = 0; i < studyGroups.length; i++) {
                        $('#majorTable tr:last').after(
                            `<img class="StudyGroupsImage" src="assets/img/instagram.svg" style="width: 207.28px;"/>
                            <a class="groupName" href="Full Name"><%=StudyGroups[x][0].GroupName.trim()%></a>
                                     <p class="course"><%=StudyGroups[x][0].Subject.trim()%></p>
                                    <p class="professor"><%=StudyGroups[x][0].Professor.trim()%></p>
                                    <%if(StudyGroups[x][1]){%>
                                        <form action="/#" method="post" id="joinedGroup">
                                            <input name="joinGroup" type="hidden" value="joinedGroup" />
                                                           <p><button id="unjoinGroup" data-status="unjoin" type="button" onclick="join(this, '<%=StudyGroups[x][0]._id%>')" class="btn btn-secondary btn-sm followingButton"> Unjoin </button></p>
                                       </form>
                                    <%}else{%>
                                        <form action="/#" method="post" id="joinGroup">
                                            <input name="joinGroup" type="hidden" value="<%=StudyGroups[x][0]._id%>" />
                                                <p><button id="joinGroup" data-status="join" type="button" onclick="join(this, '<%=StudyGroups[x][0]._id%>')" class="btn btn-secondary btn-sm followingButton"> Join </button></p>
                                                   </form>
                                  <%  }%>`
                        );
                    }
                }, 500: function (err) {

                }
            }
        })

})

function getFollowing(docs) {
    if (docs.length > 1) {
        var numInMajor = 0;
        var students = [];
        new Promise((resolve, reject) => {
            for (x in docs) {
                if (docs[x]._id != req.session.userId) {
                    numInMajor++;
                    //create tutor objects from DB results
                    //constructor(userId,first_name,last_name,school,email,password,img,theme,handle, mySchedule, status, subscription, creditHours, threads, major) {
                    var temp = new Student(docs[x]._id, docs[x].first_name, docs[x].last_name, docs[x].school,
                        docs[x].email, docs[x].password, docs[x].img, docs[x].theme, docs[x].handle, docs[x].myCourses,
                        docs[x].status, docs[x].subscription, null, docs[x].threads, docs[x].Major);
                    //console.log("calling isFollowing:"+docs[x].handle);
                    users.isFollowing(req.session.handle, docs[x], temp, function (student, folstat) {
                        students.push([student, folstat]);
                        if (students.length == numInMajor) {
                            resolve(students);
                        }
                    });
                }
            }
        }).then((students) => {
            return students;
        })
    }
}
function join(b, id, name, modalId, status) {
    button = b
    payload = {
        id: id,
        action: status
    }
    console.log(payload)
    $.ajax({
        url: "/" + payload.action,
        type: "POST",
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            202: function (action, msg) {
                if (payload.action == "join") {
                //     $(button).html('<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                //     '<path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>'+
                //   '</svg>Joined');
                    // $(button).attr("data-status", "unjoin");

                    var currMemberCount = parseInt($(".messageHeader").eq(1).text().substr(0,1));
                    currMemberCount++;
                    if(currMemberCount == 1) {
                        $(".messageHeader").eq(1).text(currMemberCount + " MEMBER")
                    }
                    else{
                        $(".messageHeader").eq(1).text(currMemberCount + " MEMBERS")

                    }
                    $(".messageHeader").eq(1).append('<div class="messageHandle">'+
                    '<span class="online"></span></a>'+
          
                    '<img class="messageSideBarImg" src="'+$(".userProfileImg").attr("src")+'" data-toggle="tooltip" data-placement="left"'+
                    'title="Online"/>'+
                        '<span class="userHandleTxt">'+$(".member_id").val()+'</span>'+
                        '<div class="member-menu">'+
                        '<ul>'+
                        '<li>'+
                                '<a href="/user/'+$(".member_id").val()+'">Profile</a>'+
                            '</li>'+
                            '<li class="text text-danger removeMember">'+
                            'Leave Group'+
                        '</li>'+
                        '</ul>'+
                       '</div>'+
                '</div>');
                    $(".joinButton").hide();
                    $(".hiddenEditor").show()
                    $(button).text("Post to Story");
                    $("#makeSession").show();
                    $(".groupMessage").show();
                    // $(button).attr("onclick","");
                  
                    // $(button).attr("data-toggle","modal");
                    // $(button).attr("data-target",modalId);
                    $(button).attr("data-group",name);    
                } else {
                    $(button).html("Join Group");
                    $(button).attr("data-status", "join");
                    $(button).removeClass("btn-success");
                    $(button).removeClass("btn-danger");
                    $(button).addClass("btn-primary");
                    $("#makeSession").hide();
                    $(".groupMessage").hide();
                    // if(modalId=="#groupProfileModal"){
                    //     //  $(button).attr("onclick","join(this, \'"+id+"\',\'"+name+"\','"+modalId+"','join'); toggleMakeSession('makeSession')");
                    // }else{
                    //     // $(button).attr("onclick","join(this, \'"+id+"\',\'"+name+"\','"+modalId+"','join')");
                    // }
                    // $(button).attr("data-onclick","");
                    // $(button).attr("data-toggle","");
                    // $(button).attr("data-target","");
                    // $(button).attr("data-group","");
                    // $(modalId).modal('hide');    
                }
            },
            500: function (action, msg) {
                alert("500" + msg);
            }
        }
    })
}

function attend(b, id, modalId, b2) {
    button = b
    button2 = b2
    status = $(button).attr("data-status");
    status2 = $(button2);
    meetupName=$(button).attr("data-group");
    payload = {
        id: id,
        action: status+"StudyGroup",
        name: status,
        status2: status2
    }
    $.ajax({
        url: "/" + payload.action,
        type: "POST",
        data: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        },
        statusCode: {
            202: function (action, msg) {
                if(payload.name == "attend") {
                    $(button).html("Leave");
                    $(button).attr("data-status", "leave");
                    $(button).removeClass("btn-primary attendButton");
                    $(button).addClass("btn-danger attendingButton");
                    $(button2).show();
                    // $(button).attr("onclick","");
                    // $(button).attr("data-onclick","attend("+button.id+",'"+id+"','"+modalId+"')");
                    // $(button).attr("data-toggle","modal");
                    // $(button).attr("data-target",modalId);
                    $(button).attr("data-group",meetupName);
                } else {
                    $(button).html("Attend");
                    $(button).attr("data-status", "attend");
                    $(button).removeClass("btn-danger attendingButton");
                    $(button).addClass("btn-primary attendButton");
                    $(button2).hide();
                    // $(button).attr("onclick","attend(this,'"+id+"','"+modalId+"')");
                    // $(button).attr("data-onclick","");
                    $(button).attr("data-toggle","");
                    $(button).attr("data-target","");
                    $(button).attr("data-group","");
                    $(modalId).modal('hide');
                }
            },
            500: function (action, msg) {
                alert("500" + msg);
            }
        }
    })
}
function toggleMakeSession(b_Id){   
    makeSesBtn=$("#"+b_Id)
    makeSesBtn.toggle();
    var membtn=$("#numMem");
    var txt=membtn.html().split(" ");
    var num=parseInt(txt[0]);
    if (makeSesBtn.is(":visible")){
        num++;
    }else{
        num--;
    }
    membtn.html(num+" "+txt[1]);
}
