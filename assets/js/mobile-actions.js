$(document).ready(function(){
    $(".mobile-actions ul li").on("click", function(){
        $(".mobile-actions ul li .mobile-actions-item").removeClass("bg-primary")
        $(this).children().eq(0).addClass("bg-primary");
        // $("#findATutorMobile-wrapper").show();
        if($(this).attr("class") == "findATutor") {
            $(".timeline-wrapper").html('<div class="recentActivity-title"> <svg class="" width="1em" height="1em"'+
            'viewBox="0 0 16 16" class="bi bi-search" fill="white"'+
            'xmlns="http://www.w3.org/2000/svg">'+
                        '<path fill-rule="evenodd"'+
                'd="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />'+
            '<path fill-rule="evenodd"'+
                'd="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />'+
        '</svg>'+

            '<span class="text-light"><input type="text" name="courseSearch" class="mobile-tutor-search" placeholder="Find Help"/></span></div>'+
            '<ul class="mobile-availability">'+
                            '<li class="mobile-available-text">Available</li>'+
                            '<li class="available-selected">Now</li>'+
                            '<li>Today</li>'+
                            '<li>This Week</li>'+
            '</ul>'
            
            );
        }
    })

    //mobile find tutor autocomplete
    $(".timeline-wrapper").on("keyup",".mobile-tutor-search", function(){
        alert("YO")
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
             console.log(result)
             if(result.type === "Courses"){
                 if((payload.searchVal === "")){
                     $(".resultsContainer").html("<p class='emptySearch'>Search Courses</p>");
                 }
                 else if(result.Courses.length > 0){
                    var courses = "";
                     for( x in result.Courses){
                         courses+= "<div class='courseCountainer'><a href='/course/"+result.Courses[x].CourseName+"'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                         result.Courses[x].CourseCode+"</p></a></div>";
                     }
                     $(".resultsContainer").html(courses);
                 }
                
                 else{
                     $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
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

})