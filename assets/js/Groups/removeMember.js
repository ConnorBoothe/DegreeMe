$(document).ready(function(){
    $(".membersRightSideBar").on("click", ".removeMember", function(){
        payload = {
            handle: $(this).parent().parent().prev().text(),
            groupId:$("input[name='groupId']").val()
          }
          $.ajax({
            url: "/removeGroupMember ",
            type: 'POST',
            data: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }, statusCode: {
              202: function (result) {
                $(".membersRightSideBar .userHandleTxt").each(function(x){
                  if($(".membersRightSideBar .userHandleTxt").eq(x).text() == result.handle){
                    $(".membersRightSideBar .userHandleTxt").eq(x).parent().remove();
                  }
                })
                var currMemberCount = parseInt($(".messageHeader").eq(1).text().substr(0,1));
                currMemberCount--;
                if(currMemberCount == 1) {
                  $(".messageHeader").eq(1).text(currMemberCount + " MEMBER")

                }
                else {
                  $(".messageHeader").eq(1).text(currMemberCount + " MEMBERS")

                }
                $(".openImageEditor").hide();
                $(".group-options ul").append('<form action="/#" method="post" id="joinGroup">'+
                '<input name="joinGroup" type="hidden" value="'+$("input[name='groupId']").val()+'" />'+
                '<input name="joinGroup" type="hidden" value="'+$(".group-name-link").text()+'" />'+
                '<li id="" data-status="join" type="button"'+
                     'class="btn btn-primary joinButton openImageEditor"> Join Group </li>'+
            '</form>')

              }
            }
        })
    })
})