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
    $.ajax({
        url: '/GroupImages' ,
        method: 'GET',
        error:function(err,str){
           
        }
        }).done(function(res) {
            $(".go-home-item").append( formatGroupImageList(res));
        });
})