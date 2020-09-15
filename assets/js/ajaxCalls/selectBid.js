$(document).ready(function(){
    var stripeAccount = '';
    $("input[name='bidder']").on("click", function(){
        $("input[name='handle']").val($(this).val());
        stripeAccount = $(this).parent().next().val();
        $("input[name='StripeId']").val($(this).parent().next().val());
        $("input[name='price']").val(($(this).parent().prev().children().eq(0).text().trim().substring(1)));
        var stripe = Stripe('pk_test_89vfyOdmTWo09jkpoyAnRy1l00ll36NLGn', { stripeAccount: stripeAccount }); // Your Publishable Key
        var elements = stripe.elements();
        var card = elements.create('card');
        card.mount('#card-element');
        card.on('change', ({ error }) => {
          const displayError = document.getElementById('card-errors');
          if (error) {
            displayError.textContent = error.message;
          } else {
            displayError.textContent = '';
          }
        });
        $(".payment-container").show();
        $(".bids-header1").show();
        $(".stripe-form").on("submit", function(e){
           e.preventDefault();
         payload = {
           handle: $("input[name='handle']").val(),
           price:$("input[name='price']").val(),
           timelineDate: $("input[name='timelineDate']").val(),
           timelineId: $("input[name='timelineId']").val(), 
           dueDate: $("input[name='dueDate']").val(),
           stripeId:$("input[name='stripeId']").val(),
           bidId:$("input[name='bidId']").val(),
           description:$("input[name='description']").val(),
       }
        //post route to handle help request payments
       $.ajax({
         url: "/bids/chargeHelp",
         type: 'POST',
         data: JSON.stringify(payload),
         headers: {
           "Content-Type": "application/json"
         }, statusCode: {
           202: function (result) {
             $(".overlay").show();
             $(".payment-processing-container").show();
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
                    $(".payment-status").text("Payment Success");
                    document.location.href = "/messages?messageId="+result.threadId;
                   }
                   else{
                    $(".payment-status").text("Payment Error");
                   }
                 
               }
             });
           },
           500: function (result) {
             alert("500 " + result.responseJSON.err);
           },
         },
       });
      
        })
      })
      
     
  


})
