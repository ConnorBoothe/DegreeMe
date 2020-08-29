// $(document).ready(function(){
//     $.ajax({
//         url: '/API/StudyGroups' ,
//         method: 'GET',
//         error:function(err,str){
//         }
//         }).done(function(res) { 

//         //     <div class="studyGroupItems">
//         //     <img class="StudyGroupsImage" src="assets/img/woman-2.png" style="width: 207.28px;" />
//         //     <br>
//         //     <a class="groupName"
//         //     href="/studyGroup/"></a>
//         //     <p class="course "></p>
//         //     <h3 class="numMembers">25 Members</h3>
//             // <form action="/#" method="post" id="">
//             //     <input name="unjoingroup" type="hidden" value="joinedGroup" />
//             //     <button  type="button"></button>
                       
//             // </form>
           


//         // </div>
//             var studyGroups = "";
//             for(x in res){
//                 studyGroups += '<div><div class="courseTitle-container"><h3 class="courseTitle">'+res[x][0] + '</h3></div>';
//                 if(res[x][1][0]){
//                     for(i in res[x][1])
//                     studyGroups +='<div class="studyGroupItems">'+
//                     '<img class="StudyGroupsImage" src="'+res[x][1][i].HostImage+'" style="width: 207.28px;" />'+
//                     '<br><a class="groupName" href="/studyGroup/'+res[x][1][i]._id+'"><h4 class="groupName">'+res[x][1][i].GroupName+'</h4></a>'+
//                     '<h3 class="numMembers">25 Members</h3>'+
//                     '<button type="button" class="btn-primary join">Join</button> </div>';
//                 }
//                 else{
//                     studyGroups+= "<div class='nogroup-container'><div><img class='no-study-group' src='assets/img/undraw_camping.svg'/><div class='nogroup-right'><h3 class='nogroup text-light'>No Study Groups Exist</h3><a href='/NewGroup' class='createFirst'>Create the first!</a></div></div></div>";
//                 }
//             }
//             $(".studyGroup-wrapper").html(studyGroups+"</div>");
           
//     });

// })
