const express = require('express');
const router = express.Router();
const session = require('express-session');
const bodyParser = require("body-parser");
const userProfile = require('../../models/Database/MeetupsDB');
const userPro = new userProfile();
const Connection = require('../../models/classes/Connection');
const stripe = require('stripe')('sk_test_KLmOibLZEyhi7d6RA7CA42Bf00ZifUQEt7');

//register the session
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
//render the about page
router.get('/stripeTest', function(req, res){
   
    res.render('stripeTest');
});
// router.get('/stripeDemo', function(req, res){
   
//     res.render('stripePaymentsDemo');
// });
// router.post("/charge", function(req,res){
// var token = req.body.stripeToken;
// var chargeAmount = req.body.chargeAmount;
// var charge = stripe.charges.create({
//     amount : chargeAmount,
//     currency : "USD",
//     source : token
// }, function(err, charge){
//     if(err && err.type == "StripeCardError"){
//         console.log("card declined");
//     }
//     console.log("payment successful")
//     userPro.getConnections(req.session.name).exec((err,docs)=>{
//         //req.session.count = docs.length;
//         var connection = new Connection(req.session.count,req.body.tutor, req.session.name, req.body.class,req.body.date,req.body.time,req.body.location);
//         userPro.addConnection(req.session.count,connection,"Yes");
//         req.session.count++;
      
//         res.redirect('/MyConnections');
//       });
//         //res.redirect("/stripeTest?type=success");
// })
// });

module.exports = router;