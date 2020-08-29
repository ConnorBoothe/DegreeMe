function matchUrlToLi(url, li){
    var temp = url.split('/');
    var location = temp[temp.length-1];
    var query="";
    if(location.includes("?")){
      
      var temp1 = location.split("?");
      location = temp1[0];
    
  
    }
    
    li.each(function(){
      var item = $(this).children().attr('href').split('/');
      var removeSlash = item[item.length-1];
      if(location === removeSlash){
          $(this).css("color","grey");
         
        
        match = true;
      }
    })
    
     
  }

$(document).ready(function(){

    matchUrlToLi(window.location.href, $('.headerLinks'));
    
})