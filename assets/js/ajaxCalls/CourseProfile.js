//ajax calls for course profile tabs
function formatDate(date){
    var dateArray = date.toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
    for(var x = 0; x < monthArray.length; x++){
      if(monthArray[x].includes(dateArray[1])){
        month = monthArray[x];
      }
    }
    if( todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2] ){
      return "Today";
    }
    else if(month == ""){
      return "";
    }
    else{
      return month + " " + dateArray[2];
    }
  }

function populateTutors(data, subject){
  if(data.length == 0){
    return "<h3>Become the first tutor for this course</h3><img class='noTutorImage' src='../assets/img/undraw_stand_out.svg'/><br><br><a href='/MyFinances' class='firstTutor-btn'>Start Your Side Hustle</a>";
}
else{
  var sessions = "";
  for (x in data){
      if(data[x].course === subject){
      sessions += "</h1>"+
      "<div class='tutorBlock tutorBlockDark'>"+
           "<ul class='tutorBlockHeader'>"+
               "<li><img src='"+data[x].userImg+"' alt='Profile Pic' class='profile-pic' />"+
                  " <h1 class='connectionName text-light'></h1>"+
          "</li>"+
           "<li class='starRating'>"+
              '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                    '</svg></span>'+
              '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                    '</svg></span>'+
              '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                    '</svg></span>'+

              '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                    '</svg></span>'+
              '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
                    '</svg></span>'+
         "  </li>"+
         "<li>"+
               "<p class='hostName courseText'>"+ data[x].userName+"</p>"+
         "</li>"+
           "<li>"+
               "<p class='type badge badge-primary'></p>"+
           "</li>"+
      " </ul>"+
       "<div class='tutorBlockBody'>"+
           "<div class='infoItem text-light'>"+
               '<div class="iconImg"><svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-cash-stack" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                        '<path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z" />'+
                        '<path fill-rule="evenodd" d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z" />'+
                        '<path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />'+
              '</svg>'+
        "</div>"+
        "<div>"+
            "<p class='timeText courseText'>$"+data[x].hourlyRate+"/hour</p>"+
        "</div>"+
           "</div><br>"+
       "<div class='infoItem text-light'>"+
       "<a type='submit' class='btn btn-primary text-light'"+
       "name=''"+
       "href='/user/"+data[x].userHandle+"'>View Profile"+
       "</a><br><br>"+     
       "<a type='submit' class='btn btn-primary text-light join-room-btn'"+
       "name=''"+
       "href='/room/"+data[x].streamId+"'>Join Room"+
       "</a></div>"+
    " </div>"+
"</div>"+
"</div>";
      }
}
    
    }
    return sessions;
    
}
function populateDiscussion(res, subject){
    var discussion = "";

   
    for(var x = res.length-1; x>=0; x--){
        if(res[x].courseName === subject){
      discussion +=  '<div class="question">'+
      '<img class="discImg" src="'+res[x].userImg+'"/>'+
      '<span>'+res[x].userHandle+'</span>'+
      '<p>'+res[x].date+'</p>'+
      
      '<p class="questionText">'+res[x].post+'</p>';
      if(parseInt(res[x].commentCount) === 1){
        
        discussion += '<p><a class="responseLink" href="/post/'+res[x].timelineId+'?discussion='+res[x]._id+'">'+res[x].commentCount+' Comment</a></p>';
      }
      else{
        discussion += '<p><a class="responseLink" href="/post/'+res[x].timelineId+'?discussion='+res[x]._id+'">'+res[x].commentCount+' Comments</a></p>';
      }
      discussion +=
      '<form action="removeDiscussion" method="POST">'+
      '<input type="hidden" name="discId" value="'+res[x]._id+'"/ >'+
      '<input type="hidden" name="course" value="'+res[x].courseName+'"/ >'+
      '<input type="submit" value="Delete" class="btn btn-danger"/ >'+
      '</form>'
  '</div>';
    }
    }
    return discussion;               
}
function populateStudents(students){
  var student = "<div class='student-container'><ul>";
  for(var x =students.length-1; x>= 0;x--){
    var noAtHandle=students[x][0].handle.replace('@','');
    if(students[x][1]){
      student+= "<li>"
      +"<input type='hidden' value ='"+students[x][0].handle+"'/>"
      +"<input type='hidden' value ='"+students[x][0].image+"'/>"
      +"<button id='"+noAtHandle+"'data-status='unfollow' type='button' class='btn btn-secondary followingButton'data-handle='"+students[x][0].handle+"'>Following</button>"
      +"<a href='../user/"+students[x][0].handle+"'><h3><img class='studentImage' src='"+students[x][0].image+"'/>"+students[x][0].first_name+" "+students[x][0].last_name+"</h3><h5>"+students[x][0].handle+"</h5></a>"
      +"<p class='bioTxt'>"+students[x][0].Bio+"</p></li>"  
    }else{
      student+= "<li>"
      +"<input name='email' type='hidden' value ='"+students[x][0].email+"'/>"
      +"<input type='hidden' value ='"+students[x][0].handle+"'/>"
      +"<input type='hidden' value ='"+students[x][0].image+"'/>"
      +"<button id=\""+noAtHandle+"\" data-status=\"follow\" type=\"button\" class=\"btn btn-primary followingButton\">Follow</button>"
      +"<a href='../user/"+students[x][0].handle+"'><h3><img class='studentImage' src='"+students[x][0].image+"'/>"+students[x][0].first_name+" "+students[x][0].last_name+"</h3><h5>"+students[x][0].handle+"</h5></a>";
      if(students[x][0].Bio != "Tell the world a bit about yourself"){
        student += "<p class='bioTxt'>"+students[x][0].Bio+"</p></li>";  
      }
    }
  }
  student +="</ul></div>";
  if(student === "<div class='student-container'><ul>"){
    return "<h3>No students have added this course</h3>";
  }
  else{
    return student;
  }
}
$(document).ready(function(){
  $(".courseProfileContainer").on("click", ".course-select-day", function () {
    showDropdown($(this))
})
  $(".course-select").on("click", function(){
    if($(".course-dropdown").css("display") == "none") {
      $(".course-dropdown").show()
     
    }
    else {
      $(".course-dropdown").hide()

    }
  })
  //filter time
  $(".courseProfileContainer").on("click", ".time-dropdown ul li", function () {
    filterTime($(this), $(".headerLinkTitle").text());
})
//filter day
$(".courseProfileContainer").on("click", ".day-dropdown ul li", function () {
    filterDay($(this), $(".headerLinkTitle").text());
})
//filter am/pm
$(".courseProfileContainer").on("click", ".amPm-dropdown ul li", function () {
    filterAmPm($(this), $(".headerLinkTitle").text());
})
//reserve seat
//reserve seat
$(".courseProfileContainer").on("click", ".reserveSeat", function(){
  reserveSeat($(this))
})
  //if mobile, make page title the course code
  var course = $(".courseName").text();
  var courseCode = $("input[name='courseCode']").val();
  if(window.innerWidth < 1000){
    $("input[name='screenSize'").val("mobile")
  
        $(".mobile-logo-wrapper").html("<h1 class='userProfileHandle1'>"+courseCode+"</h1>"); 
}
    $(".tutorTab").on("click", function(){
      getFirstTutorRooms(courseCode);
    })
              $(document).on("click",".join-room-btn", function(e){
                e.preventDefault();
                var url = $(this).attr('href');
                window.open(url, "stream", "location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,resizable=yes,width=800,height=600,top=4,left=6").focus();
                return false;
              })
    })
    
    $(".discussionTab").on("click", function(){
     $.ajax({
        url: '/API/Discussion' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) { 
          var discussion = "<div class='question-container'>"+
          '<div class="askAQuestion">'+
                    
                    '<div class="comments-actions-list">'+
                      
                            '<label id="imageUploadLabel"  for="attachment" class=" ">'+
                              '<svg data-toggle="tooltip" data-placement="top"'+
                              'title="File Upload" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                                '<path fill-rule="evenodd" d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0H4zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>'+
                              '</svg>'+
                            '</label>'+
                            '<input class="askQuestion-file" id="attachment" name="attachment" type="file">'+
                            
                        '</div>'+
                    '<div class="questionTxt-container">'+
                        '<p contenteditable="true" id="message" class="questionTxt">Ask a question</p>'+

                    '</div>'+
                    '<div class="postQuestion-container">'+
                        '<div class="image-attachments">'+
                                
                    '</div>'+

                        '<button id="postQuestion" class="btn btn-primary postQuestion">Post</button>'+

                    '</div>'+
                '</div>'+
          '<div class="discussion-container">';
          var handle = res.currHandle;
          for(var x = res.discussion.length-1; x>=0; x--){
           
            if(res.discussion[x].courseName === $(".courseName").text()){
              if(res.discussion[x].anonymous == true){
              discussion +=  '<div class="question">'+
              '<div class="question-container1">'+
              '<span class="discName">Anonymous</span>'+
              '<p class="dateText">'+formatDate(new Date(res.discussion[x].date))+"</p>";

             
              discussion += '<p class="questionText">'+res.discussion[x].post+'</p>';
             
              if(parseInt(res.discussion[x].commentCount) === 1){
                discussion +=
              '<p><a class="responseLink" href="/post/'+res.discussion[x].timelineId+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comment</a></p>';
              }
              else{
                discussion +=
                '<p><a class="responseLink" href="/post/'+res.discussion[x].timelineId+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comments</a></p>';
                
              }
              if(handle === res.discussion[x].userHandle){
                discussion+=
                '<form action="removeDiscussion" method="POST"  class="removeDiscussion">'+
                '<input type="submit" value="Delete" class="btn btn-danger deleteDiscussion"/ >'+
                '<input type="hidden" name="discId" value="'+res.discussion[x]._id+'"/ >'+
                '<input type="hidden" name="course" value="'+res.discussion[x].courseName+'"/ >'+
                '</form>'+
                '</div>'
            '</div>';
        }
        else{
          discussion+=
              '</div>'
          '</div>';
        }
            }
            else if(res.discussion[x].anonymous === false){
              discussion +=  '<div class="question">'+
              '<div class="question-container1">'+
              '<a href="/user/'+res.discussion[x].userHandle+'">'+
              '<img class="discImg" src="'+res.discussion[x].userImg+'"/>'+
              '<span class="discName">'+res.discussion[x].userHandle+'</span></a>'+
              '<p class="dateText">'+formatDate(new Date(res.discussion[x].date))+"</p>";

               discussion += '<p class="questionText">'+res.discussion[x].post+'</p>';
               if(res.discussion[x].attachments.length > 0){
                discussion += "<div class='question-img-container'><img class='question-img1' src='"+res.discussion[x].attachments[0].file+"'/>"+
                '<div><a target="_blank" class="pdf-link" href="'+res.discussion[x].attachments[0].file+'">View Full Screen</a></div></div>';
               }
              if(parseInt(res.discussion[x].commentCount) === 1){
                discussion +=
              '<p><a class="responseLink" href="/post/'+res.discussion[x].timelineId+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comment</a></p>';
              }
              else{
                discussion +=
                '<p><a class="responseLink" href="/post/'+res.discussion[x].timelineId+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comments</a></p>';
              }
              if(handle === res.discussion[x].userHandle){
                discussion+=
                '<form action="removeDiscussion" method="POST" class="removeDiscussion">'+
                '<input type="submit" value="Delete" class="btn btn-danger deleteDiscussion"/ >'+
                '<input type="hidden" name="discId" value="'+res.discussion[x]._id+'"/ >'+
                '<input type="hidden" name="course" value="'+res.discussion[x].courseName+'"/ >'+
               
                '</form>'+
              '</div>'
          '</div>';
              }
              else{
                discussion+=
                '</div>'
            '</div>';
              }
            }
          }
        }
          $(".course-profile-info").html(discussion+"</div></div>");
    });
    })
    $(".studyTab").on("click", function(){
    
            $.ajax({
               url: '/API/StudyGroups' ,
               method: 'GET',
               error:function(err,str){
               }
               }).done(function(res) { 
                 var studyGroups = "<div class='question-container'><div class='discussion-container'>";
                 var noGroups = true;
                  for(var x = res.length-1; x>=0; x--){
                   if(res[x].Subject === $(".courseCodeTxt").text()){
                    var memberCount = 0;
                    for(x in res[x].Members){
                        memberCount++;
                    }
                    noGroups = false;
                     studyGroups +=  '<div class="course-group-container">'+
                     '<a href="../Group/'+res[x]._id+'">'+
                     '<img class="sg-img" src="'+res[x].HostImage+ '"/>'+
                     '</a>' +
                     '<p class="group-name">'+res[x].GroupName+'</p>';
                     if(res[x].Members.length === 1){
                      studyGroups += '<p class="badge badge-secondary group-mem-count">'+res[x].Members.length+ ' member</p></div></div>';
                     }
                     else{
                      studyGroups += '<p class="badge badge-secondary group-mem-count">'+res[x].Members.length+ ' members</p></div></div>';
                     }
                    
                    
                 }
                 
               }
               if(noGroups){
                studyGroups += '<p class="noGroups">No groups exist</p>';
               }
               else {
                $(".course-profile-info").html(studyGroups+"</div>");

               }
           });
    });

    $(".profile-ul li").on("click", function(){
        $(".profile-ul li").removeClass("tab-selected");
        $(this).addClass("tab-selected");
    })


    $(".newDiscussion").on("submit",function(e){
        if($(".questionTxt").val() === "" || $(".questionTxt").val() === " " ){
            $(".questionTxt").css("border","1px solid red");
            e.preventDefault();
        }
    })

  

