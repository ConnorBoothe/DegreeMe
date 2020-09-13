

$(document).ready(function(){
    // var reader = new FileReader();
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
 
    // $("#imgInp").change(function(){
    //     readURL(this);
    // });
    
    var $uploadCrop;
    function readFile(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();          
            reader.onload = function (e) {
                $uploadCrop.croppie('bind', {
                    url: e.target.result, 
                });
                $('.upload-demo').addClass('ready');
            }           
            reader.readAsDataURL(input.files[0]);
        }
    }
    var defaultImg = "";
    var location = window.location.href.toString().split("/")[3];
    if( location === "SignUp"){
        defaultImg = "assets/img/croppieDefaultImage-100.jpg"
    }
    else if(location === "Settings"){
        defaultImg = $(".editImg").attr("src");
    }
    else if("User"){
        defaultImg = $(".profile-img").attr("src");
    }
    $uploadCrop = $('.upload-demo').croppie({
        viewport: {
            width: 300,
            height: 300,
            type: 'circle',
        },
        boundary: {
            width: 400,
            height: 400
        }, 
        url: defaultImg,
        enableZoom:true
    });
    $('.cr-slider').attr({'min':.5, 'max':1.5});
    $uploadCrop.croppie('bind', defaultImg).then(function(){ 
        // $uploadCrop.croppie('setZoom', 0.5)
      });
        // $(".cr-image").attr("src", $(".profile-img").attr("src"));
$(".img-btn").on("click", function(){
    $(".overlay").show();
    $(".img-upload-container").show();
})
    $('.upload').on('change', function () { readFile(this); });
    $('.upload-result').on('click', function (ev) {
        $uploadCrop.croppie('result', {
            type: 'canvas',
            size: 'original',
        }).then(function (resp) {

            if(window.location.href.toString().split("/")[3] === "User"){
                payload = {
                    handle:$(".userProfileName ").text(),
                    img1:resp
                    
                }
                $.ajax({
                    url: "/Settings",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                      "Content-Type": "application/json"
                    }, statusCode: {
                      202: function (result) {
                            //window.location.href = "/messages?messageId=" + result.messageId;
                      },
                      500: function (result) {
                        alert("500 " + result.responseJSON.err);
                      },
                    },
                  });
            }
            $('.imagebase64').val(resp);
            $(".croppedImg").val(("src", $('.imagebase64').val()));
            $(".userImage").attr("src",$('.imagebase64').val())
            //if location == signUp, insert image
            if(window.location.href.toString().split("/")[3] === "SignUp"){
                $(".result1").eq(1).html("<img class='userImage' name='userImage' src='"+$('.imagebase64').val()+"'/>");
            }
            
            // }
           
            $(".croppedImg").val() === $('.imagebase64').val();
            $(".overlay").hide();
            $(".img-upload-container").hide();
        });

    });
    $(".picX").on("click", function(){
        $(".img-upload-container").hide();
        $(".overlay").hide();
    })
    $(".overlay").on("click", function(){
        $(".img-upload-container").hide();
        $(".overlay").hide();
    })
})

