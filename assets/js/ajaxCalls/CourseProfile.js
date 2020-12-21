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
    var sessions = "";
    for (x in data){
        
        if(data[x].Subject === subject){
         
        sessions += "</h1>"+
        "<div class='tutorBlock tutorBlockDark'>"+
             "<ul class='tutorBlockHeader'>"+
                 "<li><img src='"+data[x].Image+"' alt='Profile Pic' class='profile-pic' />"+
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
                 "<p class='hostName courseText'>"+ data[x].Name+"</p>"+
           "</li>"+
             "<li>"+
                 "<p class='type badge badge-primary'></p>"+
             "</li>"+
        " </ul>"+
         "<div class='tutorBlockBody'>"+
         "<div class='infoItem text-light'>"+
         '<div class="iconImg"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-book-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                      '<path fill-rule="evenodd" d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z"/>'+
                      '<path fill-rule="evenodd" d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869z"/>'+
                '</svg></div>'+
        " <div>"+
        "<p class='timeText courseText'>"+data[x].CourseCode+"</p>"+
         "</div>"+
    " </div>"+
         "<div class='infoItem text-light'>"+
         '<div class="iconImg"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-people-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                          '<path fill-rule="evenodd" d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>'+
                '</svg>'+
         "</div>"+
         "<div>"+
             "<p class='timeText courseText'>"+data[x].Type+"</p>"+
         "</div>"+
     "</div>"+
             "<div class='infoItem text-light'>"+
                 '<div class="iconImg"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cash-stack" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                          '<path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z" />'+
                          '<path fill-rule="evenodd" d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z" />'+
                          '<path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />'+
                '</svg>'+
          "</div>"+
          "<div>"+
              "<p class='timeText courseText'>"+data[x].HourlyRate+"/hour</p>"+
          "</div>"+
             "</div>"+
         "<div class='infoItem text-light'>"+
            '<div class="iconImg"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-hourglass-split" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                          '<path fill-rule="evenodd" d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0c0 .701.478 1.236 1.011 1.492A3.5 3.5 0 0 1 11.5 13s-.866-1.299-3-1.48V8.35z" />'+
                  '</svg>'+
            "</div>"+
            
            "<div>"+
              "<p class='timeText courseText'>"+data[x].NumHours + " hour(s) duration</p>"+
            "</div>"+
      " </div>"+
   
     "<a href='/Checkout?id="+data[x]._id+"' class='btn btn-primary viewTutorMobile'>View Listing</a>"+
     "<div class='tutorButtons'>"+
         "<a type='submit' class='btn btn-primary tutorBtn text-light'"+
             "name=''"+
             "href='/Tutor?handle="+data[x].Handle+"'>View Profile"+
             "</a>"+
         "<form method='POST' action='/connect'>"+
             "<input name='type' type='hidden' value='Added' class='form-control'>"+
            " <input name='from' type='hidden' value='My Connections'"+
                 "class='form-control'>"+
             "<input type='hidden' name='tutor' value='' />"+
            " <input type='hidden' name='img' value='' />"+
             "<input type='hidden' name='time' value='' />"+
             "<input type='hidden' name='date' value='' />"+
             "<input type='hidden' name='location' value='' />"+
             "<input type='hidden' name='class' value='' />"+
             "<a href='/Checkout?id="+data[x]._id+"'"+
                 "class='viewDetails btn btn-primary tutorBtn' name=''>View Listing</a>"+

         "</form>"+
     "</div>"+
"</div>"+
"<br>"+
"</div>";
        }
    }
    if(sessions === ""){
        return "<h3>Become the first tutor for this course</h3><img class='noTutorImage' src='../assets/img/undraw_stand_out.svg'/><br><br><a href='/MyFinances' class='firstTutor-btn'>Start Your Side Hustle</a>";
    }
    else{
        return sessions;
    }
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
      '<input type="submit" value="delete" class="btn btn-danger"/ >'+
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
  //if mobile, make page title the course code
  if(window.innerWidth < 1000){
    $("input[name='screenSize'").val("mobile")
    var courseCode = $("input[name='courseCode']").val();
        $(".mobile-logo-wrapper").html("<h1 class='userProfileHandle1'>"+courseCode+"</h1>"); 
}
    $(".tutorTab").on("click", function(){
        $.ajax({
            url: '/API/Tutors' ,
            method: 'GET',
            error:function(err,str){
               
            }
            }).done(function(res) {
    
                $(".course-profile-info").html(populateTutors(res, $(".courseName").text())) 
        })
    })
    
    $(".discussionTab").on("click", function(){
     $.ajax({
        url: '/API/Discussion' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) { 
          console.log(res.discussion)
          var discussion = "<div class='question-container'><button type='button' class='btn btn-primary askQuestion' data-toggle='modal' data-target='#exampleModalCenter'>"+
                      "Ask a Question</button><h1 class='DiscussionTitle'>"+"Questions asked in "+ $(".courseCodeTxt").text()+
                      "</h1><div class='discussion-container'>";
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
                '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
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
                '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
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
                 var studyGroups = "<div class='question-container'><a href='/startAGroup' class='btn btn-primary' >"+
                             "Create a Group</a><div class='discussion-container'>";
                 var noGroups = true;
                  for(var x = res.length-1; x>=0; x--){
                   if(res[x].Subject === $(".courseCodeTxt").text()){
                    var memberCount = 0;
                    for(x in res[x].Members){
                        memberCount++;
                    }
                    noGroups = false;
                     studyGroups +=  '<div class="checkout-container"><a href="/user/'+res[x].HostHandle+'" class="memberImage"'+
                     'data-toggle="tooltip" data-placement="top"'+
                     'title="Created By '+res[x].HostHandle+'"><div class="checkout-header"><img class="sg-img" src="'+res[x].HostImage+ '"/></a>' +
                     '<p class="group-name">'+res[x].GroupName+'</p></div>'+
                     '<div class="p-container"><p class="descriptionLabel">Description</p><p class="group-description">'+res[x].GroupDescription+'</p>'+
                     '<p class="badge badge-warning prof-badge">Prof. '+res[x].Professor+'</p>';
                     if(memberCount === 1){
                      studyGroups += '<p class="badge badge-primary">'+memberCount+ ' member</p></div></div>';
                     }
                     else{
                      studyGroups += '<p class="badge badge-primary">'+memberCount+ ' members</p></div></div>';
                     }
                    
                    
                 }
                 
               }
               if(noGroups){
                studyGroups += '<p class="noGroups">No groups exist</p>';
               }
                 $(".course-profile-info").html(studyGroups+"</div></div>");
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
    $(".studentsTab").on("click", function(){
    payload = {
      course:$(".courseName").text()
  }
    $.ajax({
      url: "/getStudentsByCourse",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
         $(".question-container").remove();
          if(result.students != ""){
            $(".course-profile-info").html(populateStudents(result.students));
          }
          else{
            $(".course-profile-info").html("<h3 class='course-noStudents'>No students have added this course</h3>");
          }
        
        },
        500: function (result) {
          alert("500 ");
        },
      },
    });
  })
    })

  

