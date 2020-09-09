$(document).ready(function(){

  function formatDate(date){
    var dateArray = date.toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
  
    for(var x = 0; x < monthArray.length; x++){
     
      if(monthArray[x].includes(dateArray[1])){
        month = monthArray[x];
      }
    }
    if( todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2] ){
      return "Published Today";
    }
    else if(month == ""){
      return "";
    }
    else{
      return "Published " + month + " " + dateArray[2];
    }
    
   
  }
    $.ajax({
        url: '/API/Discussion' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) { 

          
          var discussion = "";
          var handle = res.currHandle;
          for(var x = res.discussion.length-1; x>=0; x--){
            if(res.discussion[x].courseName === $(".courseName").text()){
             
              if(res.discussion[x].anonymous == true){
            
              discussion +=  '<div class="question">'+
              '<div class="question-container1">'+
              '<span class="discName">Anonymous</span>'+
              '<p class="dateText">'+formatDate(new Date(res.discussion[x].date))+"</p>"+
              '<p class="questionText">'+res.discussion[x].post+'</p>';
              if(parseInt(res.discussion[x].commentCount) === 1){
                discussion +=
              '<p><a class="responseLink" href="/course/'+res.discussion[x].courseName+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comment</a></p>';
              }
              else{
                discussion +=
                '<p><a class="responseLink" href="/course/'+res.discussion[x].courseName+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comments</a></p>';
                
              }             
              if(handle === res.discussion[x].userHandle){
              discussion+=
              '<form action="removeDiscussion" method="POST"  class="removeDiscussion">'+
              '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
              '<input type="hidden" name="discId" value="'+res.discussion[x]._id+'"/ >'+
              '<input type="hidden" name="course" value="'+res.discussion[x].courseName+'"/ >'+
              '</form>'+
              
            
            
              '</div>'
          '</div>';
        }
        else{
          discussion+=
              '</div>'
          '</div>';
        }
            }
            else if(res.discussion[x].anonymous === false){
              discussion +=  '<div class="question">'+
              '<div class="question-container1">'+
              '<a href="/user/'+res.discussion[x].userHandle+'">'+
              '<img class="discImg" src="../'+res.discussion[x].userImg+'"/>'+
              '<span class="discName">'+res.discussion[x].userHandle+'</span></a>'+
              '<p class="dateText">'+formatDate(new Date(res.discussion[x].date))+"</p>"+
              '<p class="questionText">'+res.discussion[x].post+'</p>';
              if(parseInt(res.discussion[x].commentCount) === 1){
                discussion +=
              '<p><a class="responseLink" href="/course/'+res.discussion[x].courseName+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comment</a></p>';
              }
              else{
                discussion +=
                '<p><a class="responseLink" href="/course/'+res.discussion[x].courseName+'?discussion='+res.discussion[x]._id+'">'+res.discussion[x].commentCount+' Comments</a></p>';
                
              }              
              if(handle === res.discussion[x].userHandle){
                discussion+=
                '<form action="removeDiscussion" method="POST" class="removeDiscussion">'+
                '<input type="submit" value="delete" class="btn btn-danger deleteDiscussion"/ >'+
                '<input type="hidden" name="discId" value="'+res.discussion[x]._id+'"/ >'+
                '<input type="hidden" name="course" value="'+res.discussion[x].courseName+'"/ >'+
               
                '</form>'+
              
             
             
              
              '</div>'
          '</div>';
              }
              else{
                discussion+=
                '</div>'
            '</div>';
              }
            }
          }
          
        }
          $(".discussion-container").html(discussion);
         
           
    });
})