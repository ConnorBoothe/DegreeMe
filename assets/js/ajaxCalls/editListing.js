function validateEditInputFields(){
    var errors = false;
    if(parseInt($("#hourlyRate").val()) < 5){
        $("#hourlyRateTxt").text("$5 minimum")
        $("#hourlyRate").parent().parent().css("border-bottom", "2px solid #dc3545");
        errors = true;
    }
    if(parseInt($("#duration").val()) < 1){
        $("#duration").parent().parent().css("border-bottom", "2px solid #dc3545");
        errors = true;
    }
    if(!$.session.get("schedule0") && !$.session.get("schedule1") && !$.session.get("schedule2") && !$.session.get("schedule3")){
      $(".scheduleErr").show();
      errors = true;
  }
    if(errors){
        $(".listingErrMsg").text("Errors exist in the form. Correct them and re-submit")
    }
    return errors;
}

$(document).ready(function(){
  $.session.remove('schedule0');
  $.session.remove('schedule1');
  $.session.remove('schedule2');
  $.session.remove('schedule3');
  if($(".priceSlider").val() === "2"){
    $(".blocker").show();
  }
   $(".saveChanges").on("click",  function(e){
       e.preventDefault();
       var errors = validateEditInputFields();
       if(!errors){
        payload = {
            price:$("#hourlyRate").val(),
            duration: $("#duration").val(),
            listingId:$("#listingId").val(),
            Schedule:createSchedule(), 
            expirationDate:createExpiration(parseInt($(".expiration").val())*7)
        }
        $.ajax({
            url: "/editListing",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                  listingAdded();
              },
              500: function (result) {
                alert("500 " + result.responseJSON.err);
              },
            },
          });
       }
      
       
   })

   $(".priceSlider").on("change", function(){
    if($(this).val() == "1"){
        $(".active").text("Active");
        $(".active").css("color", "#28a745");
        $(".createListingDiv").css({
            opacity: 1
        });
        $(".blocker1").hide();
    }
    else{
        $(".active").text("Disabled");
        $(".active").css("color", "#dc3545");
        $(".createListingDiv").css({
            opacity: .7
        });
        $(".blocker1").show();
    }
    $(".priceSlider").attr("disabled", true);
    payload = {
        action:$(".active").text(),
        listingId:$("#listingId").val()

    }
    $.ajax({
        url: "/"+payload.action+"Listing",
        type: 'POST',
        data: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }, statusCode: {
          202: function (result) {
            $(".priceSlider").attr("disabled", false);
          },
          500: function (result) {
            alert("500 " + result.responseJSON.err);
          },
        },
      });
})
})