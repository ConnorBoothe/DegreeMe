$(document).ready(function(){
    var slider = document.getElementById("priceSlider");

    // noUiSlider.create(slider, {
    //     start: 1,
    //     connect: true,
    //     range: {
    //         'min': 0,
    //         'max': 1
    //     }
    // });
// var setActive = false;
  //   $(slider).on("click", function(){
  //     alert("YO")
  //     if($(this).val() === 1){
  //       setActive = true;
  //       $(this).val(2)
  //     }
  //  })

    $(slider).on("change", function(){
      var value = false;
      if(parseInt($(this).val()) === 2) {
          value = true;
          // $(this).val(2);
      }
      else {
        // $(this).val(1);
      }
      payload = {
          value:value
      }
        $.ajax({
          url: "/setActive",
          type: 'POST',
          data: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json"
          }, statusCode: {
            202: function (result) {
            if(result.data.ActiveTutor == false){
              $(".active").text("Inactive");
              $(".active").removeClass("text-success");
              $(".active").addClass("text-danger");
            }
            else{
              $(".active").text("Active");
              $(".active").addClass("text-success");
              $(".active").removeClass("text-danger");
            }
            },
            500: function (result) {
              alert("500");
            },
          },
        });
  })
});