module.exports = class DateFunctions {

  displayTimeSince(date) {
    var difference = Math.abs(new Date() - (new Date(date)));
    var secDifference = parseInt(difference / 1000);
    var minDifference = parseInt(secDifference / 60);
    var hourDifference = parseInt(minDifference / 60);
    var dayDifference = parseInt(hourDifference / 24);
    if(secDifference < 60){
        return secDifference + " seconds ago";
    }
    else if(secDifference < 120){
        return minDifference + " minute ago";
    }
    else if(secDifference > 60 && minDifference < 60){
        return minDifference + " minutes ago";
    }
    else if(minDifference < 120){
        return hourDifference + " hour ago";
    }
    else if(minDifference > 120 && hourDifference < 24){
        return hourDifference + " hours ago";
    }
    else if(hourDifference < 48){
        return dayDifference + " day ago";
    }
    else{
        return dayDifference + " days ago";
    }
  }
  displayDate(date) {
    var dateArray = date.toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";
    for (var x = 0; x < monthArray.length; x++) {
      if (monthArray[x].includes(dateArray[1])) {
        month = monthArray[x];
      }
    }
    if (todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2]) {
      return "Today";
    } else if (month == "") {
      return "";
    } else {
    if(dateArray[2].split("")[0] == "0"){
      return month + " " +dateArray[2].split("")[1];
    }
    else{
      return month + " " + dateArray[2];
    }
    }
  }
  //takes date object as parameter
  formatTimeFromDate(date) {
    var date = date.toString().split(" ");
    
    var timeArray = date[4].split(":");
    var minutes = timeArray[1];
    var hours = timeArray[0];
    var intHours = parseInt(hours)
    var amPm = "";
    if (intHours === 12) {
      hours = 12;
      amPm = "PM";
    } else if (intHours === 0) {
      hours = 12;
      amPm = "AM";
    } else if (intHours < 12) {
    if(intHours<10){
        var splitHours = hours.split("");
        hours = splitHours[1];
      }
      hours = hours;
      amPm = "AM";
    } else {
      hours = hours % 12;
      amPm = "PM";
    }
    return hours + ":" + minutes + " " + amPm;
  }
  //takes miliary time as parameter
  formatTime(time){
    var timeArray = time.split(":");
    var minutes = timeArray[1];
    var hours = parseInt(timeArray[0]);
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
  formatMessageCreatedDate(date) {
    var dateArray = date.toString().split(" ");
    var todayArray = new Date().toString().split(" ");
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var month = "";

    for (var x = 0; x < monthArray.length; x++) {

      if (monthArray[x].includes(dateArray[1])) {
        month = monthArray[x];
      }
    }
    if (todayArray[1] == dateArray[1] & todayArray[2] == dateArray[2]) {
      return " started the conversation today";
    } else if (month == "") {
      return "";
    } else {
      return " started the conversation " + month + " " + dateArray[2];
    }

  }
  

}