
//var connections = u.getAllConnections();

module.exports = class TimeLinePost {

    constructor(id, sendToHandle, type, userHandle, userName, userImage, caption, likes, comments,date, name, course, price, url, hasLiked ) {
      this.id = id;
      this.sendToHandle = sendToHandle;
      this.type = type;
      this.userHandle = userHandle;
      this.userName = userName;
      this.userImage = userImage;
      this.caption = caption;
      this.likes = likes;
      this.comments = comments;
      this.date = date;
      this.name = name;
      this.course = course;
      this.price = price;
      this.url = url;
      this.hasLiked = hasLiked;
      
    }
    //compute average tutor rating and return it along with review count

    getId(){
      return this.id;
    }
    getUserId(){
      return this.userId;
    }
    getType(){
      return this.type;
    }
    getDate(){
      return this.date;
    }
    getUserHandle(){
      return this.userHandle;
    }
    getUserName(){
      return this.userName;
    }
    getUserImage(){
      return this.userImage;
    }
    getCaption(){
      return this.caption;
    }
    getLikes(){
      return this.likes;
    }
    getComments(){
      return this.comments;
    }
    getName(){
      return this.comments;
    }
    likedBoolean(handle, likeArray){
      if(likeArray.length > 0){
        for (var x = 0; x< likeArray.length; x++){
          if(likeArray[x].likerHandle === handle){
            return true;
          }
        }
      }
      return false;
    }
  }
    