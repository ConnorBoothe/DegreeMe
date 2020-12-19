require('dotenv').config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/CollegeTutor', { useNewUrlParser: true,useUnifiedTopology: true },function(err){
});
db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
var Schema = mongoose.Schema;
var paymentsSchema = new Schema({
    stripeId: {type:String, required:true},
    intent: {type:String, required:true},
    Date:{type:String, required:true},
    Paid:{type:Boolean, required:true},
    PayTo: {type:String, required:true},
    Email: {type:String, required:true},
    PaymentAmt:{type:Number, required: true}
}, {collection: 'PaymentsDB'});
module.exports = class UserProfile {
    //get intents that need to be charged
    getIntentWherePaymentDue(){
        var PaymentsDB = mongoose.model('PaymentsDB',paymentsSchema);
        return PaymentsDB.find({
                Paid:{ $ne: true},
                // date:{ $lt: new Date()}
        });
    }
    getIntentByUserWherePaymentDue(handle){
        var PaymentsDB = mongoose.model('PaymentsDB',paymentsSchema);
        return PaymentsDB.find({
                Paid:{ $ne: true},
                // date:{ $lt: new Date()},
                 PayTo: handle
        });
    }
    addIntent(stripeId, intent, Date, PayTo, PaymentAmt, Email){
        var PaymentsDB = mongoose.model('PaymentsDB',paymentsSchema);
        var intent = new PaymentsDB({stripeId: stripeId, intent:intent, Date: Date, Paid: false, PayTo: PayTo, Email:Email, PaymentAmt: PaymentAmt});
        intent.save();
    }
    setPaid(id){
        var PaymentsDB = mongoose.model('PaymentsDB',paymentsSchema);
       PaymentsDB.findOne({_id:id}).updateOne({
           $set:{Paid: true}
       }).exec((err,docs)=>{
           console.log(docs)
       });
    }
    

}