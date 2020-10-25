$(document).ready(function(){
    var slider = document.getElementById("priceSlider");

    noUiSlider.create(slider, {
        start: 1,
        connect: true,
        range: {
            'min': 0,
            'max': 1
        }
    });

    $(slider).on("change", function(){
        var value = false;
        if(parseInt($(this).val()) === 2) {
            value = true;
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
              console.log(result.data.ActiveTutor)
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
                alert("500 ");
              },
            },
          });
    })
});