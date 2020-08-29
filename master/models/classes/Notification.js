module.exports = class Notification {

    constructor(name,type) {
      this.name = name;
      this.type = type;
     
    }
    //return notification name
    getName(){
      return this.name;
    }
    //return notification type
    getType(){
      return this.type;
    }
   
    }