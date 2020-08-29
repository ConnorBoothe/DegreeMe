// //packages used
// var express = require('express');
// var router = express.Router();
// var session = require('express-session');
// var bodyParser = require('body-parser');

// //DBs used
// var ListingsDB = require('../../models/Database/ListingsDB');
// //classes used
// var Tutor = require('../../models/classes/Tutor');
// var userDB = require('../../models/Database/UserDB');
// //instantiate classes used
// var tutor = new Tutor();
// var connectionsDB = new ListingsDB();
// var users = new userDB();
// //use session and bodyParser
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({
//     extended: true
// }));
// router.use(session({
//     secret: 'iloveu',
//     resave: true,
//     saveUninitialized: true
// }));

// //handle the search tutor post route in top left corner of every page
// router.post("/searchTutors", function (req, res) {
//     res.redirect("/Tutor?handle=" + req.body.searchTutors);
// })

// //render the tutor page
// router.get('/Tutor', function (req, res) {
//     if (req.session.userId) {
//         var qs = req.query;
//         connectionsDB.getListingsByHandle(qs.handle).exec((err, docs) => { //get tutor by handle
//             var averageRating = tutor.getAvgRating(docs[0].Reviews);
//             var subjects = [];
//             for (x in docs) {
//                 subjects.push(docs[x].Subject)
//             }
//             users.getThreads(req.session.userId).exec((err, docs1) => {
//                 var threads = new Array;
//                 var x = docs1.threads.length - 1;
//                 //add threads to threads array, beginning with the last index of the array and ending with index 0
//                 while (x >= 0) {
//                   threads.push(docs1.threads[x]);
//                   x--;
//                 }
//                 res.render('UserLoggedIn/Profile', {
//                     tutor: docs[0],
//                     Subjects: subjects,
//                     reviewCount: averageRating[1],
//                     averageRating: averageRating[0],
//                     qs: req.query,
//                     session: req.session,
//                     threads: threads
//                 });
//             });
            
//         })
//     } else {
//         res.redirect('/login?error=User%20Not%20Currently%20Logged%20In')
//     }
// });
// module.exports = router;