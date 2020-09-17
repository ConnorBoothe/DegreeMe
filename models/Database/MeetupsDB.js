require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
});
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;

var memberSchema = new Schema({
    role: {type:String, required:true},
    name: {type:String, required:true},
    handle: {type:String, required:true},
    image: {type:String, required:true},
    intent: {type:String, required:true}
})
var timeStampSchema = new Schema({
    type: {type:String, required:true},
    handle: {type:String, required:true},
    time: {type:String, required:true},
    image: {type:String, required:true},
})
var location = new Schema({
    Building: {type:String, required:true},
    Room: {type:String, required:true},
})
var connectionDBSchema = new Schema({
    sessionID: {type:String, required:true},
    tutorHandle: {type:String, required:true},
    userHandle:{type:String, required:true},
    class:{type:String, required:true},
    courseCode:{type:String, required:true},
    date:{type:Date, required:true},
    time:{type:String, required:true},
    building:{type:String},
    room:{type:String},
    hourlyRate:{type:String, required:true},
    hours:{type:String, required:true},
    StudentsAttending:{type:String, required:true},
    Type:{type:String, required:true},
    Virtual: {type: Boolean,required: true},
    Paid:{type: Boolean,required: true},
    SessionNotes:{type:String},
    Description:{type:String},
    Email:{type:String},
    Balance:{type:String},
    Source:{type:String},
    Currency:{type:String},
    CustomerID:{type:String},
    LeftReview: {type:Boolean, required:true},
    ZoomLink: {type:String},
    Members : [memberSchema],
    TimeStamps: [timeStampSchema],
    Location:[location]
}, {collection: 'ConnectionsDB'});
module.exports = class UserProfile {
    getAllMeetups(){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.find({});
    }
    //tutorhandle members paid _id
    getMeetupsWherePaymentDue(){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.find({
            Paid:{ $ne: true},
            // date:{ $lt: new Date()}
        }, "tutorHandle Members Paid _id")
    }
    getMeetupById(id){
        console.log("ID", id)
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.findOne({_id:id});
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
    addConnection(connection, members, Virtual){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        var connect = new ConnectionDB({sessionID:connection.getSessionID() ,tutorHandle:connection.getTutor(), userHandle:connection.getStudent(), class:connection.getclassName(), 
            courseCode:connection.getCourseCode(),date:connection.getDate(), 
            time: connection.getTime(), building:connection.getBuilding(), room: connection.getRoom(),  hourlyRate:connection.getHourlyRate(), hours:connection.hours, 
             StudentsAttending: connection.studentsAttending, Type:connection.getType(), SessionNotes: connection.getSessionNotes(), LeftReview:false, Members:members,
             Virtual:Virtual, Paid:false
            });
       return connect.save();
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
    //add zoom link to the meetup for easy access
   addZoomLink(id, zoomLink){
    var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
    return ConnectionDB.find({_id:id}).updateOne({
        $set: {
          ZoomLink: zoomLink
        }
      });
   }
    //moving push to route so I can call then() function
   addTimeStamp(id){
    var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
    return ConnectionDB.findOne({_id:id});
    
   }
   getIntents(id){
    var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
    ConnectionDB.find({sessionID:id}).exec((err,docs)=>{
        if(err){
            console.log("Something broke in getIntents");
        }else{
            var intents=[];
            for(var i in docs.Members){
                intents.push(docs.Members[i].intent);
            }
            return intents;
        }
    });
    
    }
    setIntentToNone(id, memberIndex){
        console.log("SET INTENT")
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.find({_id:id}).exec((err,docs)=>{
            console.log("SET INTENT", docs)
            if(err){
                console.log("Something broke in set intent");
            }else{
                docs[0].Members[memberIndex].intent = "none";
                docs[0].save();
            }
        });
    }
    //add location to the meetup
    addLocation(id, building, room){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.findOne({_id:id}).updateOne({
            $set: {
              Location: {Building:building, Room:room}
            }
          }).exec();
    }
    //add location to the meetup
    setToPaid(id){
        console.log("SETTING PAID")
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.findOne({_id:id}).updateOne({
            $set: {
              Paid: true
            }
          }).exec((err, docs)=>{
              console.log(docs)
          });
    }
    //determin if a meetup already exists
    meetupExists(id, tutorHandle, date, subject){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        return ConnectionDB.findOne({
            sessionID:id,
            tutorHandle: tutorHandle,
            date:date,
            class:subject
        })
    }
    //add new member to the meetup
    addMember(id, name, handle, image, intent){
        var ConnectionDB = mongoose.model('ConnectionsDB',connectionDBSchema);
        ConnectionDB.findOne({_id:id})
        .exec((err,docs)=>{
            console.log("DOCS IN ADD MEMBER",docs)
            docs.Members.push({role:"Student", name:name, handle:handle, image:image, intent:intent});
            docs.save();
        })
    }

}