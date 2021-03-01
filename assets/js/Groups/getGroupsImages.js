function formatStoryList(groups){
    var groupsHTML = "<ul class='home-stories-list'>";
    for(var i = 0; i < groups.length; i++) { 
        //place a border around the group image that corresponds
        //with the group page the user is currently on
     
            groupsHTML += 
            '<li>'+
                '<input type="hidden" name="groupId" value="'+groups[i]._id+'" />'+
                '<img class="group-story-image1 currGroup" src="'+groups[i].GroupImage+'" data-toggle="tooltip" data-placement="bottom" title="'+groups[i].GroupName+' Story"/>'+
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
    groupsHTML += 
            '<li>'+
                
                    
            '<div data-toggle="tooltip" class="create-group-container" data-placement="right" title="New Group">'+
            '<svg data-toggle="modal" data-target="#addGroupModal"  xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">'+
                '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>'+
            '</svg>'+
            '</div>'+
                
            '</li>';
    return groupsHTML;
}

$(document).ready(()=>{
var page = window.location.href.split("/")[3];
    $.ajax({
        url: '/getStoryImages' ,
        method: 'GET',
        error:function(err,str){
           
        }
        }).done(function(res) {
           $(".group-link").attr("href","/Group/"+ res[0]._id)
            
            if(page == "home") {
                $(".page-title-container").html(formatStoryList(res));
            }
            else if(page == "discover") {
                $(".page-title-container").html(formatStoryList(res));
            }
           
        });
        $.ajax({
            url: '/getGroupImages' ,
            method: 'GET',
            error:function(err,str){
               
            }
            }).done(function(res) {
               $(".group-link").attr("href","/Group/"+ res[0]._id)
                if(page == "Group") {
                    $(".group-images-list").append(formatGroupImageList(res));
                }
               
               
            });
})