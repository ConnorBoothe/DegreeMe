function populateAutocomplete(){
    $.getJSON( "./assets/js/uncc_courses.json", function( data ) {
        var courses = [];
        for( x in data.courses){
            var temp = data.courses[x].name.trim();
            if(temp != "University of North Carolina at Charlotte" && temp != "Choose Course Number"){
                if(temp.includes("-")){

                    var courseName = data.courses[x].name.split(/-(.+)/)[1];
                    
                    courses.push(courseName);
                }
              
            }
        }
        $( ".subject" ).autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(courses, request.term);
                response(results.slice(0, 15));
            }
        }).autocomplete( "widget" ).addClass( "hostSessionCourseSearch" );;
      })
}

$(document).ready(function(){
      populateAutocomplete();
})

