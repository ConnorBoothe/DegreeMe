// function base64ImageToBlob(str) {
//   // extract content type and base64 payload from original string
//   var pos = str.indexOf(';base64,');
//   console.log(pos)
//   var type = str.substring(5, pos);
//   var b64 = str.substr(pos + 8);

//   // decode base64
//   var imageContent = atob(b64);
// console.log(imageContent)
//   // create an ArrayBuffer and a view (as unsigned 8-bit)
//   var buffer = new ArrayBuffer(imageContent.length);
//   var view = new Uint8Array(buffer);

//   // fill the view, using the decoded base64
//   for(var n = 0; n < imageContent.length; n++) {
//     view[n] = imageContent.charCodeAt(n);
//   }

//   // convert ArrayBuffer to Blob
//   var blob = new Blob([buffer], { type: type });

//   return blob;
// }
// function handleImageUpload(event) {
 
//   var imageFile = event.target.files[0];
//   console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
//   console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
 
//   var options = {
//     maxSizeMB: 1,
//     maxWidthOrHeight: 1920,
//     useWebWorker: true
//   }
//   imageCompression(imageFile, options)
//     .then(function (compressedFile) {
//       console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
//       console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
 
//       return uploadToServer(compressedFile); // write your own logic
//     })
//     .catch(function (error) {
//       console.log(error.message);
//     });
// }
// $(document).ready(function(){
//   var input = $('.img-secondary-wrapper.upload');
//   //  var firebaseConfig = {
//   //   apiKey: "AIzaSyCdNXC20rfZy4WU_Yo0r1_jqurajcevaI0",
//   //   authDomain: "degreeme-bd5c7.firebaseapp.com",
//   //   databaseURL: "https://degreeme-bd5c7.firebaseio.com",
//   //   projectId: "degreeme-bd5c7",
//   //   storageBucket: "degreeme-bd5c7.appspot.com",
//   //   messagingSenderId: "52205869765",
//   //   appId: "1:52205869765:web:b577285fdc02f989616eac",
//   //   measurementId: "G-W912PS5JG0"
//   // };

//   // // Initialize Firebase
//   // firebase.initializeApp(firebaseConfig);

//   $(".upload-result").on("click", function(e){
//     alert("YO")
//     e.preventDefault();
//     $(".upload").on("change", function(){
//       alert("YO")
//     })
//     // var blob = URL.createObjectURL(new Blob([image] , {type:'text/plain'}));
//     // var storageRef = firebase.storage().ref("userImages/"+$("input[name='handle']").val());
//     // console.log($(".imagebase64").val())
//     // var image = base64ImageToBlob($(".imagebase64").val());
//     // // console.log(image)
//     // var metadata = {
//     //   contentType: 'image/jpeg',
//     // };
    
//     // var task = storageRef.put(image, metadata);
//     // task.on("state_changed", function(){
//     //  function error(error){
//     //   alert(error);
//     //  }
//     // })
// })
// })