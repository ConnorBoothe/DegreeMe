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
    $(".priceSlider").on("change", function(){
        if($(this).val() == 1) {
            $(".private").text("Private")
        }
        else {
            $(".private").text("Public")
        }
    })
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
        alert("Y")
        var submit = validateGroup();
        e.preventDefault();
        if(submit){
            payload = {
                course:$("#courseName").val(),
                professor:$("input[name='professor']").val(),
                createGroupName:$("input[name='createGroupName']").val(),
                groupDescription:$("#group_description").val(),
                groupImage:$(".userProfileImg").attr("src"),
                private:$(".priceSlider").val()
             }
             $.ajax({
                 url: "/createGroup",
                 type: 'POST',
                 data: JSON.stringify(payload),
                 headers: {
                 "Content-Type": "application/json"
                 }, statusCode: {
                 202: function (result) {
                    console.log(result.action)
                    if(result.action == "Group Name Exists"){
                        $("#groupNameTxt").text("Group name already exists.")
                        $("#group_name").css("border-bottom", "2px solid #dc3545");
                    }
                    else{
                        $(".hiddenGroupId").val(result.groupId);
                        $(".modal").modal("hide");
                        window.location.href = "/Group/"+ result.groupId;
                    
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