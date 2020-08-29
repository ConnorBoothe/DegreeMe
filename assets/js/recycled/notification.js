$(document).ready(function(){
    $(".notif").each(function(){
        var temp = $(this).html().split(" ");
        if(temp[0] === "Deleted"){
            temp[0] = " <span class='badge badge-danger'>Deleted</span> ";
            temp[1] = temp[1] + " ";
        }
        else if(temp[0] === "Added"){
            temp[0] = " <span class='badge badge-success'>Added</span> ";
            temp[1] = temp[1] + " ";
        }
        else if(temp[0] === "Yes"){
            temp[0] = " <span class='badge badge-primary'>Updated</span> "+temp[1] +  " " + temp[2] + " RSVP to " +temp[0];
            temp[1] = "";
            temp[2]="";
        }
        else if(temp[0] === "Maybe"){
            temp[0] = " <span class='badge badge-primary'>Updated</span> "+temp[1] +  " " + temp[2] + " RSVP to " +temp[0];
            temp[1] = "";
            temp[2]="";
        }
        else if(temp[0] === "No"){
            temp[0] = " <span class='badge badge-primary'>Updated</span> "+temp[1] +  " " + temp[2] + " RSVP to " +temp[0];
            temp[1] = "";
            temp[2]="";
        }
        
        $(this).html(temp);
    })
   
    
});