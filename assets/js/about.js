function scrollToAnchor(name){
    var aTag = $("a[name='"+ name +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}
$(document).ready(function(){
    $('.scrollArrow').on('click', function(){
    scrollToAnchor('aboutScroll');
    })

    $('.scrollArrow').on('mouseover', function(){
        $(this).animate({marginTop:'5px'})
        })
    $('.scrollArrow').on('mouseleave', function(){
        $(this).delay(100).animate({marginTop:'0px'})
        })
});