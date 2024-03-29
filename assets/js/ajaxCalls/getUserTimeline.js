function likedBoolean(handle, likeArray){
    if(likeArray.length > 0){
      for (var x = 0; x< likeArray.length; x++){
        if(likeArray[x].likerHandle === handle){
          return true;
        }
      }
    }
    return false;
  }

function formatBid(post, stripeId){
    var hasLiked = likedBoolean($(".userProfileName").text(), post.likers);
    if(post.BidOpen == true){
       
        var bid = '<input class="postId" name="postHandle" type="hidden" value="'+post.userHandle+'" />'+
        '<input class="postId" name="postId" type="hidden" value="'+post._id+'" />'+
        '<div class="timeline-container-helprequest">'+
        '<div class="postHeader">'+
            '<div class="postRight">'+
                '<p class="postDate">Due Date: <span class="text-light">'+displayDate(new Date(post.date))+'</span></p>';
        
                if (post.bids){
                     bid += '<p class="postBids badge badge-warning">'+post.bids.length +' Bids</p>';
                }
            bid+= '</div>';
            if(post.anonymous == false){
                bid += '<img class="timelinePost-Image" src="'+post.userImage+'" />'+
                '<p class="timelinePost-help"><a'+
                    'class="userNameLink" href="/user/'+post.userHandle+'">'+post.userName+
                    '</a>'+
                    '<p class="text-light helpReqTxt"><span class="badge badge-success">Help Request</span></p>'+
                '</div>'+
                '<p class="caption1">Task: '+post.caption+'</p>';
            }else{
                bid += '<img class="timelinePost-Image" src="../assets/img/favicon.png" />'+
                '<p class="timelinePost-username">Anonymous</p>'+
                '<p class="text-light helpReqTxt"><span class="badge badge-success">Help Request</span></p>'+
            '</div>'+
            '<p class="captionAnon">'+post.caption+'</p>';
            }
        bid += '<div class="helpRequestDetails">'+
            '<p class="text-light price">Asking Price: <span class="askPrice">$'+post.price+'</span>'+
                '<span class="badge badge-primary info-badge help-course">'+post.course+'</span>'+
            '</p>'+
         
        '</div>'+
        '<div class="postActions">';
                 if (hasLiked == false){
                    bid+= '<button class="like-button like-help">'+
                        '<span class="likeCount">'+post.likes+'</span>'+
                        '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                            'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                            '<path fill-rule="evenodd"'+
                                'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                        '</svg>'+
                    '</button>';
                    if(post.commentCount > 1){
                        bid += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                    }
                    else if(post.commentCount === 1){
                        bid += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                    }else{
                        bid += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                    }
                    }else{
                    bid+= '<button class="like-button like-help hasLiked">'+
                        '<span class="likeCount">'+post.likes+'</span>'+
                        '<svg class="bi bi-heart " width="0.8em" height="0.8em" viewBox="0 0 16 16"'+
                            'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                            '<path fill-rule="evenodd"'+
                                'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                        '</svg></button>';
                        if(post.commentCount > 1){
                            bid += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                        }
                        else if(post.commentCount === 1){
                            bid += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                        }else{
                            bid += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                        }
                    }
    
            if(stripeId != "none"){
                bid+= '<div class="placeBid">'+
                    '<div class="bid-input-container">'+
                        '<input type="hidden" class="timelineId" value="'+post._id+'"/>'+
                        '<input type="hidden" class="bidder" value="'+$.session.get("handle")+'"/>'+
                        '<input type="hidden" class="userId" value="'+$.session.get("userId")+'"/>'+
                        '<span class="help-dollar-text">$</span><input type="text" class="bid-input" placeholder="25" />'+
                        '<input type="hidden" class="stripeId" value="'+$.session.get("stripeId")+'"/>'+
                        
                    '</div>'+
                    '<button type="button" class="btn btn-primary respondBtn">Place Bid</button>'+
                '</div>';
            }
            else{
                 bid+= '<div class="placeBid">'+
                    '<a href="/MyFinances" type="button" class="addPaymentInfo">Add payment info to place a bid</a>'+
                '</div>';
    
            }
            bid+= "</div></div></div></div>";
            return bid;
    }
    else{
        return "";
    }
    
    
}
function formatTutorListing(post){
    var hasLiked = likedBoolean($(".userProfileName").text(), post.likers);
    var tutorListing = "";
    tutorListing +=
    '<input class="postId" name="postHandle" type="hidden" value="'+post.userHandle+'" />'+
    '<input class="postId" name="postId" type="hidden" value="'+post._id+'" />'+
        '<div class="timeline-container-status">'+
            '<div class="postHeader">'+
                '<img class="timelinePost-Image" src="'+post.userImage+'" />'+
                '<p class="timelinePost-username">'+post.userName+
                '<p class="postHandle"><a href="/user/'+post.userHandle+'">'+post.userHandle+'</a></p></p>'+
            '</div>'+
            '<p class="caption1">'+post.caption+'</p>'+
            '<p class="price-nonhelp badge badge-warning">Price: $'+post.price+'</p>'+
            '<a class="btn btn-primary view-timeline-btn" href="..'+post.url+'">View</a>'+
            '<div class="postActions">';
            if (hasLiked == false){
                tutorListing +=
                '<button class="like-button">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                                        'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                                        '<path fill-rule="evenodd"'+
                                            'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg>'+
                '</button>';
                if(post.commentCount > 1){
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
            }else{
                tutorListing +=
                '<button class="like-button hasLiked">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                                        'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                '<path fill-rule="evenodd"'+
                    'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    tutorListing += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }

            }
            tutorListing+= 
            '<p class="postDate nonhelp-date">'+displayDate(new Date(post.date))+'</p>'+
            "</div></div></div></div>" 
            return tutorListing;
}

function formatStudyGroup(post){
    var hasLiked = likedBoolean($(".userProfileName").eq(0).text(), post.likers);
    var studyGroup = "";
    studyGroup += 
    '<input class="postId" name="postHandle" type="hidden" value="'+post.userHandle+'" />'+
    '<input class="postId" name="postId" type="hidden" value="'+post._id+'" />'+
    '<div class="timeline-container-status">'+
        '<div class="postHeader">'+
            '<img class="timelinePost-Image" src="'+post.userImage+'" />'+
            '<p class="timelinePost-username">'+post.userName+'<span class="postHandle">'+
            '<p class="postHandle"><a href="/user/'+post.userHandle+'">'+post.userHandle+'</a></span></p></p>'+
        '</div>'+
        '<p class="caption1">'+post.caption+'<a href="/Group/'+post.url+'" class="btn btn-primary view-timeline-btn">View</a></p>';
        if(post.course){
            studyGroup +='<ul class="postDetailsList">'+
            '<li class="postDetailsItem">'+
                '<p class="badge badge-primary info-badge help-course">'+post.course+'</p>'+
            '</li>'+
            '<li class="postDetailsItem">'+
            '</li>'+
        '</ul>';
        }
        
        studyGroup += '<div class="postActions">';
        if (hasLiked == false){
            studyGroup +=
            '<button class="like-button">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
         }else{
            studyGroup +=
            '<button class="like-button hasLiked">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    studyGroup += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
            }
            studyGroup+=
            '<p class="postDate">'+displayDate(new Date(post.date))+'</p>'+
        '</div></div>';
        return studyGroup;
}
function formatStatusUpdate(post){
    var hasLiked = likedBoolean($(".userProfileName").text(), post.likers);
    var status = "";
    status += 
    '<input class="postId" name="postHandle" type="hidden" value="'+post.userHandle+'" />'+
    '<input class="postId" name="postId" type="hidden" value="'+post._id+'" />'+
    '<div class="timeline-container-status">'+
        '<div class="postHeader">'+
            '<img class="timelinePost-Image" src="'+post.userImage+'" />'+
            '<p class="timelinePost-username">'+post.userName+'<span class="postHandle">'+
            '<p class="postHandle"><a href="/user/'+post.userHandle+'">'+post.userHandle+'</a></span></p></p>'+
        '</div>'+
        '<p class="caption1">'+post.caption+'</p>'+
        '<div class="postActions">';
        if (hasLiked == false){
            status +=
            '<button class="like-button">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    status += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    status += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    status += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
         }else{
            status +=
            '<button class="like-button hasLiked">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    question += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
            }
            status+=
            '<p class="postDate">'+displayDate(new Date(post.date))+'</p>'+
        '<br></div></div>';
        return status;
}
function formatQuestion(post){
    var hasLiked = likedBoolean($(".userProfileName").text(), post.likers);
    var question = "";
    question += 
    '<input class="postId" name="postHandle" type="hidden" value="'+post.userHandle+'" />'+
    '<input class="postId" name="postId" type="hidden" value="'+post._id+'" />'+
    '<div class="timeline-container-status">'+
    '<div class="postHeader">'+
    '<a href="/user/'+post.userHandle+'"><img class="timelinePost-Image" src="'+post.userImage+'" /></a>'+
    '<p class="timelinePost-username"><a href="/user/'+post.userHandle+'" class="name-link">'+post.userName+'</a></p>'+
        '<div class="question-label-container">'+
        '<p class=" badge badge-info questionLabel">Question</p>'+
        '</div>'+
    '</div>';
    if(post.files.length > 0){
        if(post.files[0].file.includes(".pdf")){
            question += '<div>'+
                '<iframe class="pdf-iframe" src="'+post.files[0].file+'"></iframe>'+
            '</div>';
            
        } 
        else{
            question += '<div class="question-img-container">'+
                '<img class="question-img" src="'+post.files[0].file+'"/>'+
            '</div>';
       }
   
   
        question += '<p class="pdf-link"><a target="_blank" class="pdf-link" href="'+post.files[0].file+'">View Full Screen</a></p>';
    }
        question += '<p></p><p class="caption-status">'+post.caption+'</p>'+
        '<p class="hashtag"><a href="/course/'+post.course+'">#'+post.course.replace(/ /g, "")+'</a></p>'+
        '<div class="postActions">';

        if (hasLiked == false){
            question +=
            '<button class="like-button">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    question += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
         }else{
            question +=
            '<button class="like-button hasLiked">'+
                '<span class="likeCount">'+post.likes+'</span>'+
                '<svg class="bi bi-heart heartIcon" width="1em" height="1em" viewBox="0 0 16 16"'+
                    'fill="currentColor" xmlns="http://www.w3.org/2000/svg">'+
                    '<path fill-rule="evenodd"'+
                        'd="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />'+
                '</svg></button>';
                if(post.commentCount > 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comments</a>';
                }
                else if(post.commentCount === 1){
                    question += '<a href="/post/'+post._id+'" class="addComment">'+post.commentCount+' Comment</a>';
                }else{
                    question += '<a href="/post/'+post._id+'" class="addComment">Add Comment</a>';
                }
            }
            question+=

        '<p class="postDate1">'+displayDate(new Date(post.date))+'</p></div></div>';
        return question;
}
function createTimeline(nextTen, stripeId){
    var timeline = "";
    for(x in nextTen){
        if(nextTen[x].type === "Tutor Listing"){
            timeline += formatTutorListing(nextTen[x]);
        }
        else if(nextTen[x].type === "Study Group"){
            timeline += formatStudyGroup(nextTen[x]);
        }
        //add status update
        else if(nextTen[x].type === "Group Meetup"){
            timeline += formatStudyGroup(nextTen[x]);
        }
        else if(nextTen[x].type === "Question"){
            timeline += formatQuestion(nextTen[x]);
        }
    }
    return timeline;
}
$(document).ready(function(){
    $.session.set("blockNumber",1);
    $.session.set("end", false);
    $.session.set("loadMore",1);
    $.session.set("handle", $("input[name='handle']").val())
    $.session.set("stripeId",  $("input[name='stripeId']").val())
    $.session.set("userId",  $("input[name='userId']").val())
    $.session.set("tutor",  $("input[name='tutor']").val())
    //control menu on home page
    var type = "timeline";
    $(".mobile-actions ul li").unbind().on("click", function () {
        $(".mobile-actions ul li").removeClass("mobile-actions-bottom-border")
        $(this).addClass("mobile-actions-bottom-border")
        if ($(this).attr("class").split(" ")[0] == "findATutor") {
            type = "tutor";
            getFirstTutorRooms()
    
        }
        else if ($(this).attr("class").split(" ")[0] == "recentActivity") {
            $(".timelineItemsLoaded").text("");
            $.session.set("blockNumber", 0);
            type = "timeline";
            payload = {
                block: parseInt($.session.get("loadMore")),
                blockNum: parseInt($.session.get("blockNumber"))
            }

            $.ajax({
                async: true,
                url: "/loadMore",
                type: 'POST',
                data: JSON.stringify(payload),
                headers: {
                    "Content-Type": "application/json"
                }, statusCode: {
                    202: function (result) {
                        $(".spinner-container").fadeOut();
                        $(".timeline-wrapper").html(createTimeline(result.newItems, result.stripeId));
                        if (result.newItems.length < 5 && $.session.get("end") == "false") {
                            $.session.set("end", true);
                            $(".timeline").append('<p class="timelineItemsLoaded">All items loaded</p>');
                        }
                    },
                    500: function (result) {
                        alert("500");
                    },
                },
            });
        }
        else if ($(this).attr("class").split(" ")[0] == "askQuestion") {
           type = "question";
            $(".timeline-wrapper").html('<div class="recentActivity-title">' +
                '</div>' +
                '<div class="askQuestion-container"><span class="text-light"><textarea class="askQuestion-textarea" placeholder="Ask the DegreeMe community.."/></textarea></span>' +
                '<ul class="question-tag-list" >' +
                '<li><p class="text-light optional">Required</p><input type="text" class="tagACourse" placeholder="Tag a course"/><div class="findTutorMobile-results"></div></li>' +
                '<li><p class="text-light optional">Optional</p><input type="text" class="tagAGroup" placeholder="Tag a group"/><div class="findTutorMobile-results-group"></div></li>' +
                '</ul>' +
                '<ul class="comments-actions-list">' +
                '<li class="attachment-li">' +
                '<div class="image-attachments">' +

                '</div>' +
                '</li>' +
                '<li>' +
                '<a data-toggle="tooltip" data-placement="top"' +
                'title="File Upload">' +
                '<label id="imageUploadLabel" for="attachment" class=" btn-lg purple-file-upload darken-2 mt-0 float-left">' +
                '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-file-earmark-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
                '<path fill-rule="evenodd" d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0H4zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>' +
                '</svg>' +
                '</label>' +
                '</a>' +
                '<input class="comment-file" id="attachment" name="attachment" type="file" />' +

                '</li>' +
                '<li>' +
                '<input class="btn btn-primary postQuestionBtn" id="comments-button" type="submit" name="" value="Post" />' +
                '</li>' +

                '</ul>');
            $(".askQuestion-textarea").focus();
        }

    })
    $(document).on("scroll", function() {
       //give the last elem in the ajax request a unique ID
       //once scrolled past, make another ajax call
       var docHeight = "";
       console.log($(document).height())
       console.log($(window).scrollTop() + $(window).height()+20)
        if (($(window).scrollTop() + $(window).height())+50 >= $(document).height()
        && type == "timeline") {
            var blockNum = parseInt($.session.get("blockNumber"));
            blockNum++;
            $.session.set("blockNumber",blockNum);
            docHeight = $(document).height();
            //make ajax request
           payload = {
            block: parseInt($.session.get("loadMore")),
            blockNum:parseInt($.session.get("blockNumber"))
        }
      
        $.ajax({
            async: true,
            url: "/loadMore",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".spinner-container").fadeOut();
                $(".timeline-wrapper").append(createTimeline(result.newItems, result.stripeId));
                if(result.newItems.length < 5 && $.session.get("end") == "false"){
                    $.session.set("end", true);
                    $(".timeline").append('<p class="timelineItemsLoaded">All items loaded</p>');
                }
              },
              500: function (result) {
                alert("500");
              },
            },
          });
        }
      });
})