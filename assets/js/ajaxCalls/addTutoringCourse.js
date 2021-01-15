function getDataUrl(img) {
    console.log(img)
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
 }
 function base64ImageToBlob(str) {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);
  
    // decode base64
    var imageContent = atob(b64);
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
//firebase config 
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
$(document).ready(function(){



    $("#showNotifications").on("click", ".add-tutoring-btn", function(e){
        $(".spinner-container1").show();
        var storageRef = firebase.storage().ref("transcripts/"+$("input[name='userId']").val()+"-" +$(".add-tutor-courseCode").val());
        e.preventDefault();
        var metadata = {
            contentType: 'image/jpeg',
        };
        var image = $(".transcript-upload")[0].files[0];
        // console.log(image.src)
        // image = base64ImageToBlob(image.src);
        // console.log(image)
        // var base64 = getDataUrl(image);
        storageRef.put(image, metadata)
        .then(function(){
            storageRef.getDownloadURL().then(function(url) {
                payload = {
                    course:$(".add-tutoring-input").val(),
                    courseCode:$(".add-tutor-courseCode").val(),
                    transcriptImg:url,
                    streamId:""
                }
                $.ajax({
                    url: "/addTutorCourse",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    headers: {
                      "Content-Type": "application/json"
                    }, statusCode: {
                      202: function (result) {
                          if(result.status == "success"){
                              $(".spinner-container1").html("<p class='badge badge-success success-msg'>Successfully submitted</p><p class='success-sub-text'>You're application to be a tutor in "+payload.course+" is pending. After reviewing your transcript,"+
                              " we will accept/reject your application.</p>")
                          }
                       console.log(result.status)
                      },
                      500: function (result) {
                        alert("500 " + result.responseJSON.err);
                      },
                    },
                  });
                 })
                 .catch(function(err){
                     console.log("ERR: "+err)
                 })
        })
        //     task.on("state_changed", function(){
        //     function error(error){
        //         console.log(error)
        //     }
        // })
      
     });

//mobile view
$("#showNotifications").on("click", ".dots-tutor-courses",function(){
    if( $(this).next().css("display") != "none"){
        $(this).next().hide();
    }
    else{
        $(this).next().show();
    }
});
$("#showNotifications").on("click", ".remove-tutor-course",function(){
    var appId = $(this).next().val();
    var parentElem = $(this).parent().parent();
    payload = {
        appId:appId,
        status:"Reject"
    }
    $.ajax({
        url: "/removeTutorCourse",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
              parentElem.remove();
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
});
//desktop view
$(".homeSideBar").on("click", ".dots-tutor-courses",function(){
  if( $(this).next().css("display") != "none"){
      $(this).next().hide();
  }
  else{
      $(this).next().show();
  }
});

$(".homeSideBar").on("click", ".remove-tutor-course",function(){
  var appId = $(this).next().val();
  var parentElem = $(this).parent().parent();
  payload = {
      appId:appId,
      status:"Reject"
  }
  $.ajax({
      url: "/removeTutorCourse",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
            parentElem.remove();
        },
        500: function (result) {
          alert("500 " + result.responseJSON.err);
        },
      },
    });
});


});
