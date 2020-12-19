$(document).ready(function(){
    var threadId = $(".threadId").val();
    $.ajax({
        url: '/threadImages/'+ threadId ,
        method: 'GET',
        error:function(err,str){
            alert(err)
        }
        }).done(function(res) {  
            var imageGrid = '<div class="row">';
            console.log(res.images)
            for(x in res.images) {
                if(res.images[x].content.includes(".pdf")){
                    imageGrid += '<div class="grid-img-container"><a target="_blank" href="'+res.images[x].content+'"><iframe class="grid-image" src='+res.images[x].content+'></iframe></a></div>';
                }
                else{
                    imageGrid += '<div class="grid-img-container"><a target="_blank" href="'+res.images[x].content+'"><img class="grid-image" src='+res.images[x].content+'/></a></div>';
                }
            }
            imageGrid += '</div><p class="text-center seeAllFiles"><a>SEE ALL FILES</a></p>';
            $(".thread-images-container .container").html(imageGrid)
            // for(x in res.images){
            //     members += 
            //     '<div class="messageHandle">'+
            //        '<a href="/user/'+res.members[x][0]+'">'+
            //             '<div class="online"></div>'+
            //             '<img class="messageSideBarImg" src="'+res.members[x][1]+'" />'+
            //             '<span class="userHandleTxt">'+res.members[x][0]+'</span>'+
            //         '</a>'+
            //     '</div>';
            // }
            // $(".messageHandle-container").append(members);
        });
})