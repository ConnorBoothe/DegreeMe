$(document).ready(function(){
    $("#hourlyRate").maskMoney();
    $(".bid-input").maskMoney();
    $(".askingPrice").maskMoney();
    $(".timeline").on("focus", ".bid-input", function(){
        $(this).maskMoney();
    })
})