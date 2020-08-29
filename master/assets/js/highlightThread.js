function highlhightThread(selectors){
   
    var x = 0;
    selectors.each(function(){
        
        var selectArr = selectors.eq(x).attr("href").split("?");
        var selectorId = selectArr[1];
        var location = window.location.href;
        var locationArr = location.split("?");
        var locationId = locationArr[1];
       
        if(selectorId === locationId){
            $(this).children().eq(0).css("background-color","#151515");
            
        }
        x++;
    })
}

$(document).ready(function(){
    highlhightThread($(".messageSideBarContainer a"));
})