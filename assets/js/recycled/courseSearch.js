// //aws websocket
// //var socket = io.connect('http://67.202.55.10:8000');
// //local websocket
// var socket = io.connect('http://127.0.0.1:4000');
// //fake
// function populateTutors(data){
//     var listings = "";
//     for (x in data.CourseData){
//         listings += "</h1>"+
//         "<div class='tutorBlock tutorBlockDark'>"+
//              "<ul class='tutorBlockHeader'>"+
//                  "<li><img src='../"+data.CourseData[x].Image+"' alt='Profile Pic' class='profile-pic' />"+
//                     " <h1 class='connectionName text-light'></h1>"+
//             "</li>"+
//              "<li class='starRating'>"+
//                 " <span>&#9733;</span>"+
//                 " <span>&#9733;</span>"+
//                 " <span>&#9733;</span>"+
//                 " <span>&#9733;</span>"+
//                 " <span>&#9733;</span>"+
                 
//            "  </li>"+
//            "<li>"+
//                  "<p class='hostName'>"+ data.CourseData[x].Name+"</p>"+
//            "</li>"+
//              "<li>"+
//                  "<p class='type badge badge-primary'></p>"+
//              "</li>"+
//         " </ul>"+
//          "<div class='tutorBlockBody'>"+
//          "<div class='infoItem text-light'>"+
//          "<div><img src='assets/img/MyFinancesDark.svg' class='iconImg dollarImg' />"+
//          "</div>"+
//          "<div>"+
//              "<p class='timeText'>"+data.CourseData[x].Type+"</p>"+
//          "</div>"+
//      "</div>"+
//              "<div class='infoItem text-light'>"+
//                  "<div><img src='assets/img/MyFinancesDark.svg' class='iconImg dollarImg' />"+
//                  "</div>"+
//                  "<div>"+
//                      "<p class='timeText'>"+data.CourseData[x].HourlyRate+"/hour</p>"+
//                  "</div>"+
//              "</div>"+
//          "<div class='infoItem text-light'><div><img src='assets/img/hourGlass.svg' class='iconImg dateImg'/></div><div><p class='timeText'>"+
//          data.CourseData[x].NumHours + " hour(s) duration</p>"+
//         " </div>"+
//     " </div>"+
//      "<div class='infoItem text-light'>"+
//          "<div><img src='assets/img/MySessionsDark.svg' class='iconImg' /></div>"+
//          "<div>"+
//              "<p class='timeText'>"+data.CourseData[x].Building+"</p>"+
//          "</div>"+
//      "</div>"+
//      "<div class='infoItem text-light'>"+
//          "<div><img src='assets/img/date.svg' class='iconImg dateImg' /></div>"+
//         " <div>"+
//              "<p class='timeText'>"+data.SessionCount[x]+" Sessions This Week</p>"+
//          "</div>"+
//     " </div>"+
//      "<div class='tutorButtons'>"+
//          "<a type='submit' class='btn btn-primary tutorBtn text-light'"+
//              "name=''"+
//              "href='/User/"+data.CourseData[x].Handle+"'>View Profile"+
//              "</a>"+
//          "<form method='POST' action='/connect'>"+
//              "<input name='type' type='hidden' value='Added' class='form-control'>"+
//             " <input name='from' type='hidden' value='My Connections'"+
//                  "class='form-control'>"+
//              "<input type='hidden' name='tutor' value='' />"+
//             " <input type='hidden' name='img' value='' />"+
//              "<input type='hidden' name='time' value='' />"+
//              "<input type='hidden' name='date' value='' />"+
//              "<input type='hidden' name='location' value='' />"+
//              "<input type='hidden' name='class' value='' />"+
//              "<a href='/Checkout?id="+data.CourseData[x]._id+"'"+
//                  "class='viewDetails btn btn-primary tutorBtn' name=''>View Listing</a>"+

//          "</form>"+
//      "</div>"+
// "</div>"+
// "<br>"+
// "</div>";

//     }
//     if( x === 1){
//         $(".tutorTotal").text(x + " Tutor Available");
//     }
//     else{
//         $(".tutorTotal").text(x + " Tutors Available");
//     }
    
//     return listings;
// }
// $(document).ready(function(){
    
//     window.onpopstate = function(popStateEvent){
//         console.log(popStateEvent.state)
//     }
//     $(".searchCourse").on("submit", function(e){
    
//         //send update course name to connections route
//         //socket.emit('update course', {course:$("#searchInput").val()});
        
//     })
//     //receive data about course from connection route
//     // socket.on("new course incoming", function(data){
        
//     //     history.pushState({foo:"bar"},"", "/Tutors/"+$("#searchInput").val().trim());
//     // $(".tutorBlock").remove();
    
//     // $("#course-container").html("<h1 class='resultSubject'>"+$("#searchInput").val().trim()+populateTutors(data));
    

// // })
// })