$('[data-toggle="tooltip"]').tooltip();   
$(document).ready(()=>{
    $('.membersRightSideBar ').tooltip({
        selector: ".member-tooltip",
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


