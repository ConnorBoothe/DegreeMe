// function populateAutocomplete(){
//     $.getJSON( "./assets/js/uncc_courses.json", function( data ) {
//         var courses = [];
//         for( x in data.courses){
//             var temp = data.courses[x].name.trim();
//             if(temp != "University of North Carolina at Charlotte" && temp != "Choose Course Number"){
//                 if(temp.includes("-")){
//                     var courseName = data.courses[x].name.split(/-(.+)/)[1];
//                     courses.push(courseName);
//                 }
//             }
//         }
//         $( "#searchInput" ).autocomplete({
//             source: function(request, response){
//                 var results = $.ui.autocomplete.filter(courses, request.term);
//                 response(results.slice(0, 10));
//             },
//             position: {
//                 offset: '130 0' // Shift 10px left, 0px down.
//             }
//       }).autocomplete( "widget" ).addClass( "courseSearch" );
// });
// }
// $(document).ready(function(){
   
//       populateAutocomplete();
//       $(".searchBtn").eq(1).on("click",function(e){
//           e.preventDefault();
//           location.href = '/Connect?course='+$(this).prev().val();
//       })
    
// })

