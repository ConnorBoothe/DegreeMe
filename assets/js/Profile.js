function populateTutors(data){
    var sessions = "";

    for (x in data.sessions){
        
        sessions += "</h1>"+
        "<div class='tutorBlock tutorBlockDark'>"+
             "<ul class='tutorBlockHeader'>"+
                 "<li><img src='"+data.sessions[x].Image+"' alt='Profile Pic' class='profile-pic' />"+
                    " <h1 class='connectionName text-light'></h1>"+
            "</li>"+
             "<li class='starRating'>"+
             '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
             '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
             '</svg></span>'+

       '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
             '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
             '</svg></span>'+

       '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
             '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
             '</svg></span>'+

       '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
             '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
             '</svg></span>'+

       '<span><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
             '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'+
             '</svg></span>'+
                 
           "  </li>"+
           "<li>"+
                 "<p class='hostName'>"+ data.sessions[x].Name+"</p>"+
           "</li>"+
             "<li>"+
                 "<p class='type badge badge-primary'></p>"+
             "</li>"+
        " </ul>"+
         "<div class='tutorBlockBody'>"+
         "<div class='infoItem text-light'>"+
         "<div><img src='assets/img/date.svg' class='iconImg dateImg' /></div>"+
        " <div>"+
        "<p class='timeText'>"+data.sessions[x].Subject+"</p>"+
         "</div>"+
    " </div>"+
         "<div class='infoItem text-light'>"+
         "<div><img src='assets/img/MyFinancesDark.svg' class='iconImg dollarImg' />"+
         "</div>"+
         "<div>"+
             "<p class='timeText'>"+data.sessions[x].Type+"</p>"+
         "</div>"+
     "</div>"+
             
         "<div class='infoItem text-light'><div><img src='assets/img/hourGlass.svg' class='iconImg dateImg'/></div><div><p class='timeText'>"+
         data.sessions[x].NumHours + " hour(s) duration</p>"+
        " </div>"+
    " </div>"+
   
     "<div class='tutorButtons'>"+
         "<a class='btn btn-primary tutorBtn text-light'"+
             "name=''"+
             "href='/Tutor?handle="+data.sessions[x].Handle+"'>View Profile"+
             "</a>"+
         "<form method='POST' action='/connect'>"+
             "<input name='type' type='hidden' value='Added' class='form-control'>"+
            " <input name='from' type='hidden' value='My Connections'"+
                 "class='form-control'>"+
             "<input type='hidden' name='tutor' value='' />"+
            " <input type='hidden' name='img' value='' />"+
             "<input type='hidden' name='time' value='' />"+
             "<input type='hidden' name='date' value='' />"+
             "<input type='hidden' name='location' value='' />"+
             "<input type='hidden' name='class' value='' />"+
             "<a href='/Checkout?id="+data.sessions[x]._id+"'"+
                 "class='viewDetails btn btn-primary tutorBtn' name=''>View Listing</a>"+

         "</form>"+
     "</div>"+
"</div>"+
"<br>"+
"</div>";

    }
    
    return sessions;
}

function populateReviews(data){
    var reviews  = "";
    
    for(var x = 0; x <data.reviews.length; x++){
        reviews += '<div class="reviewDisplay-container">'+
            '<div class="reviewDisplay-top">'+
                '<h1 class=" reviewName">'+data.reviews[x].SenderHandle+'<span class="course badge badge-primary">'+data.reviews[x].Course+'</span><i></i>'+
                                        
                '</h1>'+
                '<span class="stars">'+ 
                    '<span>&#9733;</span>'+          
                '</span>'+
                '<h2 class="text-light course"></h2>'+
            '</div>'+
            '<div class="reviewDisplay-bottom">'+
                '<h2 class="reviewBody">'+data.reviews[x].Message+'</h2>'+
            '</div>  '+  
        '</div>';

    }
    return reviews;               
}
$(document).ready(function(){
   $(".profile-ul li").on("click",function(){
    $(".profile-ul li").css("border-bottom", "none");
       $(this).css("border-bottom", "2px solid #007bff");
       if($(this).text() === "Courses"){
        payload = {
            handle:$("input[name='handle']").val(),
        }
        $.ajax({
            url: "/getCourses",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                    
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
       }
       else if($(this).text() === "Tutoring"){
        
       }
       else if($(this).text() === "Reviews"){
        
       }
   })
   socket.on("sending courses",function(data){
      
       var courses = '';
       for(var i = 0; i < data.courses.length; i++){
        
        courses += ("<li 'courseItem'>"+data.courses[i].courseName+"</li>");
       }
       $(".profile-item-list").html(courses);
   });
   socket.on("sending tutoring sessions",function(data){
    $(".profile-item-list").html(populateTutors(data));
});
socket.on("sending reviews",function(data){
    $(".profile-item-list").html(populateReviews(data));
});

})