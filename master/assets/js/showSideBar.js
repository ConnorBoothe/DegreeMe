$(document).ready(function(){
    $(".showCoursesButton").on("click", function(){
        if( $(".sideBarMyCourses").css("display") === "none"){
            $(".rightArrowImg").attr("src","assets/img/rightArrowLight.svg")
            $(".sideBarMyCourses").show();
        }
        else{
            $(".rightArrowImg").attr("src","assets/img/leftArrow.svg")
            $(".sideBarMyCourses").hide();
        }
        
    });
    $(".showFilterButton").on("click", function(){
        if( $(".sideBarSearchFilter").css("display") === "none"){
          
            $(".rightArrowImg1").attr("src","assets/img/leftArrow.svg")
            $(".sideBarSearchFilter").show();
        }
        else{
            $(".rightArrowImg1").attr("src","assets/img/rightArrowLight.svg");
            
            
            $(".sideBarSearchFilter").hide();
        }
        
    });
})