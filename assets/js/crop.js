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

        var storageRef = firebase.storage().ref("userImages/" + $(".userProfileHandle").text().trim().substring(1));
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
            url: "/updateImageURL ",
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
      else if(location == "group-settings") {
      
        
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
    if(type == "image"){
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
        var task = storageRef.put(image, metadata);
        task.on("state_changed", function () {
          function error(error) {
            alert(error);
          }
        })
        storageRef.getDownloadURL().then(function (url) {
          payload = {
            type:"image",
            url: url,
            groupId: $("input[name='groupId']").val(),
            text: $(".story-text-span").text(),
            duration: $(".story-duration").val()
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
        });
      })
    }
    else if(type == "poll") {
      payload = {
        type:"poll",
        question: $("#poll-question").text(),
        option1: $(".poll-answer").eq(0).text(),
        option2:$(".poll-answer").eq(1).text(),
        groupId: $("input[name='groupId']").val(),
        duration: $(".story-duration").val()
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
      console.log(payload)
    }
    else if(type == "multiple") {
      payload = {
        type:"multiple",
        question: $("#multiple-question").text(),
        option1: $(".answer-text").eq(0).text(),
        option2:$(".answer-text").eq(1).text(),
        option3: $(".answer-text").eq(2).text(),
        option4:$(".answer-text").eq(3).text(),
        groupId: $("input[name='groupId']").val(),
        duration: $(".story-duration").val(),
        correct: $("input[name='correct']:checked").parent().prev().text()
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
  })
})

