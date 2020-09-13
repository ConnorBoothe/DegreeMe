

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
    $(".img-upload-container").hide();
    $(".overlay").hide();
})
$(".overlay").on("click", function(){
    $(".img-upload-container").hide();
    $(".overlay").hide();
})
    $(".major-autocomplete").hide();
    $(".standing-autocomplete").hide();
    $(".major-autocomplete").on("click", ".major-list-item", function(){
        $(".major").val($(this).text());
        $(".major-autocomplete").hide();

    })
    

    $(".blocker").on("click", function(){
        $(this).hide();
        $(".major-autocomplete").hide();
    })
    
    $(".major").on("focus", function(){
        $(".major-autocomplete").show();
        $(".blocker").show();
        $.ajax({
            url: '/API/Majors' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) {
                $(".major").on("keyup", function(){
                    $(".major-list").html(filterResults(res,$(this).val()))
                }) 
        });
    })
    $(".classStanding-select").on("click", function(){
        $(".classTxt").text("");
    })
        //login form validation
        $(".loginBtnSignUp").on("click",function(e){
            e.preventDefault();
            var submit = true;
            if(!$(".userImage").attr("src")){
                submit = false;
                $(".imgTxt").text("Upload a Profile Picture");
            }
            
            else if ($(".userImage").eq(0).attr("src")){
             $(".imgTxt").text("");
            }
            if(window.innerWidth > 1000){
            
            var email = $(".emailSignUp").eq(0).val();
            var password = $(".passwordSignUp").eq(0).val();
            var emailRegEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var match = emailRegEx.test(email);
            $("input[name='screenSize']").val("Desktop");
            if($(".handle").eq(0).val().includes(' ')){
                submit = false;
                $(".handle").eq(0).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(0).text("Username can't contain spaces");
               }
            else if($(".handle").eq(0).val().length > 12){
                submit = false;
                $(".handle").eq(0).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(0).text("Username can't be longer than 12 characters");
            }
            else if($(".handle").eq(0).val().length < 4){
                submit = false;
                $(".handle").eq(0).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(0).text("Username can't be longer than 12 characters");
            }
            else if($(".handle").eq(0).val().length === 0){
                submit = false;
                $(".handle").eq(0).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(0).text("Enter a Handle");
            }

           if($(".first").eq(0).val() === ""){
            submit = false;
            $(".first").eq(0).css("border-bottom","2px solid #dc3545");
            $(".firstTxt").eq(0).text("Enter your first name");
           }
           else{
            $(".firstTxt").eq(0).text("");
           }

           if($(".last").eq(0).val() === ""){
            submit = false;
            $(".last").eq(0).css("border-bottom","2px solid #dc3545");
            $(".lastTxt").eq(0).text("Enter your last name");
           }
           else{
            $(".lastTxt").eq(0).text("");
           }

           if($(".emailSignUp").eq(0).val() === ""){
            submit = false;
            $(".emailSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(0).text("Enter an email");
           }
           else if(!match){
            submit = false;
            $(".emailSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(0).text("Email not valid");
            
           }
           else if(!$(".emailSignUp").eq(0).val().includes("@uncc.edu")){
            submit = false;
            $(".emailSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(0).text("Not a UNCC email");
            
           }
           else{
            $(".emailTxt").eq(0).text("");
           }

           if($(".schoolSignUp").eq(0).val() === ""){
            submit = false;
            $(".schoolSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".schoolTxt").eq(0).text("Enter your school");
           }
           else{
            $(".schoolTxt").eq(0).text("");
           }

           if($(".passwordSignUp").eq(0).val() === ""){
            submit = false;
            $(".passwordSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".pwTxt").eq(0).text("Enter a password");
           }
           else if(password.length < 6){
            submit = false;
            $(".passwordSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".pwTxt").eq(0).text("Password must be 6 characters or more");
           }
           else{
            $(".pwTxt").eq(0).text("");
           }

           if($(".retypePasswordSignUp").eq(0).val() === ""){
            submit = false;
            $(".retypePasswordSignUp").eq(0).css("border-bottom","2px solid #dc3545");
            $(".ReTypeTxt").eq(0).text("Re-enter password");
           }
           else if ($(".retypePasswordSignUp").eq(0).val() != password){
            submit = false;
            $(".passwordSignUp").eq(0).parent().css("border-bottom","2px solid #dc3545");
            $(".retypePasswordSignUp").eq(0).parent().css("border-bottom","2px solid #dc3545");
            $(".ReTypeTxt").eq(0).text("Passwords don't match");
           }
        
           else{
          
            $(".ReTypeTxt").eq(0).text("");
           }
      
        //    if(!$(".userImage").attr("src")){
        //        submit = false;
        //        $(".imgTxt").text("Upload a Profile Picture");
        //    }
           
        //    else if ($(".userImage").eq(0).attr("src")){
        //     $(".imgTxt").text("");
        //    }
           if($(".major").eq(0).val() === ""){
            submit = false;
            $(".major").eq(0).css("border-bottom","2px solid #dc3545");
            $(".majorTxt").eq(0).text("Enter your major")
           }
           else{

           }

           if($(".classStanding-select").eq(0).val() == ""){
            submit = false;
            $(".classStanding-select").eq(0).css("border-bottom","2px solid #dc3545");
            $(".classTxt").eq(0).text("Enter Class Standing")
           }
           //ajax call to check if handle and email exist
           $.ajax({
            url: '/API/Users' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) {
        
            for(x in res[0]){
                if($(".handle").eq(0).val() === res[0][x]){
                    submit = false;
                    $(".handle").eq(0).css("border-bottom","2px solid #dc3545");
                    $(".handleTxt").eq(0).text("Handle already in use");
                }
                
            }
            for(x in res[1]){
                if( email === res[1][x]){
                    submit = false;
                    $(".emailSignUp").eq(0).css("border-bottom","2px solid #dc3545");
                    $(".emailTxt").eq(0).text("Email already in use"); 
                }
            }
            if(submit){
                $(".form").eq(0).submit();
            }
        });
        }
        else{
            var email = $(".emailSignUp").eq(1).val();
            var password = $(".passwordSignUp").eq(1).val();
            var emailRegEx =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var match = emailRegEx.test(email);
            $("input[name='screenSize']").val("Mobile");
            if($(".handle").eq(1).val().includes(' ')){
                submit = false;
                $(".handle").eq(1).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(1).text("Username can't contain spaces");
               }
            else if($(".handle").eq(1).val().length > 12){
                submit = false;
                $(".handle").eq(1).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(1).text("Username can't be longer than 12 characters");
            }
            else if($(".handle").eq(1).val().length < 4){
                submit = false;
                $(".handle").eq(1).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(1).text("Username can't be longer than 12 characters");
            }
            else if($(".handle").eq(1).val().length === 0){
                submit = false;
                $(".handle").eq(1).css("border-bottom","2px solid #dc3545");
                $(".handleTxt").eq(1).text("Enter a Handle");
            }

           if($(".first").eq(1).val() === ""){
            submit = false;
            $(".first").eq(1).css("border-bottom","2px solid #dc3545");
            $(".firstTxt").eq(1).text("Enter your first name");
           }
           else{
            $(".firstTxt").eq(1).text("");
           }

           if($(".last").eq(1).val() === ""){
            submit = false;
            $(".last").eq(1).css("border-bottom","2px solid #dc3545");
            $(".lastTxt").eq(1).text("Enter your last name");
           }
           else{
            $(".lastTxt").eq(1).text("");
           }

           if($(".emailSignUp").eq(1).val() === ""){
            submit = false;
            $(".emailSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(1).text("Enter an email");
           }
           else if(!match){
            submit = false;
            $(".emailSignUp").eq(11).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(1).text("Email not valid");
            
           }
           else if(!$(".emailSignUp").eq(1).val().includes("@uncc.edu")){
            submit = false;
            $(".emailSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".emailTxt").eq(1).text("Not a UNCC email");
            
           }
           else{
            $(".emailTxt").eq(1).text("");
           }

           if($(".schoolSignUp").eq(1).val() === ""){
            submit = false;
            $(".schoolSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".schoolTxt").eq(1).text("Enter your school");
           }
           else{
            $(".schoolTxt").eq(1).text("");
           }

           if($(".passwordSignUp").eq(1).val() === ""){
            submit = false;
            $(".passwordSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".pwTxt").eq(1).text("Enter a password");
           }
           else if(password.length < 6){
            submit = false;
            $(".passwordSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".pwTxt").eq(1).text("Password must be 6 characters or more");
           }
           else{
            $(".pwTxt").eq(1).text("");
           }

           if($(".retypePasswordSignUp").eq(1).val() === ""){
            submit = false;
            $(".retypePasswordSignUp").eq(1).css("border-bottom","2px solid #dc3545");
            $(".ReTypeTxt").eq(1).text("Re-enter password");
           }
           else if ($(".retypePasswordSignUp").eq(1).val() != password){
            submit = false;
            $(".passwordSignUp").eq(1).parent().css("border-bottom","2px solid #dc3545");
            $(".retypePasswordSignUp").eq(1).parent().css("border-bottom","2px solid #dc3545");
            $(".ReTypeTxt").eq(1).text("Passwords don't match");
           }
        
           else{
          
            $(".ReTypeTxt").text("");
           }
      
        //    if(!$(".userImage").eq(1).attr("src")){
        //        submit = false;
        //        $(".imgTxt").text("Upload a Profile Picture");
        //    }
           
        //    else if ($(".userImage").eq(1).attr("src")){
        //     $(".imgTxt").text("");
        //    }
           if($(".major").eq(1).val() === ""){
            submit = false;
            $(".major").eq(1).css("border-bottom","2px solid #dc3545");
            $(".majorTxt").eq(1).text("Enter your major")
           }
           else{

           }

           if($(".classStanding-select").eq(1).val() == ""){
            submit = false;
            $(".classStanding-select").eq(1).css("border-bottom","2px solid #dc3545");
            $(".classTxt").eq(1).text("Enter Class Standing")
           }
           //ajax call to check if handle and email exist
           $.ajax({
            url: '/API/Users' ,
            method: 'GET',
            error:function(err,str){
            }
            }).done(function(res) {
        
            for(x in res[0]){
                
                if($(".handle").eq(1).val() === res[0][x]){
                    submit = false;
                    $(".handle").eq(1).css("border-bottom","2px solid #dc3545");
                    $(".handleTxt").eq(1).text("Handle already in use");
                }
                
            }
            for(x in res[1]){
                if( email === res[1][x]){
                    submit = false;
                    $(".emailSignUp").eq(1).css("border-bottom","2px solid #dc3545");
                    $(".emailTxt").eq(1).text("Email already in use"); 
                }
            }
            alert(submit)
            if(submit){

                $(".form").eq(0).submit();
            }  
        });
        }
        });
    
        $(".input-field1").focus(function(){
            $(this).css("border-bottom","2px solid #007bff")
            $(this).next().text("");
        })
        $(".input-field1").focusout(function(){
            $(this).css("border-bottom","2px solid #a9a9a9");
        })
 
       $(".upload-result").on("click", function(){
           $(".imgTxt").text("");
       })
    
    
});

