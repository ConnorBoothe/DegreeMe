//packages used
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const {
    check,
    validationResult
} = require('express-validator');
//DBs used
const ListingsDB = require("../../models/Database/ListingsDB");
const userDB = require('../../models/Database/UserDB');
//instantiate DBs
var connections = new ListingsDB();
var users = new userDB();
//register the session and use bodyParser
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/deleteSession',
    check('id').trim().escape(),
    check('subject').isString().trim().escape(),
    function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/Home');
        }
        connections.removeListing(req.body.id, req.body.subject);
        res.redirect('/listings');
    })
router.get('/listings', function (req, res) {
    if (req.session.userId) {
        //get tutoring sessions hosted by this user
        connections.getListingsByUserID(req.session.userId).exec((err, docs) => {
            var count = 0;
            var myListings = [];
            if (docs) {
                myListings = docs;
                for (x in docs) {
                    count++;
                }
            }
            users.getUserByHandle(req.session.handle).exec((err, docs) => {
                res.render('UserLoggedIn/MySessions', {
                    count: count,
                    session: req.session,
                    docs: myListings,
                    qs: req.query,
                    StripeId: docs.StripeId,
                });
            });
        })
    } else {
        res.redirect('/login?error=Session%20Ended')
    }
});
module.exports = router;