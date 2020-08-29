// var mongoose = require("mongoose");
// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
  
// });
// db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// var Schema = mongoose.Schema;
// var tutorDBSchema = new Schema({
//     id: {type:Number, required:true},
//     name:{type:String, required:true},
//     img:{type:String, required:true},
//     Category:{type:String, required:true},
//     GPA:{type:String, required:true},
//     Rating:{type:Number, required:true},
//     Bio:{type:String, required:true},
//     School:{type:String, required:true},
//     type:{type:String, required:true}
// }, {collection: 'TutorDB'});

// var TutorDB = mongoose.model('TutorDB',tutorDBSchema);
// TutorDB.find({});