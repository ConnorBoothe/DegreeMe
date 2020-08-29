

// $(document).ready(function(){

    

//         //login form validation
//         $("#loginBtn").on("click",function(e){
//             var email = $("#email").val();
//             var password = $("#password").val();
//             var emailRegEx = 	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//             var match = emailRegEx.test(email);
//             var emailIndex = emails.indexOf(email);
//             var passwordIndex = passwords.indexOf(password);
//             if (match){
//                 $("#emailMsg").html("<span>&#10003;</span>");
//                 $("#email").css("border","1px solid green");
//                 $("#password").css("border","1px solid green");
//             }
//             else if(!match && email!="" && password ===""){
//                 $("#emailMsg").text("Email not valid");
//                 $("#email").css("border","1px solid red");
//                 $("#password").css("border","1px solid green");
//                 e.preventDefault();
//             }
//             else if(email!="" && password === ""){
//                 $("#password").css("border","1px solid red");
//                 $("#pwMsg").text("Enter a Password");
//                 e.preventDefault();
//             }
//             else if(email==="" && password != ""){
//                 $("#emailMsg").text("Enter your email");
//                 $("#email").css("border","1px solid red");
//                 e.preventDefault();
//             }

//             else if(email === "" && password == ""){
//                 $("#emailMsg").text("Enter your email");
//                 $("#email").css("border","1px solid red");
//                 $("#password").css("border","1px solid red");
//                 $("#pwMsg").text("Enter a Password");
//                 e.preventDefault();
//             }
            
//             else if(!match && email!=""){
//                 $("#emailMsg").text("Email not valid");
//                 $("#email").css("border","1px solid red");
//                 $("#password").css("border","1px solid red");
//                 e.preventDefault();
//             }
//         });
        
//         $(".input-field").focusout(function(){
//             $(this).css("border-bottom","2px solid #a9a9a9")
//         })
// });

