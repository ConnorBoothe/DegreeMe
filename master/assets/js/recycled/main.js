// //functions
// function scrollToAnchor(name){
//     var aTag = $("a[name='"+ name +"']");
//     $('html,body').animate({scrollTop: aTag.offset().top},'slow');
// }

// //DOM manipulation
// $(document).ready(function(){

//   $(".heart").on("mouseover",function(){
    
//     $(this). attr("src", "assets/img/favorite1.svg")
//   })
//   $(".heart").on("mouseout",function(){
    
//     $(this). attr("src", "assets/img/favorite2.svg")
//   })
  
 
//   //make class list stick to the top on connections page
//   // $(window).on("scroll", function(){
//   //   var scroll = $(window).scrollTop();
//   //   if (scroll > 300){
//   //     $("#subjectNames").css("top","0");
//   //     $("#subjectNames").css("color","white");
//   //     $(".subjectItem").css("color","white");
//   //     $("#subjectNames").css("position","fixed");
//   //     $("#subjectNames").css("marginTop","40px");
//   //     $("#subjectNames").addClass("bg-danger");
//   //     $("#upArrow").show();
//   //   }
//   //   else {
//   //     $("#subjectNames").css("position","relative");
//   //     $("#subjectNames").removeClass("bg-danger");
//   //     $(".classLabel").removeClass("bg-light");
//   //     $(".classLabel").removeClass("text-danger");
//   //     $(".classLabel").css("background-color","");
//   //     $("#subjectNames").css("color","");
//   //     $(".subjectItem").css("color","#696969");
//   //     $("#upArrow").hide();
//   //   }
//   //   });
//     $("#upArrow").on("click",function(){
//       scrollToAnchor("top");
//     })
  
//   //create a slick slider for each subject
//   $('.your-class').each(function(item) {
//     $(this).slick({
//       prevArrow: $('.slick-prev').eq(item),
//       nextArrow: $('.slick-next').eq(item),
//       arrows: true,
//       slidesToShow:3
//     }); 
//   });
//   //display connection count beside My Connections header item
//   var count = 0;
//   $('.connectButton').on("click",function(){
//     count++;
//     $('#plusOne-badge').fadeIn();
//     $('#plusOne-badge').html(count)

//   });

//   //scroll to subject when clicked in subject menu
//   $(".subjectItem").on("click",function(){
//       scrollToAnchor(this.id);
//   });

//   //display sign in form when sign in button is clicked
//   $("#sign-in").on("click",function(){
//     if ($("#login-form").css("display") === "none"){
//       $("#login-form").fadeIn(500);
//       $("#overlay").fadeIn(500);
//     }
//     else {
//       $("#login-form").fadeOut(500);
//       $("#overlay").fadeOut(500);
//     }
//   });

//   //hide login form and overlay when x button is clicked
//   $("#login-form .x").on("click",function(){
//     $("#login-form").fadeOut(500);
//     $("#overlay").fadeOut(500);
//   });

  

//   //send user to correct page when search button is clicked
  

//   //tutor form manipulation
//   $(".timeLabel").on("click",function(){
//     $(".timeLabel").css("background-color", '#5cb85c');
//     $(this).css("background-color", '#f0ad4e');
//   });
 

  

 

//   //input container box shadow on focus
//   $("#searchInput").focus(function(){
//     $(".signup-icon").attr("src","assets/img/search.svg");
//     $(".input-container1").css({"border":"1px solid #343a40"});
    
//   })
//   $(".input-container1").focusout(function(){
//     $(".signup-icon").attr("src","assets/img/search.svg.svg");
//     $(this).css({"box-shadow":" none", "border":"1px solid #a9a9a9"});

//   })
//   $('.popover_courses').on('click', function () {

//     // $('.animated-icon3').toggleClass('leftSideBar');
//   });
// });