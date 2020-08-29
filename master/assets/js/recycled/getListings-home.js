var socket = io.connect('http://127.0.0.1:4000');

function populateListings(data){
    var individualListings = "";
    var groupListings = "";
    for (x in data.listings){
      
        if(data.listings[x].Type == "Individual Session"){
            individualListings += '<li class="sideBarItemMenu-listing">'+ data.listings[x].Subject+'</li>';
        }
        else{
            groupListings += '<li class="sideBarItemMenu-listing">'+ data.listings[x].Subject+'</li>';
        }
        
    }
    return [individualListings, groupListings];
}
function addLabel(array){
    var firstString = ("<h3 class='listingItemHeader badge badge-primary'>Individual</h3>") + array[0];
    var secondString = ("<h3 class='listingItemHeader badge badge-primary'>Group</h3>") + array[1];
    //combine strings
    var finalString = firstString + secondString;
    return finalString;
}
$(document).ready(function(){
    socket.emit("get listings home", {user:$(".userProfileName").text()});
    socket.on("sending listings home",function(data){
        
        $(".sideBarItemMenu-list-listing").html(addLabel(populateListings(data)));
    })
})