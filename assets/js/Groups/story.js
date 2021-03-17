
function createProgressTabs(result) {
  const progress = Array.from($('.progress-container .progress'));
  var currentIndex = 0;
  $(".story-container").show();
  $(".overlay").show();
  const playNext = (e) => {
    if (currentIndex == 0) {
      progress[currentIndex].classList.add("active")
      currentIndex++;
    }
    else {
      if (currentIndex + 1 > progress.length) {
        currentIndex = 0;
        $(".story-container").hide();
        $(".overlay").hide();
      }
      else {
        progress[currentIndex - 1].classList.remove("active")
        progress[currentIndex - 1].classList.add("passed")
        progress[currentIndex].classList.add("active")
        // progress[currentIndex+1].classList.add("active")
        createStory(currentIndex, result)
        currentIndex++;
      }
    }

    $(".right-div").unbind().on("click", function () {
      if (currentIndex + 1 > progress.length) {
        currentIndex = 0;
        $(".story-container").hide();
        $(".overlay").hide();

      }
      else {

        progress[currentIndex - 1].classList.remove("active")
        progress[currentIndex - 1].classList.add("passed")
        progress[currentIndex].classList.add("active")
        createStory(currentIndex, result)
        currentIndex++;
      }

    })
    $(".left-div").unbind().on("click", function () {
      //make the previous progress bar active
      $(this).css({ opacity: "0.2" })
      setTimeout(() => {
        $(this).css({ opacity: "0" })
      }, 100)
      if (currentIndex - 2 < 0) {
        currentIndex = 0;
        progress[currentIndex].classList.remove("active")

        setTimeout(function () {
          progress[currentIndex - 1].classList.add("active")

        }, 10)
      }
      else {
        progress[currentIndex - 2].classList.add("active")
        progress[currentIndex - 1].classList.remove("active")
        progress[currentIndex - 1].classList.remove("passed")
        //move index back 1 (have to subtract to to counteract the increment)
        currentIndex = currentIndex - 2;
      }



      //create story
      createStory(currentIndex, result)
      //increment current Index for next iteration
      currentIndex++;
    })

  }

  progress.map(el => el.addEventListener("animationend", playNext, false));
  createStory(0, result)
  playNext();
}


