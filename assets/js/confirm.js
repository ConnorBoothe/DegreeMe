var style = {
  base: {
    color: "white",
    backgroundColor:"#1d1d1d"
  }
};
var error="";
$(document).ready(function () {
  
  document.getElementById('submit').disabled = true;
  $(".dateTimeText").on("click", function(){
    $(this).css("border", "none");
  })
  var stripe = Stripe('pk_test_89vfyOdmTWo09jkpoyAnRy1l00ll36NLGn', { stripeAccount: $('input[name="StripeId"]')[0].value }); // Your Publishable Key

  var elements = stripe.elements();
  var card = elements.create('card', { style: style });
  card.mount('#card-element');
  card.on('change',function(event){
    const displayError = document.getElementById('card-errors');
    if(!event.complete){
      document.getElementById('submit').disabled = true;
    }
    if(event.complete) {
      document.getElementById('submit').disabled = false;
      displayError.textContent = '';
    }
    if(event.error){
      document.getElementById('submit').disabled = true;
      console.log(event.error)
      displayError.textContent = event.error.message;
    }
  })
  var form = document.getElementById('stripe-payment-form');
  $(".stripe-submit").on('click', function (ev) {
    ev.preventDefault();
    document.getElementById('submit').disabled = true;
    $(".stripe-submit").text("Checking out...")
    if($(".dateTimeText").text() === "Select Date/Time"){
      $(".date-container").css("border", "1px solid #dc3545");
      $(".toast-body").text("Payment not processed: No time selected.")
      $(".stripe-submit").text("Checkout")

      $('.toast').toast("show",{
          autohide: false
      });
    }
    else{
      document.getElementById('submit').disabled = true;
    //get intent ajax call
    payload = {
      tutorSessionId: $('input[name="tutorSessionId"]')[0].value,
      timeSlot: $('input[name="timeSlot"]')[0].value,
      timeId: $(".timeId").val(),
      sessionNotes:$('textarea[name="notes"]')[0].value,
      Name:$('input[name="name"]')[0].value,
      Image:$('input[name="image"]')[0].value
    }
    $.ajax({
      url: "/charge",
      type: 'POST',
      data: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }, statusCode: {
        202: function (result) {
          // $(".overlay").show();
          $(".payment-processing-container").show();
          $(".stripe-submit").text("Checking out...")
          //alert( "202" );
          //after intent ajax call (need secret and tutor StripeId)
          stripe.confirmCardPayment(result.secret, {
            payment_method: {
              card: card,
              billing_details: {
              name: result.student
              }
            }
          }).then(function (result1) {
            if (result1.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.log(result1.error.message);
            } else {
              // The payment has been processed!
              if (result1.paymentIntent.status === 'requires_capture') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                console.log(result1.paymentIntent.status);
                $(".payment-status").text("Payment Success");
                document.location.href = "/meeting/"+result.meetingId;
              }
            }
          });
        },
        500: function (result) {

          alert("500 " + result.responseJSON.err);
          document.getElementById('submit').disabled = false;
         
        },
      },
    });
    }
  })

})
