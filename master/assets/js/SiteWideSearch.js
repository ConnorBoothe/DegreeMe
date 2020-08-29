$(document).ready(function(){

    $.session.set("type", "Users");
    $(".searchForm").on("submit", function(e){
        e.preventDefault();
    })
    var users = "";
    $(".main-search-input").on("focus",function(){
        $(".siteWideSearchContainer").show();
        $(".blocker").show();
    })
    $(".blocker").on("click", function(){
        $(".siteWideSearchContainer").hide();
        $("#showNotifications").hide();
        $(".blocker").hide();
        $(".main-search-input").attr("placeholder", "Search");
    })
    $("input[name= 'searchType']").on("click", function(){
        $("input[name= 'searchType']").prev().removeClass("searchMenuUnderLine");
        $(this).prev().addClass("searchMenuUnderLine");
    })
    if(window.location.href.toString().split("/")[3] === "StudyGroups_New"){
        $(".main-search-input").attr("placeholder", "Search Study Groups");
    }
    $(".searchTab").next().on("click", function(){
        var type = $(this).val();
        $(".main-search-input").val("");
        if(type == "Users"){
            $(".resultsContainer").html("<p class='emptySearch'>Search Users</p>");
            $(".main-search-input").html("");
        }
        else if(type =="Courses"){
            $(".resultsContainer").html("<p class='emptySearch'>Search Courses</p>");
            $(".main-search-input").html("");
        }
        else if(type =="Tutors"){
            $(".resultsContainer").html("<p class='emptySearch'>Search Tutors</p>");
            $(".main-search-input").html("");
        }
        else if(type =="Groups"){
            $(".resultsContainer").html("<p class='emptySearch'>Search Groups</p>");
            $(".main-search-input").html("");
        }
        $.session.set("type", type);

    
    });
    $(".main-search-input").on("keyup", function(){
        if($.session.get("type") === "Courses"){
                payload = {
                   searchValue:$(".main-search-input").val(),
                   type:"Courses" 
                }
                $.ajax({
                    url: "/siteWideSearch",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                    "Content-Type": "application/json"
                    }, statusCode: {
                    202: function (result) {
                        if(result.type === "Courses"){
                            if(($(".main-search-input").val() === "")){
                                $(".resultsContainer").html("<p class='emptySearch'>Search Courses</p>");
                            }
                            else if(result.Courses.length > 0){
                               var courses = "";
                                for( x in result.Courses){
                                    courses+= "<div class='courseCountainer'><a href='/Course/"+result.Courses[x].CourseName+"'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
                                    result.Courses[x].CourseCode+"</p></a></div>";
                                }
                                $(".resultsContainer").html(courses);
                            }
                           
                            else{
                                $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
                            }
                        } 
                    },
                    500: function (result) {
                        alert("500 ");
                        console.log(result)
                    },
                    },
                });
        }
        else if($.session.get("type") === "Users"){
                payload = {
                   searchValue:$(".main-search-input").val(),
                   type:"Users" 
                }
                $.ajax({
                    url: "/siteWideSearch",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                    "Content-Type": "application/json"
                    }, statusCode: {
                    202: function (result) {
                            var users = "";
                            if(($(".main-search-input").val() === "")){
                                 $(".resultsContainer").html("<p class='emptySearch'>Search Users</p>");
                            }
                            else if(result.Users.length > 0){
                                for( x in result.Users){
                                    users+= "<div class='courseCountainer'><a href='/User/"+result.Users[x].handle+"'><img class='searchUser' src=../"+result.Users[x].img+"><p class='searchName'>"+result.Users[x].first_name+ " "+
                                        result.Users[x].last_name+"<p class='userHandle'>"+result.Users[x].handle+
                                        "</p></a></div></p>";
                                }
                                $(".resultsContainer").html(users);
                            }
                            else{
                                $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
                            }
                    },
                    500: function (result) {
                        alert("500 ");
                        console.log(result)
                    },
                    },
                }) 
        }
        else if($.session.get("type") === "Tutors"){
                payload = {
                   searchValue:$(".main-search-input").val(),
                   type:"Tutors" 
                }
                $.ajax({
                    url: "/siteWideSearch",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                    "Content-Type": "application/json"
                    }, statusCode: {
                    202: function (result) {
                            var listing = "";
                            if(($(".main-search-input").val() === "")){
                                $(".resultsContainer").html("<p class='emptySearch'>Search Tutors</p>");
                            }
                            else if(result.Listings.length > 0){
                                for(x in result.Listings){
                                    listing+= "<div class='courseCountainer'><a href='/Checkout?id="+result.Listings[x]._id+"'><img class='searchUser' src=../"+result.Listings[x].Image+"><p class='searchName'>"+result.Listings[x].Name+ " "+
                                    "<p class='userHandle'>"+result.Listings[x].Subject+
                                    "</p></a></div></p>";                        
                            }
                                $(".resultsContainer").html(listing);
                            }
                            else{
                                $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
                            }
                    },
                    500: function (result) {
                        alert("500 ");
                        console.log(result)
                    },
                    },
                }) 
        }
        else if($.session.get("type") === "Groups"){
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
                            if(($(".main-search-input").val() === "")){
                                $(".resultsContainer").html("<p class='emptySearch'>Search Groups</p>");
                            }
                            else if(result.Groups.length > 0){
                                for( x in result.Groups){
                                    groups+= "<div class='courseCountainer'><a href='/Group/"+result.Groups[x]._id+"'><p class='courseName'>"+result.Groups[x].GroupName+"</p>"+
                                    "<p class='studyGroupSubject'>"+result.Groups[x].Subject+"</p></a></div>";
                                }

                                $(".resultsContainer").html(groups);
                            }
                            else{
                                $(".resultsContainer").html("<p class='noMatch'>No matching Results</p>");
                            }
                    },
                    500: function (result) {
                        alert("500 ");
                        console.log(result)
                    },
                    },
                });
                
        }
    });

});
