$(document).ready(function(){

    //login form validation
    $("#submit").on("click",function(e){
        var code = $("#code").val();
        var password = $("#pw").val();
        var rePassword = $("#re-pw").val();

        if(code === "" ){
            $("#code").css("border","1px solid red");
            $("#codeTxt").text("Enter the code from our email");
            e.preventDefault();
        }
        if(password === ""){
           
            $("#pw").css("border","1px solid red");
            $("#pwTxt").text("Enter a new password");
            e.preventDefault();
        }
        else if(password.length < 6){
            $("#pw").css("border","1px solid red");
            $("#pwTxt").text("Password length must be longer than 6 characters");
            e.preventDefault();
        }
        if(rePassword === ""){
            $("#pw").css("border","1px solid red");
            $("#re-pw").css("border","1px solid red");
            $("#rePwTxt").text("Re-enter your password");
            e.preventDefault();
        }
        else if(rePassword != password){
        
            $("#re-pw").css("border","1px solid red");
            $("#rePwTxt").text("Passwords don't match");
            e.preventDefault();
        }
    });
    $("input").focusout(function(){
        $(this).css("border","1px solid black");
        $(this).next().next().text("");
    })
});
