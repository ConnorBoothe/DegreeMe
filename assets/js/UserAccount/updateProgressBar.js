function updateProgressBar(liId){
    const changing = $(liId);
    if(changing[0] && changing.is(":visible")){
        const progressBar = $("#profileProgressBar")
        const valNow = parseInt(progressBar.attr("aria-valuenow"));
        const newVal = valNow + 20;//could be different values later
        if(newVal<100){
          progressBar.attr("aria-valuenow", newVal);
          progressBar.css("width",newVal + "%");
          progressBar.html(newVal + "%");
          $(liId).hide();  
        }else{
          $('#progressInfo').hide();
        }    
    }
}