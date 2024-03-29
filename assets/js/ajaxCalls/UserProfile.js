function countLength(text){
    return text.val().length;
}
//format courses for ajax get request
function formatCourses(res){
    var myCourses = "";
    for(x in res){
        myCourses += 
        '<a class="courseLink" href="/course/'+res[x].courseName+'">'+
        '<div class="course-container" " data-toggle="tooltip" data-placement="bottom" title="'+res[x].courseName+'">'+
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
    if(data.length == 0){
      return "<h3>Become the first tutor for this course</h3><img class='noTutorImage' src='../assets/img/undraw_stand_out.svg'/><br><a href='/MyFinances' class='firstTutor-btn'>Start Your Side Hustle</a>";
  }
  else{
    var sessions = "";
    for (x in data){
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
                 '<div class="iconImg">'+
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">'+
                 '<path fill-rule="evenodd" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5V2z"/>'+
               '</svg>'+
          "</div>"+
          "<div>"+
          "<p class='timeText courseText'>"+data[x].courseCode+"</p>"+
          "</div>"+
             "</div>"+
             "</div>"+
         "<div class='infoItem text-light'>"+  
         "<a class='btn btn-primary text-light join-room-btn'"+
         "name=''"+
         "href='/room/"+data[x].streamId+"'>Join Room"+
         "</a></div>"+
      " </div>"+
  "</div>"+
  "</div>";
    }
      }
      return sessions;
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
    var reviews = "<div class='avgRating'><p class'ratingTxt'>"+res.length+ " Reviews</p>"+stars+"<p class='rating-subTxt'>"+averageRating.toFixed(2)+"/5 stars</p></div>";
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
            '<a class="" href="/user/'+res[x].SenderHandle+'" data-toggle="tooltip" data-placement="top" title="'+res[x].SenderHandle+'">'+
               " <h1 class=' review-handle text-light'><img src='"+res[x].SenderImg+"' alt='Profile Pic' class='review-pic' />"+ res[x].SenderHandle+"</h1>"+
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
    if(window.innerWidth < 1000){
        var handle = window.location.href.split("/")[4];
        if($("input[name='isTutor']").val() == "true"){
            $(".mobile-logo-wrapper").html("<h1 class='userProfileHandle1'>"+handle+"<a class='memberImage' data-toggle='tooltip' data-placement='top'"+
            "title='Verified Tutor'>"+
            "<img class='tutorBadge' src='../assets/img/tutorBadge.svg' />"+
       "</a></h1>")
        }
        else{
            $(".mobile-logo-wrapper").html("<h1 class='userProfileHandle1'>"+handle+"</h1>")
        }
       
        
    }
   
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
            backgroundColor: "#18191a",
            minHeight:"100px"
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
                    backgroundColor: "#18191a",
                    minHeight:"100px"
                })
                $("#changeBio").val(result.bio);
                $(".editBio").show();
                updateProgressBar('#addBio');
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
            handle: $("input[name='handle']").val()
        }
        $.ajax({
            url: "/getCourses",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  $(".spinner-container1").hide();
                $(".profile-item-list").html(formatCourses(result.courses));
              },
              500: function (result) {
                alert("500 ");
              },
            },
          });
    })
    $(".tutorTab1").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Availability");
        $(".spinner-container1").show();
        getFirstTutorRoomsUserProfile($("input[name='userId']").val());
    });
    $(".reviewsTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Reviews");
        $(".spinner-container1").show();

        payload = {
            handle: $("input[name='handle']").val()
        }
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
    $(".profileBody").on("click", function () {

    //   getTutorRooms($(this).text(), $("input[name='day-value']").val(), $(".time-text").text(),
    //       $(".am-text").text())

  })
  //show filter dropdowns
  $(".profileBody").on("click", ".course-select", function () {
      $(".course-dropdown-day").hide();
      if ($(".course-dropdown").css("display") == "none") {
          $(".course-dropdown").show()
      }
      else {
          $(".course-dropdown").hide()
      }
  })
  $(".profileBody").on("click", ".course-select-day", function () {
      showDropdown($(this))
  })
   //filter day
   $(".profileBody").on("click", ".day-dropdown ul li", function () {
    $(".day-text").text($(this).text());
       $(".date-select").val($(this).children().eq(0).val());
       $("input[name='day-value']").val($(this).children().eq(0).val())
       getTutorRoomsUserProfile($("input[name='userId']").val(), parseInt($(this).children().eq(0).val()))
    
})
$(".profileBody").on("click", ".course-dropdown ul li", function () {
 //filter course
 console.log("course: " +$(".courseName-text").text())
 $(".courseName-text").text($(this).text())
getTutorRoomsUserProfile($("input[name='userId']").val(), $("input[name='day-value']").val())
})
    $(".groupsTab").on("click", function(){
        $(".profile-item-list").html("");
        $(".loading-span").text("Loading Groups");
        $(".spinner-container1").show();
        payload = {
            handle: $("input[name='handle']").val()
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
    $(document).on("click",".join-room-btn", function(e){
      e.preventDefault();
      var url = $(this).attr('href');
      window.open(url, "stream", "location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,resizable=yes,width=800,height=600,top=4,left=6").focus();
      return false;
    })
    $(document).on("click",".rooms-btn", function(e){
        var time = $(this).prev().prev().text();
        reserveSeat($(this), time)
      })
   

   
})

