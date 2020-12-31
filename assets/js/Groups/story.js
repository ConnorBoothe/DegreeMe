$(document).ready(()=>{
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
})