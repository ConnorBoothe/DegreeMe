
// // function populateAutcomplete(){
// //   alert("yo")
// //   $.getJSON( "./assets/js/uncc_courses.json", function( data ) {
// //     alert("yo")
// //     var handles = [];
    
// //     for(x in data.userHandles){
// //         var temp = data.userHandles[x].handle.trim();                
// //         handles.push(temp);    
// //     }
  
// //     // $("#searchInput1").autocomplete({
// //     //     source: function(request, response) {
// //     //         var results = $.ui.autocomplete.filter(handles, request.term);
// //     //         response(results.slice(0, 15));
// //     //     }
// //     // });
// //   }).fail(function(d) {
// //     console.log("error");
// // });
// // }

// $(document).ready(function(){
//   $.ajax({
//     url: '/Tutors' ,
//     method: 'GET',
//     error:function(err,str){
//     }
//     }).done(function(res) {
//      $("#searchInput1").autocomplete({
//             source: function(request, response) {
//                 var results = $.ui.autocomplete.filter(res, request.term);
//                 response(results.slice(0, 10));
//             },
//         }).autocomplete( "widget" ).addClass( "tutorSearch" );
        
// });
  
//     $("#searchInput").focus(function(e){
//         //$(this).parent().css({"border":"1px solid white"});
     
//     });
//     $("#searchInput").focusout(function(e){
//         $(this).parent().css({"border":"1px solid #2c2f33"});
     
//     });
//     $("#searchInput1").focus(function(e){
//        // $(this).parent().css({"border":"1px solid"});
     
//     });
//     $("#searchInput1").focusout(function(e){
//         $(this).parent().css({"border":"1px solid #343a40"});
     
//     });

//      //prevent tutor search if field is empty
//      $(".searchBtn").on("click", function(e){
//       if($("#searchInput1").val() === ""){
//           //e.preventDefault();
//       }
        
//     })
    
// });

