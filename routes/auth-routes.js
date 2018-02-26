"use strict";

const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/#');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// auth with twitter
router.get('/twitter', passport.authenticate('twitter'));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send(req.user);
    res.redirect('/#');
});

// callback route for twitter to redirect to
// hand control to passport to use code to grab profile info
router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
   // res.send(req.user);
    res.redirect('/#');
});

// route for service that returns login state

router.get('/loginStatus', (req, res) => {
    if(req.user)
        res.send({
            status: "logged in",
            userId: req.user.userId,
            userName: req.user.username
        });
    else
        res.send({
                status: "logged out"});
});
module.exports = router;