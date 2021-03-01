// //reserve seat in room on home page
// $(document).ready(function(){
//     $(".timeline").on("click", ".reserveSeat", function(){
//         var date = new Date($(".date-select").val());
//         var time = parseInt($(".time-text").text());
//         if($(".am-text").text() == "PM"){
//             time +=12;
//         }
//         date.setHours(time);
//         date.setMinutes(0);
//         date.setSeconds(0);
//         payload = {
//             hostHandle:$(this).prev().val(),
//             date:date,
//             course: $(".courseName-text").text(),
//             streamId: $(this).next().val(),
//             hostId:$(this).next().next().val()
//         }
//         $.ajax({
//             url: "/addMeetup",
//             type: 'POST',
//             data: JSON.stringify(payload),
//             headers: {
//               "Content-Type": "application/json"
//             }, statusCode: {
//               202: function (result) {
//                 $(".reserveSeat").text("Reserved")
//                 $(".reserveSeat").prop("disabled", "true")

//             },
//               500: function (result) {
//                 alert("500 " + result.responseJSON.err);
//               },
//             },
//           });
//         console.log(payload)
//     })
// })