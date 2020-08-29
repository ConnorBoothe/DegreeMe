// $(document).ready(function(){
//     $.ajax({
//         url: '/Users' ,
//         method: 'GET',
//         error:function(err,str){
//         }
//         }).done(function(res) {
//          $("#users").autocomplete({
//                 source: function(request, response) {
//                     var results = $.ui.autocomplete.filter(res, request.term);
//                     response(results.slice(0, 10));
//                 },
//             }).autocomplete( "widget" ).addClass( "addUserSearch" );
            
//     });
     
//     $(".deleteUser").on("click", function(){
//         alert($(this).text());
//     })

// });