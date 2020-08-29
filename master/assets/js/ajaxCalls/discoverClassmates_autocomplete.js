function filterMajorResults(res, searchValue){

    var majors = "";
    var count = 0;
    var majorList = [];
    for(x in res){
        majorList.push(res[x].Major)
    }
    
    var majorListSet = new Set(majorList);
    var majorList = [... majorListSet]
    if(searchValue.length === 0){
        return "";
    }
    else{
        for (x in majorList){
            if((majorList[x]).toLowerCase().includes(searchValue.toLowerCase())){
          
                if(count < 10){
                    majors+= "<a class='major-link' href='/discover?searchInput="+majorList[x]+"'><div class='major-results'><p>"+majorList[x]+ " "+
                    "</p></div></a>";
                    count++;
                }
            }
        }
       
      
            if(majors === ""){
                return "<p class='noMatch'>No matching results</p>"
            }
            
            else{
                return majors;
            }
        }
}
$(document).ready(function(){
    $("#searchInput").on("focus",function(){
        $(".input-container1Light").css({
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        
        })
        $(".major-autocomplete").show();
        $(".blocker").show();

    })
    $(".blocker").on("click", function(){
        
        $(".major-autocomplete").hide();
        $(".blocker").hide();
    })
    $.ajax({
        url: '/API/Majors' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) {
            
            $("#searchInput").on("keyup", function(){
               
                $(".major-autocomplete").html(filterMajorResults(res, $(this).val()));
            })
            
            
    });
});