
function createProgressTabs(result) {
    const progress = Array.from($('.progress-container .progress'));
    var currentIndex = 0;
    var nextIndex = 0;
    const playNext = (e) => {
     
      const current = e && e.target;
      let next;
      if(currentIndex == 0){
        progress[currentIndex].classList.add("active")
        currentIndex++;
      }
      else{

        console.log("Else running")
        progress[currentIndex-1].classList.remove("active")
        progress[currentIndex-1].classList.add("passed")
         progress[currentIndex].classList.add("active")
        // progress[currentIndex+1].classList.add("active")
        createStory(currentIndex, result)
        currentIndex++;
        if (currentIndex > progress.length) {
          $(".story-container").hide();
          $(".overlay").hide();

        }
      }
        // currentIndex++;
        if (currentIndex < progress.length) {
          next = progress[currentIndex+1];
        }
       
      $(".right-div").unbind().on("click", function(){
          progress[currentIndex-1].classList.remove("active")
          progress[currentIndex-1].classList.add("passed")
          progress[currentIndex].classList.add("active")
          createStory(currentIndex, result)
          currentIndex++;
      })
      $(".left-div").unbind().on("click", function(){
         //make the previous progress bar active
         $(this).css({opacity: "0.2"})
         setTimeout(()=>{
          $(this).css({opacity: "0"})
         },100)
         progress[currentIndex-2].classList.add("active")
         progress[currentIndex-1].classList.remove("active")
         progress[currentIndex-1].classList.remove("passed")
        //move index back 1 (have to subtract to to counteract the increment)
        currentIndex = currentIndex-2;
       
        
        //create story
        createStory(currentIndex, result)
        //increment current Index for next iteration
        currentIndex++;
      })
      //restart the loop
      // if (currentIndex > progress.length) {
      //   $(".story-container").hide();
      //   $(".overlay").hide();
      //   // progress.map((el) => {
      //   //   el.classList.remove('active');
      //   //   el.classList.remove('passed');
      //   //   currentIndex = 0;
      //   // })
      //   // next = progress[0];
      // } 
      
    }
    
    
  
    progress.map(el => el.addEventListener("animationend", playNext, false));
    createStory(0, result)
    playNext();
}


//direction == 0 , go back
//direction ==1, go forward
function createNewSlide(i, stories){
   
    //  console.log(i)
    $(".story-img-div").html("<img class='story-img' src='"+stories[i].image+"'/>");
    $(".story-text-div").html("<p>"+stories[i].text+"</p>")  
}
//format progressBars
function formatProgressBars(result, i) { 
    //if i is 0, set up progress bar
    
        var progressBarHTML = "";
        //create story progress bar
        for(x in result.stories){
            progressBarHTML += '<div style="animation-duration: '+(result.stories[x].duration-0.5)+'s" class="progress"></div>';
        }
        $(".progress-container").html(progressBarHTML)
        $(".story-img-div").html("<img class='story-img' src='"+result.stories[i].image+"'/>");
        $(".story-text-div").html("<p>"+result.stories[i].text+"</p>")  //  your code here
        $(".story-container").show();
        createProgressTabs(result, i)
  }
  function createStory(iterator, result){
      const storyArray = result.stories;
      if(iterator < result.stories.length) {
        createNewSlide(iterator, result.stories)
        $("input[name='iterator']").val(iterator)
    }
    else {
      // clearTimeout(interval)
    }
      // $(".right-div").unbind().on("click", function(){
      //     // clearTimeout(interval);
      //     if(iterator < result.stories.length-1) {
      //       iterator++;
      //       $("input[name='iterator']").val(iterator)
      //       console.log("I: " +iterator)
      //       createNewSlide(iterator, result.stories)
      //       $("input[name='iterator']").trigger('change');
      //     }
         
      // });
      // $(".left-div").unbind().on("click", function(){
      //   // clearTimeout(interval)
      //   if(iterator > 0) {
      //     iterator--;
      //     $("input[name='iterator']").val(iterator)
      //     createNewSlide(iterator, result.stories)
      //   }
      //   $("input[name='iterator']").trigger('change');
      // });
      
  
  }
$(document).ready(()=>{
    var stories;
    
    //hide story on overlay click or x button click
    $(".overlay").on("click",()=>{
        $(".overlay").hide();
        $(".story-wrapper").hide();
        $(".story-img-div").html("");
        $(".story-text-div").html("");
    })
    $(".picX").on("click",()=>{
        $(".overlay").hide();
        $(".story-wrapper").hide();
        $(".story-img-div").html("");
        $(".story-text-div").html("");
    })
    //show story 
    $(".groupImg").on("click", ()=>{
        $(".overlay").show();
        $(".story-wrapper").show();
    })
    var groupId = window.location.href.split("/")[4];
    $(".groupImg").on("click", function(){
        $("input[name='iterator']").val(0)
        var iterator = 0;
        payload = {
            groupId:groupId
        }
            $.ajax({
                url: "/getStory",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json"
                }, statusCode: {
                  202: function (result) {
                    console.log(result.stories)
                 formatProgressBars(result, iterator);
                // $(".story-img-div").html("<img class='story-img' src='"+result.stories[iterator].image+"'/>");
                // $(".story-text-div").html("<p>"+result.stories[iterator].text+"</p>") 
                // if(iterator == 0 ) {
                //   createStory(iterator, result)
                // }
                // $("input[name='iterator']").on("change", function(){
                //   createStory($(this).val(), result)
                // })
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              }); 
    })

    
})