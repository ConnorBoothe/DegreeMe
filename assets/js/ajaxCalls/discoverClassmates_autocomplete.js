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
function filterMajorSettings(res, searchValue){

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
                    majors+= "<div class='major-results major-results-settings'><p>"+majorList[x]+ " "+
                    "</p></div>";
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
        $(".input-container1Light-settings").css({
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        
        })
        $(".major-autocomplete").show();
        $(".major-autocomplete-settings").show();
        $(".blocker").show();

    })
    $(".blocker").on("click", function(){
        
        $(".major-autocomplete").hide();
        $(".major-autocomplete-settings").hide();
        $(".blocker").hide();
        $(".input-container1Light").css({
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
        
        })
        $(".input-container1Light-settings").css({
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
        
        })
    })
    $.ajax({
        url: '/API/Majors' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) {
            
            $("#searchInput").on("keyup", function(){
               if(window.location.href.toString().split("/")[3].includes("Settings")){
                $(".major-autocomplete-settings").html(filterMajorSettings(res, $(this).val()));
               }
               else{
                $(".major-autocomplete").html(filterMajorResults(res, $(this).val()));
               }
               
            })
            
            
    });

    //select major on settings page
    $(".major-autocomplete-settings").on("click", ".major-results-settings", function(){
        $("#searchInput").val($(this).text())
        $(".blocker").hide();
        $(".major-autocomplete-settings").hide();
        $(".input-container1Light-settings").css({
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
        
        })
    })
});