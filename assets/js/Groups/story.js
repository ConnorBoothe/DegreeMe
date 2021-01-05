
function createProgressTabs() {
    const progressContainer = document.querySelector('.progress-container');
    const progress = Array.from($('.progress-container .progress'));
    console.log(progress)
    const status = document.querySelector('.status');  
    
    const playNext = (e) => {
      const current = e && e.target;
      let next;
    
      if (current) {
        const currentIndex = progress.indexOf(current);
        if (currentIndex < progress.length) {
          next = progress[currentIndex+1];
        }
        current.classList.remove('active');
        current.classList.add('passed');
      } 
      
      if (!next) {
        progress.map((el) => {
          el.classList.remove('active');
          el.classList.remove('passed');
        })
        next = progress[0];
      } 
      next.classList.add('active'); 
      
    }
    
    const clickHandler = (e) => {
      const index = Math.floor(e.offsetX / (progressContainer.clientWidth/progress.length));
      status.innerText = "Clicked " + index;
    }
    
    progress.map(el => el.addEventListener("animationend", playNext, false));
    progressContainer.addEventListener("click", clickHandler, false);
    
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
function formatProgressBars(stories, i) { 
    //if i is 0, set up progress bar
    
        var progressBarHTML = "";
        //create story progress bar
        for(x in stories){
            progressBarHTML += '<div style="animation-duration: '+(stories[x].duration-0.5)+'s" class="progress"></div>';
        }
        $(".progress-container").html(progressBarHTML)
        $(".story-img-div").html("<img class='story-img' src='"+stories[i].image+"'/>");
        $(".story-text-div").html("<p>"+stories[i].text+"</p>")  //  your code here
        $(".story-container").show();
  }
  function createStory(iterator, result){
      const storyArray = result.stories;
    var interval = setTimeout(function() { 
                     
        if(iterator < result.stories.length-1) {
            $(".right-div").on("click", function(){
                clearTimeout(interval);
                // iterator++;
                console.log("I: " +iterator)
                result.stories.splice(iterator,1)
                createNewSlide(iterator, result.stories)
                return createStory(iterator, result)
            });
            $(".left-div").on("click", function(){
                clearTimeout(interval)
                iterator--;
                console.log("I: " +iterator)

                createNewSlide(iterator, result.stories)
                return createStory(iterator, result)
            });
            // iterator++;
            result.stories.splice(iterator,1)
            console.log("I: " +iterator)
            createNewSlide(iterator, result.stories)
            $("input[name='iterator']").val(iterator)
        }
    }, 3000);
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
    $("#iterator").on("change",function(){
        alert("CHANGED")

    });
    //ajax GET request to grab group stories
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
                 formatProgressBars(result.stories, iterator);
                $(".story-img-div").html("<img class='story-img' src='"+result.stories[iterator].image+"'/>");
                $(".story-text-div").html("<p>"+result.stories[iterator].text+"</p>") 
                createStory(iterator, result)
                    
                
                    // $(".right-div").on("click", function(){
                    //     clearInterval(firstTimeout)
                    //     // clearInterval(rightTimeout)
                        
                    //     if(iterator < result.stories.length-1) {
                    //         iterator++;
                    //         console.log(iterator)
                    //         createNewSlide(iterator, result.stories)
                    //         $("input[name='iterator']").val(iterator)
                            
                    //         // var rightTimeout = setInterval(function() {  
                    //         //     if(iterator < result.stories.length-1) {
                    //         //         iterator++;
                    //         //         createNewSlide(iterator, result.stories)
                    //         //         $("input[name='iterator']").val(iterator)
                    //         //         console.log("right interval fired")
                    //         //     }
                    //         // }, 3000);
                    //         //restart interval
                            
                    //     }
                    //     else{
                    //         $(".story-img-div").html("");
                    //         $(".story-text-div").html("")  
                    //          $(".story-container").hide();
                    //          $(".overlay").hide();
                    //          iterator = 0;
                    //     }
                    // })  
                    // $(".left-div").on("click", function(){
                    //     clearInterval(firstTimeout)
                    //     // clearInterval(leftTimeout)
                    //     if(iterator > 0) {
                    //         iterator--;
                    //         console.log("I: " +iterator)
                    //         createNewSlide(iterator, result.stories)
                    //         $("input[name='iterator']").val(iterator)
                    //         //restart interval
                    //         // var leftTimeout = setInterval(function() {  
                    //         //     if(iterator < result.stories.length-1) {
                    //         //         iterator++;
                    //         //         createNewSlide(iterator, result.stories)
                    //         //         $("input[name='iterator']").val(iterator)
                    //         //         console.log("left interval fired")
                    //         //     }
                    //         // }, 3000);
                           
                    //     }
                    // }) 
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              }); 
    })

    
})