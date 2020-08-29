// var fs = require("fs");
// var Connection = require('./Connection');

// //read connections JSON file
// var obj = fs.readFileSync('./models/json/connections.json', 'utf8'); //read the json file
// var data = JSON.parse(obj);
// //array of UserConnection objects
// var connectionArray = [];
// for (x in data.connections){
//     var temp = new Connection(data.connections[x].id, data.connections[x].tutor, data.connections[x].student,data.connections[x].class,
//         data.connections[x].date,  data.connections[x].time,  data.connections[x].location, data.connections[x].rsvp);
        
//     connectionArray.push(temp);
// }

module.exports = class UserConnection {

    constructor(connection,rsvp) {
      this.rsvp = rsvp;
      this.connection = connection;
    }
    //retuns the connection
    getConnection(){
      return this.connection;
    }
    //returns rsvp value
    getRSVP(){
      return this.rsvp;
    }
    //set rsvp value
    setRSVP(status){
      this.rsvp = status;

    }
}
    