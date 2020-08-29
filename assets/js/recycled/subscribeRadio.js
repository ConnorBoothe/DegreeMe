$(document).ready(function(){
    
    $(".subscribeRadio input").on("click",function(){
      
        if($(this).val()=== "2"){
            $(".subscribeContainer").hide();
        }
        else{
            $(".subscribeContainer").show();
        }
    })
    $(".packageSelect").on("click",function(){
      
        if($(this).val()=== "Study+"){
            $("#package").val("Study+");
        }
        else if($(this).val()=== "Bronze"){
            $("#package").val("Bronze");
           
        }
        else if($(this).val()=== "Silver"){
            $("#package").val("Silver");
            
        }

        else if($(this).val()=== "Gold"){
            $("#package").val("Gold");
        }
        else{
            $("#package").val("Noo Sub");
        }
    })


})