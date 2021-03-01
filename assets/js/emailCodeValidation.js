$(document).ready(function(){

    //login form validation
    $(".confirmSubmit").on("click",function(e){
        var email = $(".confirmInput").val();
        var emailRegEx = 	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var match = emailRegEx.test(email);
        if(email === ""){
            $(".confirmInput").css("border", "1px solid #dc3545");
            $("#emailTxt").text("Enter your email");
            e.preventDefault();
        }
        else if(!match){
            $(".confirmInput").css("border", "1px solid #dc3545");
            $("#emailTxt").text("Email Invalid");
            e.preventDefault();
        }

    });
    $("input").focus(function(){
        $(this).css("border","1px solid black");
        $(this).next().next().text("");
    })
});
