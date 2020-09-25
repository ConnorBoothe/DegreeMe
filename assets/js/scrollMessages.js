function scrollToAnchor(name){
    
    var aTag = $("a[name='"+ name +"']");
    $('html,body').animate({scrollTop: $(document).height() +2000},'fast');
}
$(document).ready(function(){
    scrollToAnchor('bottom');
})