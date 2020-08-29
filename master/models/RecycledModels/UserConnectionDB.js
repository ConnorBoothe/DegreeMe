var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const mongoDB_URL = "mongodb+srv://ConnorBoothe:degreeMe@cluster0-rfrg2.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var connectionDBSchema = new Schema({
    sessionID: {type:String, required:true},
    tutorHandle: {type:String, required:true},
    userHandle:{type:String, required:true},
    class:{type:String, required:true},
    date:{type:Date, required:true},
    time:{type:String, required:true},
    building:{type:String, required:true},
    room:{type:String, required:true},
    hourlyRate:{type:String, required:true},
    hours:{type:String, required:true},
    StudentsAttending:{type:String, required:true},
    Type:{type:String, required:true},
    Status:{type:String, required:true},
    Description:{type:String},
    Email:{type:String},
    Balance:{type:String},
    Source:{type:String},
    Currency:{type:String},
    CustomerID:{type:String},
    LeftReview: {type:Boolean, required:true}
}, {collection: 'ConnectionsDB'});
var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
module.exports = class UserProfile {
    constructor() {
      this.connections = [];
    }
    //return connections
    getConnections(id){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.find({_id:id});
    }
    getConnectionsByHandle(handle){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.find({userHandle:handle});
    }
    getConnection(id){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.find({sessionID:id});
    }
    //used to add connection once minimum student threshold is reached
    addConnection(connection, req){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        var connect = new ConnectionDB({sessionID:connection.getSessionID() ,tutorHandle:connection.getTutor(), userHandle:connection.getStudent(), class:connection.getclassName(), date:connection.getDate(), 
            time: connection.getTime(), building:connection.getBuilding(),
             room: connection.getRoom(),  hourlyRate:connection.getHourlyRate(), hours:connection.hours, 
             StudentsAttending: connection.studentsAttending, Type:connection.getType(), Status: connection.getStatus(), LeftReview:false
            });
       return connect.save();
        
    }
    //customer.description, customer.email, customer.balance, customer.currency, customer.id);
      addPendingConnection(connection, description, email, balance, currency, id){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        var connect = new ConnectionDB({sessionID:connection.getSessionID() ,tutor:connection.getTutor(), name:connection.getStudent(), class:connection.getclassName(), date:connection.getDate(), 
            time: connection.getTime(), building:connection.getBuilding(), room: connection.getRoom(),  hourlyRate:connection.getHourlyRate(), hours:connection.hours, 
             StudentsAttending: connection.studentsAttending, Type:connection.getType(), Status: connection.getStatus(), Description:description, Email: email,
             Balance:balance, Currency:currency, CustomerID: id, LeftReview:false
            });
        connect.save();
    }
    updateConnectionStatus(id){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.find({sessionID:id}).updateMany({$set:{Status:"Paid"}});
        
    }
    updateLeftReview(id){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.findOne({_id:id}).updateOne({$set:{LeftReview:true}}).exec((err,docs)=>{
           
        });
    }
    //remove connection, given the tutor name of the connection
    removeConnection(id, res){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.deleteOne({_id:id}).exec((err,docs)=>{
            res.redirect('/MyConnections');
          });
    }
    //set rsvp by calling setRSVP from UserConnection class
    setRSVP(id,rsvp){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.findOne({_id:id}).updateOne({$set:{RSVP: rsvp}}).exec((err,docs)=>{
            
        });
    }
    //clear all user connections
    emptyProfile(){
        this.connections = [];
    } 
    //return a list of all users within a given major
    
}