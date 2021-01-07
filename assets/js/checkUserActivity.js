var timeoutID;
var tenMinutes = 5000;
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
    // wait 10 min before calling goInactive
    timeoutID = window.setTimeout(goInactive, tenMinutes);
}
 
function resetTimer(e) {
    window.clearTimeout(timeoutID);
    // if inactive, set to active
    if(!active){
        goActive();
    }
}
 
function goInactive() {
     active = false;
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
    active = true;
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