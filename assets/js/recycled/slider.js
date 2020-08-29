$(document).ready(function(){
  if($(".slider").val() == 1){
       
  }
  else {
   
  
  }
    var count = 0;
    $(".slider").on("click", function(){
      if($(this).val() == 1){
       
        
 
      }
      else if($(this).val() == 2){
       
      
       
      }
      count++;
     
    })
    var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}
})

