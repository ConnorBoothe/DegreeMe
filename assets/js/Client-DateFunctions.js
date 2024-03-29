function displayDate(date){
  
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
      return "Today";
    }
    else if(month == ""){
      return "";
    }
    else{
      return  month + " " + dateArray[2];
    }
  }
  function displayDateWithoutToday(date){
  
    var dateArray = date.toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
    for(var x = 0; x < monthArray.length; x++){
      if(monthArray[x].includes(dateArray[1])){
        month = monthArray[x];
      }
    }
    if(month == ""){
      return "";
    }
    else{
      if(dateArray[2].split("")[0] == "0"){
        return  month + " " + dateArray[2].split("")[1];

      }
      else{
        return  month + " " + dateArray[2];

      }
    }
  }
  function displayTime(date){
  
    var dateArray = date.toString().split(" ");
    var hour = dateArray[4].split(":")[0];
    var min = dateArray[4].split(":")[1];
    if(hour >= 12){
      if(hour == 12){
        return "12:"+ min+" PM";
      }
      else {
        return (parseInt(hour)%12) + ":" + min+ " PM";
      }
    }
    else{
        if(hour.split("")[0] == "0"){
          return hour.split("")[1]+ ":"+ min+ " AM";
        }
        else{
          return hour + ":" + min+ " AM";
        }
    }

  }
  function displayTimeSince(date) {
    var difference = Math.abs(new Date() - (new Date(date)));
    var secDifference = parseInt(difference / 1000);
    var minDifference = parseInt(secDifference / 60);
    var hourDifference = parseInt(minDifference / 60);
    var dayDifference = parseInt(hourDifference / 24);
    if(secDifference < 60){
        return secDifference + " sec";
    }
    else if(secDifference < 120){
        return minDifference + " min";
    }
    else if(secDifference > 60 && minDifference < 60){
        return minDifference + " min";
    }
    else if(minDifference < 120){
        return hourDifference + " hour";
    }
    else if(minDifference > 120 && hourDifference < 24){
        return hourDifference + " hours";
    }
    else if(hourDifference < 48){
        return dayDifference + " day";
    }
    else{
        return dayDifference + " days";
    }
  }
