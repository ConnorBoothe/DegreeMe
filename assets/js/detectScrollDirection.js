$(document).ready(function(){
    // Initial state
var scrollPos = 0;
var prevScrollPos = 0;
$.session.set("showMenu")
// adding scroll event
if(window.innerWidth < 1000){
  window.addEventListener('scroll', function(){
    // detects new state and compares it with the new one
    if(Math.abs(prevScrollPos - scrollPos) > 25 ){
      if ((document.body.getBoundingClientRect()).top <  scrollPos){
          $(".mobileMenu").hide();
        }
          else{
              $(".mobileMenu").show();
          }
    }
      // saves the new position for iteration.
      prevScrollPos = scrollPos;
    scrollPos = (document.body.getBoundingClientRect()).top;
  });window.addEventListener('scroll', function(){
  // detects new state and compares it with the new one
  if(Math.abs(prevScrollPos - scrollPos) > 25 ){
    if ((document.body.getBoundingClientRect()).top <  scrollPos){
        $(".mobileMenu").hide();
      }
        else{
            $(".mobileMenu").show();
        }
  }
    // saves the new position for iteration.
    prevScrollPos = scrollPos;
	scrollPos = (document.body.getBoundingClientRect()).top;
});
}

})