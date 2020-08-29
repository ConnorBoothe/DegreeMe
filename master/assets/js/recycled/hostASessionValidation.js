// $(document).ready(function(){


//     $(".createSession").on("submit", function(){
//         alert("submit")
//         //$(".themeTxt").text($("input[name='type").val());
//         if($("input[name='type").val() === '1'){
//             $('.groupSesh').show();
//             $(".themeTxt").text("Group");
//             $("#createListing").on("click",function(e){
//                 if($("#subject").val() === ""){
//                     e.preventDefault();
//                     $('#subject').parent().css("border","1px solid #dc3545");
//                     $('#subject').attr("placeholder", "No Course Selected");
//                 }
//                 if(parseInt($("#hourlyRate").val())  < 5){
//                     alert("ERR")
//                     e.preventDefault();
//                     $('#hourlyRate').parent().css("border","1px solid #dc3545");
//                     $('#hourlyRate').attr("placeholder", "No Rate Entered");
//                 }
//                 if(parseInt($("#duration").val() < 1)){
//                     alert("ERR")
//                     e.preventDefault();
//                     $('#duration').parent().css("border","1px solid #dc3545");
//                     $('#duration').attr("placeholder", "No Duration Entered");
//                 }
//                 if(parseInt($("#minStudents").val() < 1)){
//                     e.preventDefault();
//                     $('#minStudents').parent().css("border","1px solid #dc3545");
//                     $('#minStudents').attr("placeholder", "Nothing entered");
//                 }
//                 if($("#maxStudents").val() === ""){
//                     e.preventDefault();
//                     $('#maxStudents').parent().css("border","1px solid #dc3545");
//                     $('#maxStudents').attr("placeholder", "Nothing entered");
//                 }
//                 if($("#datepicker").val() === ""){
//                     e.preventDefault();
//                     $('#datepicker').parent().css("border","1px solid #dc3545");
//                     $('#datepicker').attr("placeholder", "No Date Selected");
//                 }
//                 if($("#time").val() === ""){
//                     e.preventDefault();
//                     $('#time').parent().css("border","1px solid #dc3545");
//                     $('#time').attr("placeholder", "No Time Selected");
//                 }
//                 if($("#building").val() === ""){
//                     e.preventDefault();
//                     $('#building').parent().css("border","1px solid #dc3545");
//                     $('#building').attr("placeholder", "Nothing Building Entered");
//                 }
//                 if($("#room").val() === ""){
//                     e.preventDefault();
//                     $('#room').parent().css("border","1px solid #dc3545");
//                     $('#room').attr("placeholder", "No Room Entered");
//                 }
//                 if($(".gradeText").text() === ""){
//                     e.preventDefault();
                 
//                     $(".gradeError").text("Select Grade");
//                     $(".gradeText").css("font-size","14px");
//                 }   
//             })
//         }
//         else if($("input[name='type").val() === '2') {
//             $('.groupSesh').hide();
//             $(".themeTxt").text("Individual");
//             $("#createListing").on("click",function(e){
//                 if($("#subject").val() === ""){
//                     e.preventDefault();
//                     $('#subject').parent().css("border","1px solid #dc3545");
//                     $('#subject').attr("placeholder", "No Course Selected");
//                 }
//                 if($("#hourlyRate").val() === ""){
//                     e.preventDefault();
//                     $('#hourlyRate').parent().css("border","1px solid #dc3545");
//                     $('#hourlyRate').attr("placeholder", "No Rate Entered");
//                 }
//                 if($("#duration").val() === ""){
//                     e.preventDefault();
//                     $('#duration').parent().css("border","1px solid #dc3545");
//                     $('#duration').attr("placeholder", "No Duration Entered");
//                 }
               
//                 if($("#datepicker").val() === ""){
//                     e.preventDefault();
//                     $('#datepicker').parent().css("border","1px solid #dc3545");
//                     $('#datepicker').attr("placeholder", "No Date Selected");
//                 }
//                 if($("#time").val() === ""){
//                     e.preventDefault();
//                     $('#time').parent().css("border","1px solid #dc3545");
//                     $('#time').attr("placeholder", "No Time Selected");
//                 }
//                 if($("#building").val() === ""){
//                     e.preventDefault();
//                     $('#building').parent().css("border","1px solid #dc3545");
//                     $('#building').attr("placeholder", "Nothing Building Entered");
//                 }
//                 if($("#room").val() === ""){
//                     e.preventDefault();
//                     $('#room').parent().css("border","1px solid #dc3545");
//                     $('#room').attr("placeholder", "No Room Entered");
//                 }
//                 if($(".gradeText").text() === ""){
//                     e.preventDefault();
                 
//                     $(".gradeError").text("Select Grade");
//                     $(".gradeText").css("font-size","14px");
//                 }   
//             })
            
//         }
//     })
    
// });