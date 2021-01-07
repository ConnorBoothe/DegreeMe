var timeoutID;
var timeInterval = 5000;
var active = true;
function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);
    startTimer();
}
setup();
 
function startTimer() {
    //set timeout for 5 minutes. After 5 minutes of inactivity, call 
    //goInactive function
    timeoutID = window.setTimeout(goInactive, timeInterval);
}
 
function resetTimer(e) {
    //clear the timeout and set user status to active
    window.clearTimeout(timeoutID);
    // if inactive, set to active
    if(!active){
        goActive();
    }
}
 
function goInactive() {
      payload = {
        status: false
    }
    $.ajax({
        url: "/toggleActive",
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
 
function goActive() {
    // do something
    payload = {
        status: true
    }
    $.ajax({
        url: "/toggleActive",
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
    startTimer();
}