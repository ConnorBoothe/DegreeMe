$(document).ready(function(){
    $("#hourlyRate").maskMoney();
    $(".bid-input").maskMoney();
    $("#showNotifications").on("focus", ".add-tutoring-input1", function(){
        $(this).maskMoney();
    })
    $(".add-tutoring-input1").on("focus", function(){
        $(this).maskMoney();
    })
    $(".timeline").on("focus", ".bid-input", function(){
        $(this).maskMoney();
    })
})