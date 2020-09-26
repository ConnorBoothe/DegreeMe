//add frontend validation to Create Seller Account
function validateDate(testdate) {
    var date_regex = /^\d{2}\/\d{2}\/\d{4}$/ ;
    return date_regex.test(testdate);
}
$(document).ready(function(e){
    $('#dob').mask("99/99/9999");
    $(".createSeller-submit").on("click", function(e){
        e.preventDefault()
        var submit = true;
        if($("#street_number").val() === ""){
            $("#street_number").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#locality").val() === "") {
            $("#locality").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#administrative_area_level_1").val() === "") {
            $("#administrative_area_level_1").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#postal_code").val() === "") {
            $("#postal_code").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#country").val() === "") {
            $("#country").css("border", "1px solid #dc3545")
            submit = false;
        }
    
        if($("#phone").val() === "") {
            $("#phone").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#ssn").val() === "") {
            $("#ssn").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#routNum").val() === "") {
            $("#routNum").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#accNum").val() === "") {
            $("#accNum").css("border", "1px solid #dc3545")
            submit = false;
        }
        if($("#dob").val() === "") {
            $("#dob").css("border", "1px solid #dc3545")
            submit = false;
        }
        if(!validateDate($("#dob").val())) {
            $("#dob").css("border", "1px solid #dc3545")
            submit = false;
        }
      
        if(submit){
            $(".payment-processing-container").show();
            $(".sellerAccount-form").submit();
        }
    })
})