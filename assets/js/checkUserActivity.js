var timeoutID;
var timeInterval = 1000 * 60 * 2.5;//1000miliSec in a sec * 60 sec in a min * 2.5 min
var active = true;
startTimer();
 
function startTimer() {
    //set timeout for 2.5 minutes; after 2.5 minutes of inactivity, call 
    //resetTimer function to keep cycle going
    timeoutID = window.setTimeout(resetTimer, timeInterval);
}
 
function resetTimer(e) {
  pingServer();//ping server to current time
  window.clearTimeout(timeoutID);//clear the timeout
  timeoutID = window.setTimeout(resetTimer, timeInterval);
}
 
function pingServer() {
      payload = {    }
    $.ajax({
        url: "/setActiveTimestamp",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
            //   window.location.href = "/messages?messageId="+ result.messageId
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
}