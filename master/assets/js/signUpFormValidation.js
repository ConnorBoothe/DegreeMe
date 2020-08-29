

function filterResults(res, searchValue){
    var majors = "";
    var count = 0;
    var majorList = [];
    for(x in res){
        majorList.push(res[x].Major)
    }
    
    var majorListSet = new Set(majorList);
    var majorList = [... majorListSet]
    
    if(searchValue.length === 0){
        
            $(".major-list").html("<p class='emptySearch'>Search Majors</p>");
    }
    else{
            
            for(x in majorList){
                var major = (majorList[x]).toLowerCase();
                if(major.includes(searchValue.toLowerCase())){

                    if(count < 15){
                        majors+= "<li class='major-list-item'>"+majorList[x]+"</li>";
                        count++;
                    }
                }
            }
            if(majors === ""){
                return "<p class='noMatch'>No matching results</p>"
            }
            else{
                return majors;

            }
        }
}

$(document).ready(function(){
$(".picX").on("click", function(){
    $("#img-upload-container").hide();
    $(".overlay").hide();
})
$(".overlay").on("click", function(){
    $("#img-upload-container").hide();
    $(".overlay").hide();
})
    $(".major-autocomplete").hide();
    $(".standing-autocomplete").hide();
    $(".major-autocomplete").on("click", ".major-list-item", function(){
        $("#major").val($(this).text());
        $(".major-autocomplete").hide();

    })
    

    $(".blocker").on("click", function(){
        $(this).hide();
        $(".major-autocomplete").hide();
    })
    
    $("#major").on("focus", function(){
        $(".major-autocomplete").show();
        $(".blocker").show();
        $.ajax({
            url: '/API/Majors' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) {
                $("#major").on("keyup", function(){
                    $(".major-list").html(filterResults(res,$(this).val()))
                })
              
                
        });
    })

    $("#classStanding").on("focus", function(){
        $(".standing-autocomplete").show();

    })
        //login form validation
        $("#loginBtnSignUp").on("click",function(e){
            e.preventDefault();
            var submit = true;
            var email = $("#emailSignUp").val();
            var password = $("#passwordSignUp").val();
            var emailRegEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
            var match = emailRegEx.test(email);
            
            if($("#handle").val().includes(' ')){
                submit = false;
                $("#handle").css("border-bottom","2px solid #dc3545");
                $("#handleTxt").text("Username can't contain spaces");
               }
            else if($("#handle").val().length > 12){
                submit = false;
                $("#handle").css("border-bottom","2px solid #dc3545");
                $("#handleTxt").text("Username can't be longer than 12 characters");
            }
            else if($("#handle").val().length < 4){
                submit = false;
                $("#handle").css("border-bottom","2px solid #dc3545");
                $("#handleTxt").text("Username can't be longer than 12 characters");
            }
            else if($("#handle").val().length === 0){
                submit = false;
                $("#handle").css("border-bottom","2px solid #dc3545");
                $("#handleTxt").text("Enter a Handle");
            }

           if($("#first").val() === ""){
            submit = false;
            $("#first").css("border-bottom","2px solid #dc3545");
            $("#firstTxt").text("Enter your first name");
           }
           else{
            $("#firstTxt").text("");
           }

           if($("#last").val() === ""){
            submit = false;
            $("#last").css("border-bottom","2px solid #dc3545");
            $("#lastTxt").text("Enter your last name");
           }
           else{
            $("#lastTxt").text("");
           }

           if($("#emailSignUp").val() === ""){
            submit = false;
            $("#emailSignUp").css("border-bottom","2px solid #dc3545");
            $("#emailTxt").text("Enter an email");
           }
           else if(!match){
            submit = false;
            $("#emailSignUp").css("border-bottom","2px solid #dc3545");
            $("#emailTxt").text("Email not valid");
            
           }
           else if(!$("#emailSignUp").val().includes("@uncc.edu")){
            submit = false;
            $("#emailSignUp").css("border-bottom","2px solid #dc3545");
            $("#emailTxt").text("Not a UNCC email");
            
           }
           else{
            $("#emailTxt").text("");
           }

           if($("#schoolSignUp").val() === ""){
            submit = false;
            $("#schoolSignUp").css("border-bottom","2px solid #dc3545");
            $("#schoolTxt").text("Enter your school");
           }
           else{
            $("#schoolTxt").text("");
           }

           if($("#passwordSignUp").val() === ""){
            submit = false;
            $("#passwordSignUp").css("border-bottom","2px solid #dc3545");
            $("#pwTxt").text("Enter a password");
           }
           else if(password.length < 6){
            submit = false;
            $("#passwordSignUp").css("border-bottom","2px solid #dc3545");
            $("#pwTxt").text("Password must be 6 characters or more");
           }
           else{
            $("#pwTxt").text("");
           }

           if($("#retypePasswordSignUp").val() === ""){
            submit = false;
            $("#retypePasswordSignUp").css("border-bottom","2px solid #dc3545");
            $("#ReTypeTxt").text("Re-enter password");
           }
           else if ($("#retypePasswordSignUp").val() != password){
            submit = false;
            $("#passwordSignUp").parent().css("border-bottom","2px solid #dc3545");
            $("#retypePasswordSignUp").parent().css("border-bottom","2px solid #dc3545");
            $("#ReTypeTxt").text("Passwords don't match");
           }
        
           else{
          
            $("#ReTypeTxt").text("");
           }
      
           if(!$("#userImage").attr("src")){
               submit = false;
               $("#imgTxt").text("Upload a Profile Picture");
           }
           
           else if ($("#userImage").attr("src")){
            $("#imgTxt").text("");
           }
           if($("#major").val() === ""){
            submit = false;
            $("#major").css("border-bottom","2px solid #dc3545");
            $("#majorTxt").text("Enter your major")
           }
           else{

           }

           if($("#classStanding").val() == ""){
            submit = false;
            $("#classStanding").css("border-bottom","2px solid #dc3545");
            $("#classTxt").text("Enter Class Standing")
           }

           
           //ajax call to check if handle and email exist
           $.ajax({
            url: '/API/Users' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) {
        
            for(x in res[0]){
                
                if($("#handle").val() === res[0][x]){
                    submit = false;
                    alert(res[0][x])
                    $("#handle").css("border-bottom","2px solid #dc3545");
                    $("#handleTxt").text("Handle already in use");
                }
                
            }
            for(x in res[1]){
                
                if( email === res[1][x]){
                    submit = false;
                   
                    $("#emailSignUp").css("border-bottom","2px solid #dc3545");
                    $("#emailTxt").text("Email already in use");
                    
                }
                
            }

            if(submit){
                $("#form").submit();
            }
         
                
        });
        });
        $(".input-field1").focus(function(){
            $(this).css("border-bottom","2px solid #007bff")
            $(this).next().text("");
        })
        $(".input-field1").focusout(function(){
            $(this).css("border-bottom","2px solid #a9a9a9");
        })
 
       $(".upload-result").on("click", function(){
           $("#imgTxt").text("");
       })
    
});

