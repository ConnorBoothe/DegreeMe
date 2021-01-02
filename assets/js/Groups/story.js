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

function getStoryAjaxRequest(groupId, storyNumber){
    payload = {
        groupId:groupId,
        storyNumber:storyNumber
    }
        $.ajax({
            url: "/getStory",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(function () {
                 $(".story-img-div").html("<img class='story-img' src='"+result.story.image+"'/>");
                 $(".story-text-div").html("<p>"+result.story.text+"</p>")
                })
                setTimeout(function(){

                },parseInt(result.story.duration)*1000)
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
}
function groupStory(groupId, duration) {
    var storyNumber = 0;
        getStoryAjaxRequest(groupId, storyNumber);
        storyNumber++;
        setTimeout(function(){

        }, duration)
    
   

}
function iterateLoop(i, stories) { 

    if(i == 0) { 
        var progressBarHTML = "";
        for(x in stories){
            progressBarHTML += '<div style="animation-duration: '+(stories[x].duration-0.5)+'s" class="progress"></div>';
        }
        $(".progress-container").html(progressBarHTML)
        $(".story-container").show();
        $(".story-img-div").html("<img class='story-img' src='"+stories[i].image+"'/>");
        $(".story-text-div").html("<p>"+stories[i].text+"</p>")  //  your code here
        i++;      
        iterateLoop(i, stories);                   
    }    
    setTimeout(function() {   
        $(".story-img-div").html("<img class='story-img' src='"+stories[i].image+"'/>");
        $(".story-text-div").html("<p>"+stories[i].text+"</p>")  //  your code here
      i++;                    
      if (i < stories.length) {          
        iterateLoop(i, stories);             
      }
      else{
          setTimeout(function(){
            $(".story-container").fadeOut();
            $(".overlay").fadeOut();
          },parseInt(stories[i-1].duration)*1000);
          
      }                       
    }, parseInt(stories[i].duration)*1000)
  }
$(document).ready(()=>{
    var stories;
    //hide story on overlay click or x button click
    $(".overlay").on("click",()=>{
        $(".overlay").hide();
        $(".story-wrapper").hide();
    })
    $(".picX").on("click",()=>{
        $(".overlay").hide();
        $(".story-wrapper").hide();
    })
    //show story 
    $(".groupImg").on("click", ()=>{
        $(".overlay").show();
        $(".story-wrapper").show();
    })

    //ajax GET request to grab group stories
    var groupId = window.location.href.split("/")[4];
    $(".groupImg").on("click", function(){
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
                    $(function () {
                    
                    })
                    var iterator = 0;
                   iterateLoop(iterator, result.stories);
                   createProgressTabs();
                    
                  },
                  500: function (result) {
                    alert("500 " + result.responseJSON.err);
                  },
                },
              });
              
    })
    
})