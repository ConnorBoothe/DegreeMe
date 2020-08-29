$(document).ready(function(){
   $(".searchType").on("click", function(){
       if($(this).attr("id") === "GroupLabel"){
          
           $("#GroupLabel").css("background-color","#007bff");
           $("#IndividualLabel").css("background-color","#2c2f33");
           $("#GroupLabel").css("color","white");
           $("#IndividualLabel").css("color","#a9a9a9");
       }
       else{
        $("#GroupLabel").css("background-color","#2c2f33");
        $("#IndividualLabel").css("background-color","#007bff");
        $("#GroupLabel").css("color","#a9a9a9");
        $("#IndividualLabel").css("color","white");
       }
   
   })
  $(".priceSlider").on("change", function(){
      $(".searchFilterPriceText").text("$"+$(this).val()+"/hr or less");
      
  })
})
