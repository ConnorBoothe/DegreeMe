$(document).ready(function(){
    $('.timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '0',
        maxTime: '11:59pm',
        defaultTime: '8',
       
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });


});

