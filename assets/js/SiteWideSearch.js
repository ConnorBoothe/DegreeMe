$(document).ready(function(){
    //display mobile search
    $(".search-mobile-li").on("click", function(){
        $(".mobile-search-container").show();
    })
    //close mobile search
    $(".close-search").on("click", function(){
        $(".mobile-search-container").hide();
    })
    //hide border bottom on help request form
    $(".timeline-container-status").eq(0).css("border-bottom", "none");
    $("body").show();
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
    if(window.innerWidth > 1000){
        $("input[name='searchType']").on("click", function(){

            console.log($(this).prev().attr("class"))
            $("input[name='searchType']").prev().removeClass("searchMenuUnderLine");
            $(this).prev().addClass("searchMenuUnderLine");
        })
    }
    else{
        $(".mobileTab").on("click", function(){
             $(".mobileTab").removeClass("searchMenuUnderLine");
             $(this).addClass("searchMenuUnderLine");
        })
    }
   
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
    //desktop
    $(".main-search-input").on("keyup", function(){
        var searchVal = $(this).val();
        if($.session.get("type") === "Courses"){
                payload = {
                   searchValue:$(this).val(),
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
                            if((searchVal === "")){
                                $(".resultsContainer").html("<p class='emptySearch'>Search Courses</p>");
                            }
                            else if(result.Courses.length > 0){
                               var courses = "";
                                for( x in result.Courses){
                                    courses+= "<div class='courseCountainer'><a href='/course/"+result.Courses[x].CourseName+"'><p class='courseName'>"+result.Courses[x].CourseName+"</p><p class='courseCode'>"+result.Courses[x].Department + " " +
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
                   searchValue:$(this).val(),
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
                        console.log(result)
                            var users = "";
                            if((searchVal === "")){
                                 $(".resultsContainer").html("<p class='emptySearch'>Search Users</p>");
                            }
                            else if(result.Users.length > 0){
                                for( x in result.Users){
                                    users+= "<div class='courseCountainer'><a href='/user/"+result.Users[x].handle+"'><img class='searchUser' src="+result.Users[x].img+"><p class='searchName'>"+result.Users[x].first_name+ " "+
                                        result.Users[x].last_name+"<p class='userHandle'>"+result.Users[x].handle+
                                        "</p></a></p></div>";
                                }
                                if(window.innerWidth > 1000){
                                    $(".resultsContainer").eq(0).html(users);
                                }
                                else{
                                    $(".resultsContainer").eq(1).html(users);
                                }
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
                   searchValue:$(this).val(),
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
                            if((searchVal === "")){
                                $(".resultsContainer").html("<p class='emptySearch'>Search Tutors</p>");
                            }
                            else if(result.Listings.length > 0){
                                for(x in result.Listings){
                                    listing+= "<div class='courseCountainer'><a href='/Checkout?id="+result.Listings[x]._id+"'><img class='searchUser' src="+result.Listings[x].Image+"><p class='searchName'>"+result.Listings[x].Name+ " "+
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
                   searchValue:$(this).val(),
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
                            if((searchVal === "")){
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
