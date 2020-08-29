//join/leave course on course profile page
$(document).ready(function(){

  $(".joined").mouseover( function(){
    $(this).text("Leave")
    $(this).removeClass("btn-success");
    $(this).addClass("btn-danger");
  })
  $(".joined").mouseout( function(){
    $(this).text("Joined")
    $(this).removeClass("btn-danger");
    $(this).addClass("btn-success");
    
  })
    $(".addCourse").on("submit", function(e){
        e.preventDefault();
        payload = {
            course:$(".courseName").text(),
            handle:$(".userProfileName ").text(),
            courseId:$("input[name='courseId'").val(),
            courseCode:$(".courseCodeTxt").text(),
            exists:false, 
            status:$("input[name='status']").val()

        }
        $.ajax({
            url: "/"+payload.status,
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                var studentCount = parseInt($(".studentCount").text());
                  if(payload.status === "addCourse"){
                    //change html to display joined/join hover leave
                    studentCount++;
                    if(studentCount == 1){
                      $(".numStudents").html("<span class='studentCount'>"+studentCount + "</span><span> Student</span>")
                    }
                    else{
                      $(".numStudents").html("<span class='studentCount'>"+studentCount + "</span><span> Students</span>")
                    }
                   
                    $(".follow-btn").removeClass("btn-primary");
                    $(".follow-btn").addClass("btn-success");
                    $(".follow-btn").addClass("joined");
                    $(".follow-btn").text("Joined")
                    $("input[name='status']").val("leaveCourse");
                    $(".joined").mouseover( function(){
                      $(this).text("Leave")
                      $(this).removeClass("btn-success");
                      $(this).addClass("btn-danger");
                    })
                    $(".joined").mouseout( function(){
                      $(this).text("Joined")
                      $(this).removeClass("btn-danger");
                      $(this).addClass("btn-success");
                      
                    })
                   
                  }
                  else{
                    studentCount--;
                    if(studentCount == 1){
                      $(".numStudents").html("<span class='studentCount'>"+studentCount + "</span><span> Student</span>")
                    }
                    else{
                      $(".numStudents").html("<span class='studentCount'>"+studentCount + "</span><span> Students</span>")
                    }
                    $(".joined").unbind("mouseover mouseout")
                    $(".follow-btn").removeClass("joined");
                    $(".follow-btn").addClass("btn-primary");
                    $(".follow-btn").removeClass("btn-success");
                    $(".follow-btn").removeClass("btn-danger");
                    
                    $(".follow-btn").text("Add Course")
                    $("input[name='status']").val("addCourse");
                    
                  }   
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
    })

})