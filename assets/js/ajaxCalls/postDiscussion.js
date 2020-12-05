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
    $("#postQuestion").on("click", function(e){
        e.preventDefault();
        var course = $(".courseName");
        var message = $("#message");
        var filename = $(".askQuestion-file").val().replace(/C:\\fakepath\\/i, '')
        var storageRef = firebase.storage().ref("attachments/"+filename);
        var image ="";
        var image = $(".askQuestion-file")[0].files[0];
        // alert( message.val());
        //input validation
            if(message.val() == ""){
                message.css("border", "1px solid #dc3545")

            }
        else if(image != undefined) {
        storageRef.put(image)
        .then(function(){
            storageRef.getDownloadURL().then(function(url) {
                payload = {
                    message:message.val(),
                    course:course.text(),
                    image:url
                 }
                 $.ajax({
                     url: "/askQuestion",
                     type: 'POST',
                     data: JSON.stringify(payload),
                     headers: {
                     "Content-Type": "application/json"
                     }, statusCode: {
                     202: function (result) {
                         console.log(result)
                     },
                     500: function (result) {
                         alert("500 ");
                         console.log(result)
                     },
                     },
                 });
            })
        })
        }
        //post question without image
        else {
            payload = {
                message:message.val(),
                course:course.text(),
                image:"none"
             }
            $.ajax({
                url: "/askQuestion",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                "Content-Type": "application/json"
                }, statusCode: {
                202: function (result) {
                    console.log(result)
                    location.href = "/";                },
                500: function (result) {
                    alert("500 ");
                    console.log(result)
                },
                },
            });
        }
    })
})