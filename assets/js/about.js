function scrollToAnchor(name){
    var aTag = $("a[name='"+ name +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}
$(document).ready(function(){
    $('.scrollArrow').on('click', function(){
    scrollToAnchor('aboutScroll');
    })
});