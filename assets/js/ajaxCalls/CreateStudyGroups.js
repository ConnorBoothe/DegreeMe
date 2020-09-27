function validateGroup(){
    var submit = true;
    if($("#group_name").val() == ""){
        $("#group_name").css("border-bottom", "2px solid #dc3545");
        submit = false;
    }
    if($("#group_description").val() == ""){
        $("#group_description").css("border-bottom", "2px solid #dc3545");
        submit = false;
    }
    // if($("#courseName").val() == ""){
    //     $("#courseName").css("border-bottom", "2px solid #dc3545");
    //     submit = false;
    // }
    // if($("#professor").val() == ""){
    //     $("#professor").css("border-bottom", "2px solid #dc3545");
    //     submit = false;
    // }
    return submit;
    
}
$(document).ready(function(){
    $(".course-autocomplete").hide();
    $("#courseName").on("focus", function(){
        $(".course-autocomplete").show();
    })
    $(".input-field-createStudyGroup").on("focus", function(){
        $(this).css("border-bottom", "2px solid #007bff");
        $(this).next().text("");
    })
    $(".input-field-createStudyGroup").on("focusout", function(){
        $(this).css("border-bottom", "2px solid #a9a9a9");
    })

    $(".autocomplete-wrapper").on("click", ".courseCountainer", function(){
        $("#courseName").val($(this).children().eq(1).text());
        $(".course-autocomplete").hide();
        $(".blocker").hide();
    })
    $("#courseName").on("focus", function(){
        $(".blocker").show();
        
    })
    $(".blocker").on("click", function(){
        $(this).hide();
        $(".course-autocomplete").hide();
    })

    $("#courseName").on("keyup", function(){
    payload = {
        searchValue:$("#courseName").val(),
        type:"Courses" 
     }
     $.ajax({
         url: "/siteWideSearch",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
             if(result.type === "Courses"){
                 if(($("#courseName").val() === "")){
                     $(".course-autocomplete").html("<p class='emptySearch'>Search Courses</p>");
                 }
                 else if(result.Courses.length > 0){
                    var courses = "";
                     for(var x = 0; x < 5;x++){
                         courses+= "<div class='courseCountainer'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                         result.Courses[x].CourseCode+"</p></div>";
                     }
                     $(".course-autocomplete").html(courses);
                 }
                 else{
                     $(".course-autocomplete").html("<p class='noMatch'>No matching Results</p>");
                 }
             } 
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     });
    });
    //AJAX post call to create Group
    $("#createStudyGroup").on("click", function(e){
        var submit = validateGroup();
        e.preventDefault();
        if(submit){
            payload = {
                course:$("#courseName").val(),
                professor:$("input[name='professor']").val(),
                groupName:$("input[name='groupName']").val(),
                groupDescription:$("#group_description").val(),
                groupImage:$(".userProfileImg").attr("src")
             }
             $.ajax({
                 url: "/createGroup",
                 type: 'POST',
                 data: JSON.stringify(payload),
                 headers: {
                 "Content-Type": "application/json"
                 }, statusCode: {
                 202: function (result) {
                    
                    if(result.action == "Group Name Exists"){
                        $("#groupNameTxt").text("Group name already exists.")
                        $("#group_name").css("border-bottom", "2px solid #dc3545");
                    }
                    else{
                        $(".hiddenGroup").val($("input[name='groupName']").val())
                        $(".hiddenGroupId").val(result.groupId)
                        $("#hostSession-form").hide();
                        $("#hostSession-form").html("<h1>Group Successfully Created</h1><img class='group-success-img' src='../assets/img/undraw_launch_day_4e04.svg'/>"
                        +'<input type="hidden" class="emailAction" value="Invite Group"/>'+
                        "<h2 class='inviteFriends'>Invite Your Friends</h2><button data-toggle='modal' data-target='#inviteModal' class='btn btn-primary'>Via email</button>");
                        $("#hostSession-form").fadeIn();
                    }
                 },
                 500: function (result) {
                     alert("500 ");
                     console.log(result)
                 },
                 },
             });  
        }
        
    })
    
    

})