function countLength(text){
    return text.val().length;
}
//format courses for ajax get request
function formatCourses(res){
    var myCourses = "";
    for(x in res){
        myCourses += 
        '<a class="courseLink" href="/Course/'+res[x].courseName+'" data-toggle="tooltip" data-placement="top" title="'+res[x].courseName+'">'+
        '<div class="course-container">'+
            '<h5 class="courseCode1">'+res[x].courseCode+'</h5>'+
            '<span class="badge badge-success profile-student-count">#UNCC</span>'+
        '</div>'+
    '</a>';
    }
    if(myCourses != ""){
        return myCourses;
    }
    else{
        return "<p class='noTutorSesh'>No courses added</p>";
    }
   
}
//format groups for ajax get request
function formatGroups(res){
    var groups = "";
    for(x in res){
        groups += 
        '<a class="courseLink" href="/Group/'+res[x].studyGroupId+'">'+
        '<div class="course-container2">'+
            '<h5 class="courseCode2">'+res[x].studyGroupName+'</h5>'+
            '<span class="badge badge-primary profile-student-count">'+res[x].course+'</span>'+
        '</div>'+
    '</a>';
    }
    if(groups != ""){
        return groups;
    }
    else{
        return "<p class='noTutorSesh'>No groups added</p>";
    }
    
}
//format tutors for ajax GET request
function populateTutors(data){
    var sessions = "";
    for (x in data){
        sessions += "<div class='tutorBlock tutorBlockDark'>"+
             "<ul class='tutorBlockHeader'>"+
                 "<li><img src='../"+data[x].Image+"' alt='Profile Pic' class='profile-pic' />"+
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
                 "<p class='hostName'>"+ data[x].Name+"</p>"+
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
        " </div>"+
    " </div>"+
     
     
     "<div class='tutorButtons'>"+
         "<a type='submit' class='btn btn-primary tutorBtn text-light'"+
             "name=''"+
             "href='/User/"+data[x].Handle+"'>View Profile"+
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
    if(sessions === ""){
        return "<p class='noTutorSesh'>No active tutoring sessions</p>";
    }
    else{
        return sessions;
    }
    
}

function formatReviews(res){
    if(res.length > 0){

  
    var reviewTotal = 0;
    var reviewCount = 0;
    for(var x = res.length-1; x >= 0; x--){
        reviewCount++;
        reviewTotal+=parseInt(res[x].Rating);
    }
    var averageRating = reviewTotal/reviewCount;
    var stars = "<div class='starRating'>";
    for(var y = 0; y < averageRating; y++){
        stars +=   '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
        '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
        '</svg></span>';
    }
    stars += "</div>";
    var reviews = "<div class='avgRating'><p class'ratingTxt'>Average Rating</p>"+stars+"<p class='rating-subTxt'>"+averageRating.toFixed(2)+"/5 stars</p></div>";
    for(var x = res.length-1; x >= 0; x--){
        var stars = "<div class='starRating'>";
        
        for(var i = 0; i< parseInt(res[x].Rating);i++){
            stars +=  '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
            '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
            '</svg></span>';
            
        }
        stars+= "</div>";
        reviews+="<div class='reviewBlock tutorBlockDark'>"+
        "<ul class='review-header'>"+
            "<li>"+
            '<a class="" href="/User/'+res[x].SenderHandle+'" data-toggle="tooltip" data-placement="top" title="'+res[x].SenderHandle+'">'+
               " <h1 class=' review-handle text-light'><img src='../"+res[x].SenderImg+"' alt='Profile Pic' class='review-pic' />"+ res[x].SenderHandle+"</h1>"+
            '</a>'+
       "</li>"+
       "<li><p class='reviewCourse'>"+res[x].Course+"</p></li>"+
      "<li>"+
      "</li>"+
        "<li>"+
            "<p class='type badge badge-primary'></p>"+
        "</li>"+
   " </ul>"+
    "<div class=''>"+
    "<div class='reviewBody text-light'>"+
   " <div>"+

   "<div>"+stars+"</div>"+
   "<p class='reviewMsg'>"+res[x].Message+"</p>"+
    "</div>"+
" </div>"+
"</div>"+
"</div>";
    }
    return reviews;
}
else{
    return "<p class='noTutorSesh'>No reviews</p>";
}
}
$(document).ready(function(){

    $(".profile-ul li").on("click", function(){
        $(".profile-ul li").removeClass("tab-selected");
        $(this).addClass("tab-selected");
    })
    //save the old bio in case they discard the new bio
    $.session.set('oldBio', $("#changeBio").val());
    $("#changeBio").on("keyup", function(){
        $(".charCount").children().eq(0).children().eq(0).text(countLength($(this)))
    })

    //when discard button is clicked
    $(".profileBio").on("click", ".discard", function(){
        $(".charCount").remove();
        $("#changeBio").attr("readonly", true);
        $("#changeBio").css({
            backgroundColor: "#1d1d1d",
            minHeight:"30px"
        })
        //reset to old bio
        $("#changeBio").val($.session.get('oldBio'));
        $(".editBio").show();
    })

    //when save button is clicked
    $(".profileBio").on("click", ".save", function(){

        payload = {
            handle:$(".userProfileName ").text(),
            bio: $("#changeBio").val()
        }
        $.ajax({
            url: "/setBio",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".charCount").remove();
                $("#changeBio").attr("readonly", true);
                $("#changeBio").css({
                    backgroundColor: "#1d1d1d",
                    minHeight:"30px"
                })
                $("#changeBio").val(result.bio);
                $(".editBio").show();
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })
    $(".editBio").on("click", function(){
        $(this).hide();
        $("#changeBio").attr("readonly", false);
        $("#changeBio").css({
            minHeight : "120px",
            backgroundColor: "#242526",
        })
        $("#changeBio").select();
        $(".profileBio").append("<div class='charCount'><p><span>0</span>/150 characters</p><p class='bioBtns'><button class='btn btn-danger discard'>Discard</button><button class='btn btn-primary save'>Save</button></p></div>")
    })

    $(".courseTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Courses");
        $(".spinner-container1").show();
        payload = {
            userHandle: $(".userProfileHandle").text().trim()
        }
        $.ajax({
            url: "/getCourses",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  console.log(result)
                  $(".spinner-container1").hide();
                $(".profile-item-list").html(formatCourses(result.courses));
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    })
    $(".tutorTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Tutoring Sessions");
        $(".spinner-container1").show();
        payload = {
            userHandle: $(".userProfileHandle").text().trim()
        }
        $.ajax({
            url: "/getTutorListings",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".spinner-container1").hide();
                  console.log(result)
                $(".profile-item-list").html(populateTutors(result.tutoringSessions));
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    });
    $(".reviewsTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Reviews");
        $(".spinner-container1").show();
        payload = {
            userHandle: $(".userProfileHandle").text().trim()
        }
        console.log(payload.userHandle)
        $.ajax({
            url: "/getReviews",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".spinner-container1").hide();
                $(".profile-item-list").html(formatReviews(result.reviews));
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    });
    $(".groupsTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Groups");
        $(".spinner-container1").show();
        payload = {
            userHandle: $(".userProfileHandle").text().trim()
        }
        $.ajax({
            url: "/getGroups",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".spinner-container1").hide();
                $(".profile-item-list").html(formatGroups(result.groups));
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    });
})

