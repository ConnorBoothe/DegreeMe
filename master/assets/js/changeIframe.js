$(document).ready(function(){
    $('#iframeId').hide();

    $(".scheduleMeeting").on("click", function(){
        $('#iframeId').show();
    })
    $('#iframeId').load(function(){
        alert("loaded")
        $('#iframeId').contents().find('.pull-left').text();
        
    });
})