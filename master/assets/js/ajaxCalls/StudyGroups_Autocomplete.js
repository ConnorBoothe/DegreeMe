function filterResultsStudyGroups(res, searchValue){
    var count = 0;
    var studyGroups = "";
    if(searchValue.length === 0){
       $(".resultsContainer").html("<p class='emptySearch'>Search Study Groups</p>");
    }
    else{
            $(".emptySearch").text("Search Courses")
            var count = 0;
            for( x in res.StudyGroups){
                if(count < 10){
                if(res.StudyGroups[x].Subject.toLowerCase().includes(searchValue.toLowerCase())){
                        studyGroups+= "<div class='courseCountainer'><a href='/Group/"+res.StudyGroups[x]._id+"'><p class='courseName'>"+res.StudyGroups[x].GroupName+"</p>"+
                        "<p class='studyGroupSubject'>"+res.StudyGroups[x].Subject+"</p></a></div>";
                    }
                    count++;
                }
            }
            if(studyGroups === ""){
                return "<p class='noMatch'>No matching Results</p>";
            }
            else if(searchValue == ""){
                return "";
            }
            else{
                return studyGroups;
            }
            
        }
    }
$(document).ready(function(){
 
    $("#searchInput").on("focus",function(){
        $(".blocker").show();
        $(".studyGroup-search-container").show();
        $(".input-container2Light").css({
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
        
        })
    })
    $(".blocker").on("click", function(){
        $(".input-container2Light").css({
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
        
        })
        $(".blocker").hide();
        $(".studyGroup-search-container").hide();
    })
    $("input[name= 'searchType']").on("click", function(){
        $("input[name= 'searchType']").prev().removeClass("searchMenuUnderLine");
        $(this).prev().addClass("searchMenuUnderLine");
    })
    if(window.location.href.toString().split("/")[3] === "StudyGroups_New"){
        $("#searchInput").attr("placeholder", "Search Groups");
    }
    $("#searchInput").on("keyup", function(){
    payload = {
        searchValue:$(".main-search-input").val(),
        type:"Groups" 
     }
     $.ajax({
         url: "/siteWideSearch",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
         "Content-Type": "application/json"
         }, statusCode: {
         202: function (result) {
                 var groups = "";
                 if(($("#searchInput").val() === "")){
                     $(".groups-autocomplete-status").html("<p class='emptySearch'>Search Groups</p>");
                 }
                 else if(result.Groups.length > 0){
                     for( x in result.Groups){
                         groups+= "<div class='courseCountainer'><a href='/Group/"+result.Groups[x]._id+"'><p class='courseName'>"+result.Groups[x].GroupName+"</p>"+
                         "<p class='studyGroupSubject'>"+result.Groups[x].Subject+"</p></a></div>";
                     }

                     $(".groups-autocomplete-status").html(groups);
                 }
                 else{
                     $(".groups-autocomplete-status").html("<p class='noMatch'>No matching Results</p>");
                 }
         },
         500: function (result) {
             alert("500 ");
             console.log(result)
         },
         },
     });
    });
});