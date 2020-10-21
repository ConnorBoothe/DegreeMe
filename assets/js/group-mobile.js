$(document).ready(function(){
    if(window.innerWidth < 1000){
       if($("input[name='isMember']").val() == "true"){
        $(".mobile-logo-wrapper").html('<div class="mobileJoin"><form action="/#" method="post" id="joinedGroup">'+
        '<input name="joinGroup" type="hidden" value="'+$("input[name='groupId']").val()+'"/>'+
        '<input name="joinGroup" type="hidden" value="'+$("input[name='groupName']").val()+'"/>'+
        '<button id="groupBtn" data-status="unjoin" type="button"'+
                'class="btn btn-success joinButton"'+
                'data-group='+$("input[name='groupName']").val()+
                '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>'+
                  '</svg>'+
                'Joined '+
        '</button>'+
    '</form></div>'); 
       }
        else{
            $(".mobile-logo-wrapper").html('<div class="mobileJoin"><form action="/#" method="post" id="joinGroup">'+
            '<input name="joinGroup" type="hidden" value="'+$("input[name='groupId']").val()+'"/>'+
        '<input name="joinGroup" type="hidden" value="'+$("input[name='groupName']").val()+'"/>'+
            '<button id="groupBtn" data-status="join" type="button"'+
                'class="btn btn-primary joinButton"> Join Group </button>'+
        '</form></div>'); 
        }
       
        
    }
})