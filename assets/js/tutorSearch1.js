
// function populateAutcomplete(){
//   alert("yo")
//   $.getJSON( "./assets/js/uncc_courses.json", function( data ) {
//     alert("yo")
//     var handles = [];
    
//     for(x in data.userHandles){
//         var temp = data.userHandles[x].handle.trim();                
//         handles.push(temp);    
//     }
  
//     // $("#searchInput1").autocomplete({
//     //     source: function(request, response) {
//     //         var results = $.ui.autocomplete.filter(handles, request.term);
//     //         response(results.slice(0, 15));
//     //     }
//     // });
//   }).fail(function(d) {
//     console.log("error");
// });
// }

$(document).ready(function(){
    $.getJSON( "./assets/js/UserDB.json", function( data ) {
  
      var handles = [];
  
      for(x in data.userHandles){
          var temp = data.userHandles[x].handle.trim();         
          alert(temp)       
          handles.push(temp);    
      }
  
      $("#searchInput1").autocomplete({
          source: function(request, response) {
              var results = $.ui.autocomplete.filter(handles, request.term);
              response(results.slice(0, 15));
          }
      });
    })
   
  
  });
  
  