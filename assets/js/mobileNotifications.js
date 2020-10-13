$(document).ready(function(){
    $(".mobileMenu ul li div").eq(0).css("color", "white")
    $(".mobileMenu ul li div").on("click", function(){
        $(".mobileMenu ul li div").css("color","#a9a9a9");
        $(this).css("color", "white");
    })
})