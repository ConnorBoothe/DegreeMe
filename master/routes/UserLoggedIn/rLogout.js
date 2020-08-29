//packages used
const express = require('express');
const router = express.Router();
const session = require('express-session');
router.use(session({
    secret: 'iloveu',
    resave: true,
    saveUninitialized: true
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