//direction == 0 , go back
//direction ==1, go forward
function createNewSlide(i, stories) {
  $("input[name='storyId']").val(stories[i]._id)
  $(".group-story-image").attr("src", stories[i].userImg);
  $(".group-story-title-text").text(stories[i].userHandle);

  if (stories[i].backgroundColor != undefined) {
    $(".story-img-div").css("background-color", stories[i].backgroundColor)
  }
  else {
    $(".story-img-div").css("background-color", "#1f2024");
  }
  if (stories[i].poll[0]) {
    $(".story-text-div").html("");
    $("input[name='storyType']").val("poll")
    if (stories[i].image != undefined) {
      imgElem = "<img class='story-img' src='" + stories[i].image + "'/>";
    }
    payload = {
      storyId: stories[i]._id
    }
    $.ajax({
      url: "/hasResponded",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
          var poll_story = "";
          var textElem = "<p class='text-elem' style='";
          for (x in stories[i].text_styles) {
            textElem += " " + stories[i].text_styles[x];
          }
          textElem += "'>" + stories[i].text + "</p>";
          if (stories[i].link != undefined) {
            var linkElem = "<p class='link-elem' style='";
            for (x in stories[i].link_styles) {
              linkElem += " " + stories[i].link_styles[x];
            }
            //if link contains http
            if (stories[i].link.includes("http")) {
              linkElem += "'><a target='_blank' href='" + stories[i].link + "'>" + stories[i].link + "</a></p>";
            }
            else {
              linkElem += "'><a target='_blank' href='http://" + stories[i].link + "'>" + stories[i].link + "</a></p>";

            }
            if (stories[i].text != undefined) {
              poll_story += linkElem + textElem + imgElem;
            }
            else {
              poll_story += linkElem + imgElem;
            }

          }
          else if (stories[i].text != undefined) {
            poll_story += textElem + imgElem;

          }
          else {
            poll_story += imgElem;
          }
          if (result.hasResponded == true) {
            poll_story += "<div class='poll-story' style='";
            for (var j in stories[i].poll_styles) {
              poll_story += stories[i].poll_styles[j];
            }
            poll_story += "'><h3 class='text-light multiple-question'>" + stories[i].poll[0].question + "</h3>" +
              "<ul class='poll-options-list'>" +
              "<li><button disabled='true' class='story-option-item poll-answer poll-option1 lowerOpacity' id=''>" + stories[i].poll[0].options[0] + "</button><p class='percentage poll-text1'></p></li>" +
              "<li><button disabled='true' class='story-option-item poll-answer poll-option2 lowerOpacity' id=''>" + stories[i].poll[0].options[1] + "</button><p class='percentage poll-text2'></p></li>" +
              "</ul>" +
              "</div>";

            $(".story-img-div").html(poll_story);

            payload1 = {
              storyId: result.storyId,
              answer: result.answer
            }
            $.ajax({
              url: "/getPercentage",
              type: 'POST',
              data: JSON.stringify(payload1),
              headers: {
                "Content-Type": "application/json"
              }, statusCode: {
                202: function (result) {
                  $(".story-option-item").each((x) => {
                    if ($(".story-option-item").eq(x).text() == result.answer) {
                      if (x == 0) {
                        $(".story-option-item").eq(x).css({ color: "white", backgroundColor: "#6c62f0" });
                      }
                      else {
                        $(".story-option-item").eq(x).css({ color: "white", backgroundColor: "#28c10d" });
                      }
                      $(".percentage").eq(x).text(result.matchingPercentage + "%");
                      $(".percentage").eq(1 - x).text(result.otherPercentage + "%");

                    }
                  })
                  $(".percentage").show();
                  $(".percentage").animate({
                    fontSize: "32px"
                  }, 100);
                }
              }

            })
          }
          else {
            poll_story += "<div class='poll-story' style='";
            for (var j in stories[i].poll_styles) {
              poll_story += stories[i].poll_styles[j];
            }
            poll_story += "'><h3 class='text-light multiple-question'>" + stories[i].poll[0].question + "</h3>" +
              "<ul class='poll-options-list'>" +
              "<li><button class='story-option-item poll-answer poll-option1' id=''>" + stories[i].poll[0].options[0] + "</button><p class='percentage poll-text1'></p></li>" +
              "<li><button class='story-option-item poll-answer poll-option2' id=''>" + stories[i].poll[0].options[1] + "</button><p class='percentage poll-text2'></p></li>" +
              "</ul>" +
              "</div>";
            $(".story-img-div").html(poll_story)
          }
        }
      }
    })
  }
  else if (stories[i].multipleChoice[0]) {
    $("input[name='storyType']").val("multiple")
    var imgElem = "";
    if (stories[i].image != undefined) {
      imgElem = "<img class='story-img' src='" + stories[i].image + "'/>";
    }
    payload = {
      storyId: stories[i]._id
    }
    $.ajax({
      url: "/hasResponded",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
          if (result.hasResponded == true) {
            $(".story-text-div").html("")
            var multipleChoiceHTML = "";
            var textElem = "<p class='text-elem' style='";
            for (x in stories[i].text_styles) {
              textElem += " " + stories[i].text_styles[x];
            }
            textElem += "'>" + stories[i].text + "</p>";
            if (stories[i].link != undefined) {
              var linkElem = "<p class='link-elem' style='";
              for (x in stories[i].link_styles) {
                linkElem += " " + stories[i].link_styles[x];
              }
              //if link contains http
              if (stories[i].link.includes("http")) {
                linkElem += "'><a target='_blank' href='" + stories[i].link + "'>" + stories[i].link + "</a></p>";
              }
              else {
                linkElem += "'><a target='_blank' href='http://" + stories[i].link + "'>" + stories[i].link + "</a></p>";

              }
              if (stories[i].text != undefined) {
                multipleChoiceHTML += linkElem + textElem + imgElem;
              }
              else {
                multipleChoiceHTML += linkElem + imgElem;

              }
            }
            else if (stories[i].text != undefined) {
              multipleChoiceHTML += textElem;
            }
            multipleChoiceHTML +=
              "<div class='poll-story multiple-choice-list' style='";
            for (var x in stories[i].multiple_styles) {
              multipleChoiceHTML += stories[i].multiple_styles[x];
            }
            multipleChoiceHTML += "'><h3 class='text-light multiple-question'>" + stories[i].multipleChoice[0].question + "</h3>" +
              "<ul class='multiple-options-list'>";
            for (var x = 0; x < 4; x++) {
              if (stories[i].multipleChoice[0].options[x] == result.correct && result.correct == result.answer) {
                multipleChoiceHTML += "<li><button disabled='true' class='answer-container correct-answer-option-final'>" + stories[i].multipleChoice[0].options[x] + "</button></li>";
              }
              else if (stories[i].multipleChoice[0].options[x] == result.answer) {
                multipleChoiceHTML += "<li><button disabled='true' class='answer-container incorrect-answer-option-final'>" + stories[i].multipleChoice[0].options[x] + "</button></li>";

              }
              else if (stories[i].multipleChoice[0].options[x] == result.correct && (result.correct != result.answer)) {
                multipleChoiceHTML += "<li><button disabled='true' class='answer-container correct-answer-option'>" + stories[i].multipleChoice[0].options[x] + "</button></li>";
              }
              else {
                multipleChoiceHTML += "<li><button disabled='true' class='answer-container'>" + stories[i].multipleChoice[0].options[x] + "</button></li>";

              }
            }
            multipleChoiceHTML += "</ul></div>";
            $(".story-img-div").html(multipleChoiceHTML);
          }
          else {
            var multipleChoiceHTML = "";
            var textElem = "<p class='text-elem' style='";
            for (x in stories[i].text_styles) {
              textElem += " " + stories[i].text_styles[x];
            }
            textElem += "'>" + stories[i].text + "</p>";
            if (stories[i].link != undefined) {
              var linkElem = "<p class='link-elem' style='";
              for (x in stories[i].link_styles) {
                linkElem += " " + stories[i].link_styles[x];
              }
              //if link contains http
              if (stories[i].link.includes("http")) {
                linkElem += "'><a target='_blank' href='" + stories[i].link + "'>" + stories[i].link + "</a></p>";
              }
              else {
                linkElem += "'><a target='_blank' href='http://" + stories[i].link + "'>" + stories[i].link + "</a></p>";

              }
              if (stories[i].text != undefined) {
                multipleChoiceHTML += linkElem + textElem + imgElem;
              }
              else {
                multipleChoiceHTML += linkElem + imgElem;
              }
            }
            else if (stories[i].text != undefined) {
              multipleChoiceHTML += textElem + imgElem;

            }
            multipleChoiceHTML +=
              "<div class='poll-story multiple-choice-list' style='";
            for (var x in stories[i].multiple_styles) {
              multipleChoiceHTML += stories[i].multiple_styles[x];
            }
            multipleChoiceHTML += "'><h3 class='text-light multiple-question'>" + stories[i].multipleChoice[0].question + "</h3>" +
              "<ul class='multiple-options-list'>" +
              "<li><button class='answer-container'>" + stories[i].multipleChoice[0].options[0] + "</button></li>" +
              "<li><button class='answer-container'>" + stories[i].multipleChoice[0].options[1] + "</button></li>" +
              "<li><button class='answer-container'>" + stories[i].multipleChoice[0].options[2] + "</button></li>" +
              "<li><button class='answer-container'>" + stories[i].multipleChoice[0].options[3] + "</button></li>" +

              "</ul>" +
              "</div>";
            $(".story-img-div").html(multipleChoiceHTML);
          }
        }
      }
    })
  }
  //no poll or multiple choice
  else {
    $(".story-img-div").html("");
    $("input[name='storyType']").val("text")
    var imgElem = "";
    if (stories[i].image != undefined) {
      imgElem = "<img class='story-img' src='" + stories[i].image + "'/><p class='text-elem' style='";
    }
    var textElem = "<img class='story-img' src='" + stories[i].image + "'/><p class='text-elem' style='";

    for (x in stories[i].text_styles) {
      textElem += " " + stories[i].text_styles[x];
    }
    textElem += "'>" + stories[i].text + "</p>";
    if (stories[i].link != undefined) {
      var linkElem = "<p class='link-elem' style='";
      for (x in stories[i].link_styles) {
        linkElem += " " + stories[i].link_styles[x];
      }
      //if link contains http
      if (stories[i].link.includes("http")) {
        linkElem += "'><a target='_blank' href='" + stories[i].link + "'>" + stories[i].link + "</a></p>";
      }
      else {
        linkElem += "'><a target='_blank' href='http://" + stories[i].link + "'>" + stories[i].link + "</a></p>";

      }
      if (stories[i].text != undefined) {
        $(".story-img-div").html(linkElem + " " + textElem);
      }
      else {
        $(".story-img-div").html(linkElem + " " + imgElem);
      }
    }
    else if (stories[i].text != undefined) {
      $(".story-img-div").html(imgElem + " " + textElem);

    }
    else {
      $(".story-img-div").html(imgElem);
    }
  }
}
//format progressBars
function formatProgressBars(result, i) {
  //if i is 0, set up progress bar

  var progressBarHTML = "";
  //create story progress bar
  for (x in result.stories) {
    progressBarHTML += '<div style="animation-duration: ' + (result.stories[x].duration - 0.5) + 's" class="progress"></div>';
  }
  $(".progress-container").html(progressBarHTML)
  // $(".story-img-div").html("<img class='story-img' src='"+result.stories[i].image+"'/>");
  // $(".story-text-div").html("<p>"+result.stories[i].text+"</p>")  //  your code here
  createProgressTabs(result, i)
}
function createStory(iterator, result) {
  if (iterator < result.stories.length) {
    createNewSlide(iterator, result.stories)
    $("input[name='iterator']").val(iterator)
  }
}
$(document).ready(() => {
  //hide story on overlay click or x button click
  $(".overlay").on("click", () => {
    $(".overlay").hide();
    $(".story-wrapper").hide();
    $(".story-img-div").html("");
    $(".story-text-div").html("");
  })
  $(".picX").on("click", () => {
    $(".overlay").hide();
    $(".story-wrapper").hide();
    $(".story-img-div").html("");
    $(".story-text-div").html("");
  })
  //show story 

  var groupId = window.location.href.split("/")[4];
  $(".groupImg").on("click", function () {
    $(".overlay").show();
    $(".story-img-div").html('<div class="spinner-border" role="status">' +
      '<span class="sr-only"></span>' +
      '</div>')
    $(".story-wrapper").show();
    $("input[name='iterator']").val(0)
    var iterator = 0;
    payload = {
      groupId: groupId
    }
    $.ajax({
      url: "/getStory",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {

          formatProgressBars(result, iterator);
        },
        500: function (result) {
          alert("500 " + result.responseJSON.err);
        },
      },
    });
  })
  $(".mobile-actions1").on("click", ".group-story-image1", function () {
    $(".overlay").show();
    $(".story-img-div").html('<div class="spinner-border" role="status">' +
      '<span class="sr-only"></span>' +
      '</div>')
    $(".story-wrapper").show();
    $("input[name='iterator']").val(0)
    var iterator = 0;
    payload = {
      groupId: $(this).parent().prev().val()
    }
    $.ajax({
      url: "/getStory",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
          console.log(result)
          formatProgressBars(result, iterator);
        },
        500: function (result) {
          alert("500 " + result.responseJSON.err);
        },
      },
    });
  })

})