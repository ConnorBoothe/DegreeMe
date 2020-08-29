module.exports = class Message {
    constructor(sender_ID,receiver_ID,type,content,date,time) {
      this.sender_ID = sender_ID;
      this.receiver = receiver_ID;
      this.type = type;
      this.content = content;
      this.date = date;
      this.time = time;
    }
    
  }
    