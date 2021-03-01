function changeDisplay(b) {
    var current;//undefined->all, true->current, false->past
    switch (b.id.valueOf()) {
        
        case 'meetupsCurrent'.valueOf():
            $(b).addClass('badge badge-primary');
            $('#meetupsAll').removeClass('badge badge-primary');
            $('#meetupsPast').removeClass('badge badge-primary')
            current = true;
            break;
        case 'meetupsPast'.valueOf():
            $(b).addClass('badge badge-primary');
            $('#meetupsAll').removeClass('badge badge-primary');
            $('#meetupsCurrent').removeClass('badge badge-primary')
            current = false;
            break;
        default:
    }
}
$(document).ready(function(){
$(".myConnectionOptionList li").on("click", function(){
    $(".myConnectionOptions").removeClass("badge badge-primary");
    $(this).addClass("badge badge-primary")
})


})