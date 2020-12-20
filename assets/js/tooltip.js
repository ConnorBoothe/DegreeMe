$('[data-toggle="tooltip"]').tooltip();   
$(document).ready(()=>{
    $('.membersRightSideBar ').tooltip({
        selector: ".member-tooltip",
        container: "body"
      })
      $('.askQuestion-container ').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: "body"
      })
      
})


