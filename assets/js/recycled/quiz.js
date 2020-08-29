


function getQuestionNum(selector){
   var arr = selector.split('');
   return parseInt(arr[arr.length-1]) +1;
}

function scrollToAnchor(name){
    var aTag = $("a[name='"+ name +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'slow');
}


$(document).ready(function(){
$('.question label').on("click",function(){
    var questionNum = getQuestionNum($(this).parent().attr('class'));
    $('.questionNumHeader').each(function(){
        if(parseInt($(this).attr("id")) === questionNum){
            $(this).removeClass("bg-primary");
            $(this).addClass("bg-success");
           
        }
    })
    
    $('.quizNumber').each(function(){
        var quizNum  = getQuestionNum($(this).attr('id'));
        if(questionNum === quizNum){
            $(this).removeClass("bg-primary");
            $(this).addClass("bg-success");
           
        }
    })
    
})
$('.questionNumHeader').on("click",function(){

    scrollToAnchor($(this).attr("id"));
})


$(window).on("scroll", function(){
     var scroll = $(window).scrollTop();
     if (scroll > 100){
         $('.questionHeader').css("position","fixed");
     }
    
});


})

