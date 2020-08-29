function highlightSelectedQuestion(index){
    $(".quiz .answerChoices"+index+" label").on("click",function(){
            
        $(".answerChoices"+index+" label").css({"border": "2px solid #a3a3a3"});
        
        $(this).css({"border":"2px solid #007bff",backgroundColor:" #007bff"})
  

 
})
}

$(document).ready(function(){

    var index = 0;
    $('.quiz').each(function(){
        highlightSelectedQuestion(index);
        index++;
    })
   
         
        
    
});