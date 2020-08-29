$(document).ready(function(){
    $.ajax({
        url: '/API/Listings' ,
        method: 'GET',
        error:function(err,str){
        }
        }).done(function(res) {       
            
    });

})
