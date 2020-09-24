
function base64ImageToBlob(str) {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    console.log(pos)
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);
  
    // decode base64
    var imageContent = atob(b64);
  console.log(imageContent)
    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);
  
    // fill the view, using the decoded base64
    for(var n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }
  
    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });
  
    return blob;
  }
  function handleImageUpload(event) {
   
    var imageFile = event.target.files[0];
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
   
    var options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
   
        return uploadToServer(compressedFile); // write your own logic
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }
$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyCdNXC20rfZy4WU_Yo0r1_jqurajcevaI0",
        authDomain: "degreeme-bd5c7.firebaseapp.com",
        databaseURL: "https://degreeme-bd5c7.firebaseio.com",
        projectId: "degreeme-bd5c7",
        storageBucket: "degreeme-bd5c7.appspot.com",
        messagingSenderId: "52205869765",
        appId: "1:52205869765:web:b577285fdc02f989616eac",
        measurementId: "G-W912PS5JG0"
      };
    
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    $("#imgInp").change(function(){
        readFile(this);
    });
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
    var defaultImg = "../assets/img/croppieDefaultImage-100.jpg";
    var location = window.location.href.toString().split("/")[3];
    // if( location === "SignUp"){
    //     defaultImg = "assets/img/croppieDefaultImage-100.jpg"
    // }
    // else if(location === "Settings"){
    //     defaultImg = "assets/img/croppieDefaultImage-100.jpg";
    // }
    // else if("User"){
    //     defaultImg = $(".profile-img").attr("src");
    // }
    $uploadCrop = $('.upload-demo').croppie({
        viewport: {
            width: 300,
            height: 300,
            type: 'circle',
        },
        boundary: {
            width: 320,
            height: 320
        }, 
        // url: defaultImg,
    });
    $('.cr-slider').attr({'min':.5, 'max':2});
    $uploadCrop.croppie('bind', defaultImg).then(function(){ 
        $uploadCrop.croppie('setZoom', '.8');
      });
        // $(".cr-image").attr("src", $(".profile-img").attr("src"));
$(".img-btn").on("click", function(){
    if(window.innerWidth > 1000){
    if($(".handle").eq(0).val() === "" ){
        $(".imgTxt").text("Enter username before uploading an image.");
    }
    else{
        $(".overlay").show();
        $(".img-upload-container").show();
    }
    }
    else{
        if($(".handle").eq(1).val() === "" ){
            $(".imgTxt").text("Enter username before uploading an image.");
        }
        else{
            $(".overlay").show();
            $(".img-upload-container").show();
        }
    }
    
})
$(".loginBtnSignUp").attr("disabled", true); 
    $('.upload').on('change', function () { 
        readFile(this); });
    $('.upload-result').on('click', function (ev) {
        
        $uploadCrop.croppie('result', {
            type: 'canvas',
            size: {width:250},
            format : 'jpg',
        }).then(function (resp) {
            if(window.location.href.toString().split("/")[3] === "user"){
                payload = {
                    handle:$(".userProfileName ").text(),
                    img1:resp,
                    source:"profile"
                }
                $.ajax({
                    url: "/Settings",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                      "Content-Type": "application/json"
                    }, statusCode: {
                      202: function (result) {
                          alert("Profile image updated. It may take several minutes for your changes to be visible.")
                      },
                      500: function (result) {
                        alert("500 " + result.responseJSON.err);
                      },
                    },
                  });
            }
            // $('.imagebase64').val(resp);
            $(".croppedImg").val(("src", resp));
            $(".editImg").attr("src",resp);
            var storageRef = firebase.storage().ref("userImages/"+$("input[name='handle']").val());
            console.log($(".imagebase64").val())
            var image = base64ImageToBlob(resp);
            // console.log(image)
            var metadata = {
              contentType: 'image/jpeg',
            };
            
            var task = storageRef.put(image, metadata);
            task.on("state_changed", function(){
             function error(error){
              alert(error);
             }
            })
            storageRef.getDownloadURL().then(function(url) {
                // Get the download URL for 'images/stars.jpg'
                // This can be inserted into an <img> tag
                // This can also be downloaded directly
                $(".result1 .uploadingImg").text("Uploaded");
                $(".imageURL").val(url)
                $(".imageUploaded").val(url)
                $(".loginBtnSignUp").attr("disabled", false); 

                
              }).catch(function(error) {
                // Handle any errors
              });
            // console.log(resp.replace(/^data:image\/[a-z]+;base64,/, ""))
            //if location == signUp, insert image
            if(window.location.href.toString().split("/")[3].includes("SignUp")){
                $(".result1").eq(1).html("<img class='userImage' name='userImage' src='"+resp+"'/><span class='uploadingImg text-light'>Uploading...</span>");
                $(".result1").eq(0).html("<img class='userImage' name='userImage' src='"+resp+"'/><span class='uploadingImg text-light'>Uploading...</span>");
            }
            // }
           
            $(".croppedImg").val($('.imagebase64').val());
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

