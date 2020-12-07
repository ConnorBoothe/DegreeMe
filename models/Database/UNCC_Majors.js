require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true },function(err){
    
});
// db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema; 


var majorSchema = new Schema({
    Major: {type:String, required:true},
    concentration:{type:String, required:true}
}, {collection: 'UNCC_Majors'});

module.exports = class Reviews {
    addMajor(majorName, concentration){
        var majorDB = mongoose.model('UNCC_Majors',majorSchema);
        var major = new majorDB({Major:majorName, concentration: concentration});
        major.save();
    }
    getAllMajors(){
        var majorDB = mongoose.model('UNCC_Majors',majorSchema);
        return majorDB.find({});
    }
}