function createCroppie(viewportWidth, viewportHeight, boundaryWidth,
   boundaryHeight, shape) {
  $uploadCrop = $('.upload-demo').croppie({
          viewport: {
            width: viewportWidth,
            height: viewportHeight,
            type: shape,
          },
          boundary: {
            width: boundaryWidth,
            height: boundaryHeight
          },
          //  url: defaultImg,
        });
  }
  function resizeCroppie(viewportWidth, viewportHeight, boundaryWidth,
    boundaryHeight, shape) {
    $('.upload-demo').croppie('destroy');
    createCroppie(viewportWidth, viewportHeight, boundaryWidth,
    boundaryHeight, shape);
    }
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {

      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
  for (var n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n);
  }

  // convert ArrayBuffer to Blob
  var blob = new Blob([buffer], { type: type });

  return blob;
}
function handleImageUpload(event) {

  var imageFile = event.target.files[0];

  var options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  imageCompression(imageFile, options)
    .then(function (compressedFile) {

      return uploadToServer(compressedFile); // write your own logic
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
$(document).ready(function () {
  var type = "banner";
  //show image cropper on Groups page for banner image
  $(".changeBanner-btn").on("click", () => {
    $(".overlay").fadeIn();
    $(".img-upload-container").fadeIn();
  })
  $("#imgInp").change(function () {
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
  if (location == "Group") {
// resizeCroppie(800, 150, 'rectangle', 320   )
    $uploadCrop = $('.upload-demo').croppie({
      viewport: {
        width: 800,
        height: 150,
        type: 'rectangle',
      },
      boundary: {
        width: 320,
        height: 320
      },
      //  url: defaultImg,
    });
    
    $(".openImageEditor").on("click", function () {
      if ($(this).text() == "Change Banner") {
        type = "banner";
       $uploadCrop = $('.upload-demo').croppie({
          viewport: {
            width: 800,
            height: 150,
            type: 'rectangle',
          },
          boundary: {
            width: 320,
            height: 320
          },
          //  url: defaultImg,
        });
        $('.cr-slider').attr({'min':.5, 'max':2});
        $uploadCrop.croppie('bind', defaultImg).then(function () {
          $uploadCrop.croppie('setZoom', '.8');
        });
      }
      else if ($(this).text() == "Post to Story") {
        type = "story";  
        $uploadCrop = $('.content-container-add-story').croppie({
          viewport: {
            width: 500,
            height: 700,
            type: 'rectangle',
          },
          boundary: {
            width: 320,
            height: 320
          },
          url: defaultImg,
        });
        // $('.cr-slider').attr({'min':.5, 'max':2});
        $uploadCrop.croppie('bind', defaultImg).then(function () {
          // $uploadCrop.croppie('setZoom', '.8');
        });
      }


    })
  }
  else if (location == "group-settings") {

    // resizeCroppie(800, 150, 'rectangle', 320   )
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
          //  url: defaultImg,
        });
      }
  else {

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
  }


  $('.cr-slider').attr({ 'min': .5, 'max': 2 });
  $uploadCrop.croppie('bind', defaultImg).then(function () {
    $uploadCrop.croppie('setZoom', '.8');
  });
  // $(".cr-image").attr("src", $(".profile-img").attr("src"));
  $(".img-btn").on("click", function () {
    if (location === "user") {
      $(".overlay").show();
      $(".img-upload-container").show();
    }
    else if(location === "group-settings") {
      $(".overlay").show();
      $(".img-upload-container").show();
    }
    else {
      if (window.innerWidth > 1000) {
        if ($(".handle").eq(0).val() === "" || $(".handleTxt").text() == "Username is taken") {
          $(".imgTxt").text("Enter a unique username before uploading an image.");
        }
        else {
          $(".overlay").show();
          $(".img-upload-container").show();
        }
      }
      else {
        if ($(".handle").eq(1).val() === "" || $(".handleTxt").eq(1).text() == "Username is taken") {
          $(".imgTxt").text("Enter username before uploading an image.");
        }
        else {
          $(".overlay").show();
          $(".img-upload-container").show();
          $(".imgTxt").text("");
        }
      }
    }
  })
  $(".loginBtnSignUp").attr("disabled", true);
  $('.upload').on('change', function () {

    readFile(this);
    if (type == "story") {
      $(".content-container-add-story").show();
      $("input[name='hasImage']").val(true);
    }
  });
  $('.upload-result').on('click', function (ev) {
    $(".profile-uploading-image").show();
    $uploadCrop.croppie('result', {
      type: 'canvas',
      size: { width: 800 },
      format: 'jpg',
    }).then(function (resp) {
      $(".croppedImg").val(("src", resp));
      if (location === "user") {
        var storageRef = firebase.storage().ref("userImages/" + $(".userProfileHandle").eq(0).text().trim().substring(1));
        console.log("Storageref: " + storageRef)
        var image = base64ImageToBlob(resp);
        // console.log(image)
        var metadata = {
          contentType: 'image/jpeg',
        };
        var task = storageRef.put(image, metadata);
        task.on("state_changed", function () {
          function error(error) {
            alert(error);
          }
        })
        storageRef.getDownloadURL().then(function (url) {
          // Get the download URL for 'images/stars.jpg'
          // This can be inserted into an <img> tag
          // This can also be downloaded directly
          payload = {
            imgLink: url,
          }
          $.ajax({
            url: "/updateImageURL",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".editImg").attr("src", resp);
                $(".profile-uploading-image").text("Image Uploaded");
                $(".profile-uploading-image").removeClass("badge-warning");
                $(".profile-uploading-image").addClass("badge-success");
                setTimeout(function () {
                  $(".profile-uploading-image").fadeOut();
                }, 1000)
                updateProgressBar('#addImg');
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        }).catch(function (error) {
          // Handle any errors
        });
      }
      else if (location === "group-settings") {

        var storageRef = firebase.storage().ref("groupImages/"+$(".groupId").val()+".jpg");
        var image = base64ImageToBlob(resp);
        // console.log(image)
        var metadata = {
          contentType: 'image/jpeg',
        };
        var task = storageRef.put(image, metadata);
        task.on("state_changed", function () {
          function error(error) {
            alert(error);
          }
        })
        storageRef.getDownloadURL().then(function (url) {
          // Get the download URL for 'images/stars.jpg'
          // This can be inserted into an <img> tag
          // This can also be downloaded directly
          payload = {
            imgLink: url,
            groupId: $(".groupId").val()
          }
          $.ajax({
            url: "/updateGroupImage",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".groupImg").attr("src", resp);
                $(".profile-uploading-image").text("Image Uploaded");
                $(".profile-uploading-image").removeClass("badge-warning");
                $(".profile-uploading-image").addClass("badge-success");
                setTimeout(function () {
                  $(".profile-uploading-image").fadeOut();
                }, 1000)
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
        }).catch(function (error) {
          // Handle any errors
        });
      }
      else if (location === "Group") {
        var filename = $(".upload-file").val().replace(/C:\\fakepath\\/i, '')
        var storageRef = firebase.storage().ref("/groupImages/" + $(".groupName").text() + "/bannerImage/" + filename);
        var image = base64ImageToBlob(resp);
        // console.log(image)
        var metadata = {
          contentType: 'image/jpeg',
        };
        var task = storageRef.put(image, metadata);
        task.on("state_changed", function () {
          function error(error) {
            alert(error);
          }
          storageRef.getDownloadURL().then(function (url) {
            // Get the download URL for 'images/stars.jpg'
            // This can be inserted into an <img> tag
            // This can also be downloaded directly
            // $(".result1 .uploadingImg").text("Uploaded");
            // $(".imageURL").val(url)
            if (type == "banner") {
              $(".bannerImg").attr("src", resp);
              payload = {
                url: url,
                groupId: $("input[name='groupId']").val()
              }
              $.ajax({
                url: "/addBannerImage",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(function () {

                      $(".bannerSuccess").fadeIn();
                      setTimeout(() => {
                        $(".bannerSuccess").fadeOut();
                      }, 1500)
                    })

                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
            }

            // $(".imageUploaded").val(url)
            // $(".loginBtnSignUp").attr("disabled", false); 
            // $(".imgTryAgain").hide();
          }).catch(function (error) {
            console.log(error)
          });
        })

      }
      else {
        var storageRef = firebase.storage().ref("userImages/" + $("input[name='handle']").val());
        var image = base64ImageToBlob(resp);
        // console.log(image)
        var metadata = {
          contentType: 'image/jpeg',
        };
        var task = storageRef.put(image, metadata);
        task.on("state_changed", function () {
          function error(error) {
            alert(error);
          }
        })
        storageRef.getDownloadURL().then(function (url) {
          // Get the download URL for 'images/stars.jpg'
          // This can be inserted into an <img> tag
          // This can also be downloaded directly
          $(".result1 .uploadingImg").text("Uploaded");
          $(".imageURL").val(url)
          $(".imageUploaded").val(url)
          $(".loginBtnSignUp").attr("disabled", false);
          $(".imgTryAgain").hide();
        }).catch(function (error) {
          // Handle any errors
        });
      }
      // console.log(resp.replace(/^data:image\/[a-z]+;base64,/, ""))
      //if location == signUp, insert image
      if (window.location.href.toString().split("/")[3].includes("SignUp")) {
        $(".imgTryAgain").show();
        $(".result1").eq(1).html("<img class='userImage' name='userImage' src='" + resp + "'/><span class='uploadingImg text-light'></span>>");
        $(".result1").eq(0).html("<img class='userImage' name='userImage' src='" + resp + "'/><span class='uploadingImg text-light'></span>");
      }
      // }

      $(".croppedImg").val($('.imagebase64').val());
      $(".overlay").hide();
      $(".img-upload-container").hide();
    });

  });
  $(".picX").on("click", function () {
    $(".img-upload-container").hide();
    $(".overlay").hide();
  })
  $(".overlay").on("click", function () {
    $(".img-upload-container").hide();
    $(".overlay").hide();
    $(".img-upload-container").hide();
  })

  $(".add-story-btn").on("click", function () {

    var type = $("input[name='story-type']").val()
    if(type == "poll") {
      var containerOffsetTop = $(".story-modal").offset().top;
      var containerOffsetLeft = $(".story-modal").offset().left;
      var pollOffsetTop = $(".poll-container").offset().top - containerOffsetTop;
      var pollOffsetLeft = $(".poll-container").offset().left - containerOffsetLeft;
      if($("input[name='hasImage']").val() == "true") {
        $uploadCrop.croppie('result', {
          type: 'canvas',
          size: { width: 800 },
          format: 'jpg',
        }).then(function (resp) {
          var filename = $("#addImage").val().replace(/C:\\fakepath\\/i, '')
          var storageRef = firebase.storage().ref("/groupImages/" + $(".groupName").text() + "/storyImages/" + filename);
          var image = base64ImageToBlob(resp);
          var metadata = {
            contentType: 'image/jpeg',
          };
          storageRef.put(image, metadata)
          .then(function(snapshot){
            alert("Put finish")
            storageRef.getDownloadURL().then(function(url){
              payload = {  
                type:"poll",
                question: $("#poll-question").text(),
                option1: $(".poll-answer").eq(0).text(),
                option2:$(".poll-answer").eq(1).text(),
                groupId: $("input[name='groupId']").val(),
                pollPositionTop: pollOffsetTop,
                pollPositionLeft: pollOffsetLeft,
                duration: $(".duration-text").text(),
                backgroundColor: $(".add-story-btn").parent().css("background-color"),
                image:url
              }
              if($("input[name='hasLink']").val() == "true") {
                var linkOffsetTop = $(".link-wrapper").offset().top;
                var linkOffsetLeft = $(".link-wrapper").offset().left;
                var linkPositionTop = linkOffsetTop - containerOffsetTop;
                var linkPositionLeft = (linkOffsetLeft - containerOffsetLeft)
                linkPositionLeft += $(".http").width();
                payload.linkOffsetTop = linkPositionTop;
                payload.linkOffsetLeft = linkPositionLeft;
                payload.linkFontSize = $(".link").css("font-size");
                payload.link = $(".link").text();
              }
              if($("input[name='hasText']").val() == "true") {
                var textOffsetTop = $(".textBox-wrapper").offset().top;
                var textOffsetLeft = $(".textBox-wrapper").offset().left;
                var textPositionTop = textOffsetTop - containerOffsetTop;
                var textPositionLeft = textOffsetLeft - containerOffsetLeft;
                payload.textPositionTop = textPositionTop;
                payload.textPositionLeft = textPositionLeft;
                payload.text = $(".textBox").text();
                payload.textColor =  $(".textBox").css("color");
                payload.fontSize = $(".textBox").css("font-size");
              }
              $.ajax({
                url: "/addStory",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(function () {
                      $(".modal").modal("hide");
                      $(".bannerSuccess").text("Story successfully posted!")
                      $(".bannerSuccess").fadeIn();
                      setTimeout(() => {
                        $(".bannerSuccess").fadeOut();
                      }, 2500)
                    })
        
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
            })
          })
        })
      
      }
      else {
        payload = {  
          type:"poll",
          question: $("#poll-question").text(),
          option1: $(".poll-answer").eq(0).text(),
          option2:$(".poll-answer").eq(1).text(),
          groupId: $("input[name='groupId']").val(),
          pollPositionTop: pollOffsetTop,
          pollPositionLeft: pollOffsetLeft,
          duration: $(".duration-text").text(),
          backgroundColor: $(".add-story-btn").parent().css("background-color")
        }
        if($("input[name='hasLink']").val() == "true") {
          var linkOffsetTop = $(".link-wrapper").offset().top;
          var linkOffsetLeft = $(".link-wrapper").offset().left;
          var linkPositionTop = linkOffsetTop - containerOffsetTop;
          var linkPositionLeft = (linkOffsetLeft - containerOffsetLeft)
          linkPositionLeft += $(".http").width();
          payload.linkOffsetTop = linkPositionTop;
          payload.linkOffsetLeft = linkPositionLeft;
          payload.linkFontSize = $(".link").css("font-size");
          payload.link = $(".link").text();
        }
        if($("input[name='hasText']").val() == "true") {
          var textOffsetTop = $(".textBox-wrapper").offset().top;
          var textOffsetLeft = $(".textBox-wrapper").offset().left;
          var textPositionTop = textOffsetTop - containerOffsetTop;
          var textPositionLeft = textOffsetLeft - containerOffsetLeft;
          payload.textPositionTop = textPositionTop;
          payload.textPositionLeft = textPositionLeft;
          payload.text = $(".textBox").text();
          payload.textColor =  $(".textBox").css("color");
          payload.fontSize = $(".textBox").css("font-size");
        }
        $.ajax({
          url: "/addStory",
          type: 'POST',
          data: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json"
          }, statusCode: {
            202: function (result) {
              $(function () {
                $(".modal").modal("hide");
                $(".bannerSuccess").text("Story successfully posted!")
                $(".bannerSuccess").fadeIn();
                setTimeout(() => {
                  $(".bannerSuccess").fadeOut();
                }, 2500)
              })

            },
            500: function (result) {
              alert("500 " + result.responseJSON.err);
            },
          },
        });
      }
    }
    else if(type == "multiple") {
      var containerOffsetTop = $(".story-modal").offset().top;
      var containerOffsetLeft = $(".story-modal").offset().left;
      var multipleLeftPosition = $(".multiple-choice-container").offset().left - containerOffsetLeft;
      var multipleTopPosition = $(".multiple-choice-container").offset().top - containerOffsetTop;
      if($("input[name='hasImage']").val() == "true") {
        $uploadCrop.croppie('result', {
          type: 'canvas',
          size: { width: 800 },
          format: 'jpg',
        }).then(function (resp) {
          var filename = $("#addImage").val().replace(/C:\\fakepath\\/i, '')
          var storageRef = firebase.storage().ref("/groupImages/" + $(".groupName").text() + "/storyImages/" + filename);
          var image = base64ImageToBlob(resp);
          var metadata = {
            contentType: 'image/jpeg',
          };
          storageRef.put(image, metadata)
          .then(function(snapshot){
            alert("Put finish")
            storageRef.getDownloadURL().then(function(url){
              payload = {
                type:"multiple",
                question: $("#multiple-question").text(),
                option1: $(".answer-text").eq(0).text(),
                option2:$(".answer-text").eq(1).text(),
                option3: $(".answer-text").eq(2).text(),
                option4:$(".answer-text").eq(3).text(),
                groupId: $("input[name='groupId']").val(),
                duration: $(".duration-text").text(),
                backgroundColor: $(".add-story-btn").parent().css("background-color"),
                correct: $("input[name='correct']:checked").parent().prev().text(),
                multiplePositionTop:multipleTopPosition,
                multiplePositionLeft: multipleLeftPosition,
                image: url
        
              }
              if($("input[name='hasLink']").val() == "true") {
                var linkOffsetTop = $(".link-wrapper").offset().top;
                var linkOffsetLeft = $(".link-wrapper").offset().left;
                var linkPositionTop = linkOffsetTop - containerOffsetTop;
                var linkPositionLeft = linkOffsetLeft - containerOffsetLeft
                linkPositionLeft += $(".http").width();
                payload.linkOffsetTop = linkPositionTop;
                payload.linkOffsetLeft = linkPositionLeft;
                payload.linkFontSize = $(".link").css("font-size");
                payload.link = $(".link").text();
              }
              if($("input[name='hasText']").val() == "true") {
                var textOffsetTop = $(".textBox-wrapper").offset().top;
                var textOffsetLeft = $(".textBox-wrapper").offset().left;
                var textPositionTop = textOffsetTop - containerOffsetTop;
                var textPositionLeft = textOffsetLeft - containerOffsetLeft;
                payload.textPositionTop = textPositionTop;
                payload.textPositionLeft = textPositionLeft;
                payload.text = $(".textBox").text();
                payload.textColor =  $(".textBox").css("color");
                payload.fontSize = $(".textBox").css("font-size");
              }
              $.ajax({
                url: "/addStory",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    $(function () {
                      $(".modal").modal("hide");
                      $(".bannerSuccess").text("Story successfully posted!")
                      $(".bannerSuccess").fadeIn();
                      setTimeout(() => {
                        $(".bannerSuccess").fadeOut();
                      }, 2500)
                    })
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
            })
          })
        })
      }
      
    }
    //if no poll or multiple choice included
    else {
      if($("input[name='hasImage']").val() == "true") { 
        $uploadCrop.croppie('result', {
          type: 'canvas',
          size: { width: 800 },
          format: 'jpg',
        }).then(function (resp) {
          var filename = $("#addImage").val().replace(/C:\\fakepath\\/i, '')
          var storageRef = firebase.storage().ref("/groupImages/" + $(".groupName").text() + "/storyImages/" + filename);
          var image = base64ImageToBlob(resp);
          // console.log(image)
          var metadata = {
            contentType: 'image/jpeg',
          };
          storageRef.put(image, metadata)
          .then(function(snapshot){
            alert("Put finish")
            storageRef.getDownloadURL().then(function(url){
              payload = {
                type:"text",
                textColor: $(".textBox").css("color"),
                backgroundColor: $(".add-story-body").css("background-color"),
                groupId: $("input[name='groupId']").val(),
                duration: $(".duration-text").text(),
                image: url
              }
              if($("input[name='hasLink']").val() == "true") {
                //get position of link element
                var linkContainerOffsetTop = $(".story-modal").offset().top;
                var linkContainerOffsetLeft = $(".story-modal").offset().left;
                var linkOffsetTop = $(".link-wrapper").offset().top;
                var linkOffsetLeft = $(".link-wrapper").offset().left;
                var linkPositionTop = linkOffsetTop - linkContainerOffsetTop;
                var linkPositionLeft = (linkOffsetLeft - linkContainerOffsetLeft)
                 
                 linkPositionLeft += $(".http").width();
                 payload.link = $(".link").text();
                 payload.linkOffsetTop = linkPositionTop;
                 payload.linkOffsetLeft = linkPositionLeft;
                 payload.linkFontSize = $(".link").css("font-size");
               }
               if($("input[name='hasText']").val() == "true") {
                 //get position of the text element
                 var containerOffsetTop = $(".story-modal").offset().top;
                 var containerOffsetLeft = $(".story-modal").offset().left;
                 var textOffsetTop = $(".textBox-wrapper").offset().top;
                 var textOffsetLeft = $(".textBox-wrapper").offset().left;
                 var textPositionTop = textOffsetTop - containerOffsetTop;
                 var textPositionLeft = textOffsetLeft - containerOffsetLeft;
                 payload.textPositionTop = textPositionTop;
                 payload.textPositionLeft = textPositionLeft;
                 payload.text = $(".textBox").text();
                 payload.fontSize = $(".textBox").css("font-size");
               }
              $.ajax({
                url: "/addStory",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    console.log(result)
                    $(function () {
                      $(".modal").modal("hide");
                      $(".bannerSuccess").text("Story successfully posted!")
                      $(".bannerSuccess").fadeIn();
                      setTimeout(() => {
                        $(".bannerSuccess").fadeOut();
                      }, 2500)
                    })
        
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
            })
          });
      })
    }
      
    }
  })
})

