//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
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
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
router.use(session({
    store: new DatastoreStore({
        kind: 'express-sessions',
     
        // Optional: expire the session after this many milliseconds.
        // note: datastore does not automatically delete all expired sessions
        // you may want to run separate cleanup requests to remove expired sessions
        // 0 means do not expire
        expirationMs: 0,
     
        dataset: new Datastore({
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GCLOUD_PROJECT environment variable. Or you can explicitly pass in a
          // project ID here:
          projectId: process.env.GCLOUD_PROJECT,
     
          // For convenience, @google-cloud/datastore automatically looks for the
          // GOOGLE_APPLICATION_CREDENTIALS environment variable. Or you can
          // explicitly pass in that path to your key file here:
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        })
      }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true,
        maxAge:  6*60*60*1000 },
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