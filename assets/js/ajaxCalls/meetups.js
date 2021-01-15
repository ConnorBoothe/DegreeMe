function formatMeetupDate(date){
    var dateArray = new Date(date).toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
    for(var x = 0; x < monthArray.length; x++){
     
      if(monthArray[x].includes(dateArray[1])){
        month = monthArray[x];
      }
    }
    if( todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2] ){
      return "Today";
    }
    else if(month == ""){
      return "";
    }
    else{
      return  month + " " + dateArray[2];
    }
  }
  function formatMeetupTime(date){
    var date = new Date(date).toString().split(" ");
    var timeArray = date[4].split(":");
    var minutes = timeArray[1];
    var hours = timeArray[0];
    var amPm = "";
    if(hours === 12){
      hours =  hours ;
      amPm = "PM";
    }
    else if(hours === 24){
      hours =  hours%12;
      amPm = "AM";
    }
    else if(hours < 12){
      hours =  hours;
      amPm = "AM";
    }
    else{
      hours =  hours%12;
      amPm = "PM";
    }
    return hours + ":" + minutes + " " + amPm;
  }
  
  


function filterMeetupResults(res, type){
    var meetups = "";
    if(type === "Current"){
        for(var x = res.length-1; x>=0; x--){
          console.log(res[x]._id)
            if(new Date(res[x].date) > new Date()){
              meetups +=   '<tr class="myConnectionContainer">'+
              '<td class="text-light">'+res[x].role+'</td>'+
              '<td class="text-light">'+res[x].host+'</td>'+
              '<td class="text-light">'+formatMeetupDate(res[x].date)+'</td>'+
              '<td class="text-light">'+ res[x].duration+' hrs</td> </td>';
                meetups+='<td></td>';        

              meetups+=  '</tr>';          '</tr>';
            }
          }
    }
    else if (type === "Past"){
        for(var x = res.length-1; x>=0; x--){
            if(new Date(res[x].date) < new Date()){
              meetups +=   '<tr class="myConnectionContainer">'+
                '<td class="text-light">'+res[x].role+'</td>'+
                '<td class="text-light">'+res[x].host+'</td>'+
                '<td class="text-light">'+formatMeetupDate(res[x].date)+'</td>'+
                '<td class="text-light">'+ res[x].duration+' hrs</td> </td>';
                if(!res[x].LeftReview && res[x].role != "Host" ){
                  meetups+='<td><a href="/review/'+res[x].host+'?id='+res[x]._id+'" class="btn-primary">Leave a Review</button></td>';        
                }
                else{
                  meetups+='<td></td>';        

                }
                meetups+=  '</tr>';            }

        }
    }
    else{
        for(var x = res.length-1; x>=0; x--){
            meetups +=   '<tr class="myConnectionContainer">'+
                '<td class="text-light">'+res[x].role+'</td>'+
                '<td class="text-light">'+res[x].host+'</td>'+
                '<td class="text-light">'+formatMeetupDate(res[x].date)+'</td>'+
                '<td class="text-light">'+ res[x].duration+' hrs</td> </td>';
                if(!res[x].LeftReview && res[x].role != "Host" ){
                  meetups+='<td><a href="/review/'+res[x].host+'?id='+res[x]._id+'" class="btn-primary">Leave a Review</button></td>';        
                }
                else{
                  meetups+='<td></td>';        

                }
                meetups+=  '</tr>';
            }
        }
        if(meetups != ""){
          return meetups;
        }
        else{
          return "<h3 class='noMeetups'>No "+type+" meetups</h3>"
        }
                      
    }


$(document).ready(function(){
  $.ajax({
    url: '/API/Meetups' ,
    method: 'GET',
    error:function(err,str){
    }
    }).done(function(res) { 
      console.log(res)
      var results = filterMeetupResults(res, "Past");
      if(results.split(" ")[0] != "<h3"){
        $(".noMeetups").hide();
        $("#meetupsTable").show();
        $("tbody").html(filterMeetupResults(res, "Past"))
      }
      else{
        $("#meetupsTable").hide();
        $(".noMeetups").html(filterMeetupResults(res, type));
        $(".noMeetups").show();
      }
});
    $(".myConnectionOptions").on("click", function(){
        var type = $(this).text();
        $.ajax({
            url: '/API/Meetups' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) { 
              console.log(res)
              var results = filterMeetupResults(res, type);
              if(results.split(" ")[0] != "<h3"){
                $(".noMeetups").hide();
                $("#meetupsTable").show();
                $("tbody").html(filterMeetupResults(res, type))
              }
              else{
                $("#meetupsTable").hide();
                $(".noMeetups").html(filterMeetupResults(res, type));
                $(".noMeetups").show();
              }
        });
    })
   
})