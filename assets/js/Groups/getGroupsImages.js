function formatStoryList(groups){
    var groupsHTML = "<ul class='home-stories-list'>";
    for(var i = 0; i < groups.length; i++) { 
        //place a border around the group image that corresponds
        //with the group page the user is currently on
     
            groupsHTML += 
            '<li>'+
                '<a href="/Group/'+groups[i]._id+'" data-toggle="tooltip" data-placement="right" title="'+groups[i].GroupName+'">'+
                    '<img class="group-story-image currGroup" src="'+groups[i].GroupImage+'"/>'+
                '</a>'+
            '</li>';
        
    }
    groupsHTML += "</ul>";
    return groupsHTML;
}
function formatGroupImageList(groups){
    var groupsHTML = "";
    for(var i = 0; i < groups.length; i++) { 
        //place a border around the group image that corresponds
        //with the group page the user is currently on
        if(window.location.href.split("/")[4] == groups[i]._id){
            groupsHTML += 
            '<li>'+
                '<a href="/Group/'+groups[i]._id+'" data-toggle="tooltip" data-placement="right" title="'+groups[i].GroupName+'">'+
                    '<img class="go-home-groups currGroup" src="'+groups[i].GroupImage+'"/>'+
                '</a>'+
            '</li>';
        }
        else{
            groupsHTML += 
            '<li>'+
                '<a href="/Group/'+groups[i]._id+'" data-toggle="tooltip" data-placement="right" title="'+groups[i].GroupName+'">'+
                    '<img class="go-home-groups" src="'+groups[i].GroupImage+'"/>'+
                '</a>'+
            '</li>';
        }
       
    }
    return groupsHTML;
}

$(document).ready(()=>{
var page = window.location.href.split("/")[3];
    $.ajax({
        url: '/GroupImages' ,
        method: 'GET',
        error:function(err,str){
           
        }
        }).done(function(res) {
           $(".group-link").attr("href","/Group/"+ res[0]._id)
            if(page == "Group") {
                $(".go-home-item").append(formatGroupImageList(res));
            }
            else if(page == "home") {
                $(".page-title-container").html(formatStoryList(res));
            }
            else if(page == "discover") {
                $(".page-title-container").html(formatStoryList(res));
            }
           
        });
})