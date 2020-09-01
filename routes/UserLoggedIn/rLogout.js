//packages used
require('dotenv').config();
const express = require('express');
const router = express.Router();
const {Datastore} = require('@google-cloud/datastore');
const {DatastoreStore} = require('@google-cloud/connect-datastore');
const session = require('express-session');
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
//log the user out when they click logout on the user dropdown menuA
router.get('/logout', function (req, res) {
    //destroy the session
    req.session.destroy(function (err) {
        if (err) {
            res.negotiate(err);
        }
    });
    //redirect to index
    res.redirect('/');
});
module.exports = router;