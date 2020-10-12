

$(document).ready(function(){
    $("#email1").focusout(function(){
        $(this).css("border-bottom", "2px solid rgb(66, 66, 66)");
        $(this).prev().css("color", "black");
    })
    $("#email1").focus(function(){
        $(this).css("border-bottom", "2px solid #007bff");
        $(this).prev().css("color", "#007bff");
        $("#emailMsg1").html("");
    })
    $("#password1").focusout(function(){
        $(this).css("border-bottom", "2px solid rgb(66, 66, 66)");
        $(this).prev().css("color", "black");
    })
    $("#password1").focus(function(){
        $(this).css("border-bottom", "2px solid #007bff");
        $(this).prev().css("color", "#007bff");
        $("#pwMsg1").text("");
    })
    //login form validation
    $("#loginBtn1").on("click",function(e){
        var email = $("#email1").val();
        var password = $("#password1").val();
        var emailRegEx = 	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var match = emailRegEx.test(email);
        if(email ==="" && password ===""){
            $("#emailMsg1").html("<span>Enter Email</span>");
            $("#email1").css("border-bottom","2px solid #dc3545");
            $("#password1").css("border-bottom","2px solid #dc3545");
            $("#pwMsg1").text("Enter a Password");
            e.preventDefault();
        }
        else if(match && email!=="" && password === ""){
            $("#emailMsg1").html("<span></span>");
            $("#email1").css("border","1px solid green");
            $("#password1").css("border","1px solid red");
            $("#pwMsg1").text("Enter a Password");
            e.preventDefault();
        }
        else if(email==="" && password !== ""){
            $("#password1").css("border","none");
            $("#pwMsg1").text("");
            $("#emailMsg1").html("<span>Enter Email</span>");
            $("#email1").css("border","1px solid red");
            e.preventDefault();
        }
        else if(!email.includes("uncc.edu")){
            $("#password1").css("border","none");
            $("#pwMsg1").text("");
            $("#emailMsg1").html("<span>Enter a UNCC Email</span>");
            $("#email1").css("border-bottom","2px solid #dc3545");
            e.preventDefault();
        }
        else if (!match){
            $("#emailMsg1").html("<span>Email Not Valid</span>");
            $("#email1").css("border","1px solid red");
            e.preventDefault();
        }
        else{
            $(".loginLinkList").html('<div class="spinner-border" role="status">'+
            '<span class="sr-only" color="white"></span></div><span class="loggingYouIn">Logging you in...</span>')
        }
    });  
});
