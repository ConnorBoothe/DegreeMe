$('[data-toggle="tooltip"]').tooltip();   
$(document).ready(()=>{
  $('.go-home').tooltip();   
  
  $('.mobile-actions1').tooltip({
    selector: ".group-story-image1",
    container: "body"
  })
  
  $('#recentNotifications').tooltip({
    selector: ".startConversation",
    container: "body"
  })
  $('.add-story-wrapper').tooltip({
    selector: ".link",
    container: "body"
  })
  $('.timeline').tooltip({
    selector: ".room-item",
    container: "body"
  })
 
  $('.myCourse-container').tooltip({
    selector: ".myCoursesWrapper",
    container: "body"
  })
    $('.membersRightSideBar ').tooltip({
        selector: ".member-tooltip",
        container: "body"
      })
      $('.membersRightSideBar').tooltip({
        selector: ".inv-tooltip",
        container: "body"
      })
      $('.messageBlock').tooltip({
        selector: ".messageImg",
        container: "body"
      })
      
      $('.askQuestion-container ').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: "body"
      })
      $('.group-images-list').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: "body"
      })
      
      
})


