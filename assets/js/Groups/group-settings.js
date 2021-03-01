$(document).ready(function(){
$(".group-settings-input").eq(0).on("focus", function(){
    $(".blocker").show();
    $(".groups-course-autocomplete").show();
})
$(".blocker").on("click", function(){
    $(".blocker").hide();
    $(".groups-course-autocomplete").hide();
})
$(".groups-course-autocomplete").on("click",".courseCountainer", function(){
    $(".group-settings-input").eq(0).val($(this).children().eq(1).text());
    $(".blocker").hide();
    $(".groups-course-autocomplete").hide();
})
//group settings autocomplete
$(".group-settings-input").on("keyup", function(){
    var searchVal = $(this).val();
            payload = {
               searchValue:$(this).val(),
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
                        if((searchVal === "")){
                            $(".groups-course-autocomplete").html("<p class='emptySearch'>Search Courses</p>");
                        }
                        else if(result.Courses.length > 0){
                           var courses = "";
                            for( x in result.Courses){
                                courses+= "<div class='courseCountainer'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                                result.Courses[x].CourseCode+"</p></div>";
                            }
                            $(".groups-course-autocomplete").html(courses);
                        }
                       
                        else{
                            $(".groups-course-autocomplete").html("<p class='noMatch'>No matching Results</p>");
                        }
                    } 
                },
                500: function (result) {
                    alert("500 ");
                    console.log(result)
                },
                },
            });
    })
    $(".save-changes-btn").on("click", function(){
        var payload = {
            groupId: $(".groupId").val(),
            course:  $(".group-settings-input").eq(0).val(),
            professor: $(".group-settings-input").eq(1).val()
        }
        $.ajax({
            url: "/updateGroupSettings",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
            "Content-Type": "application/json"
            }, statusCode: {
            202: function (result) {
                
                $(".update-success").show();
            },
            500: function (result) {
                alert("500 ");
                console.log(result)
            },
            },
        });
    })
})
