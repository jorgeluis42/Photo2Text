const express = require('express')
const router = express.Router()
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get("/signup", (req, res, next) => {
    console.log("SIGN UP")
    res.render("users/signup");
});

router.post('/signup', (req, res, next) => {
    const salt = bcrypt.genSaltSync(10)
    let password = bcrypt.hashSync(req.body.password, salt)

    User.create({
        username: req.body.username,
        password: password
    })
        .then(user => {
            req.login(user, function(err){
                if(!err){
                    res.redirect('/')
                } else{
                    next(err);
                }

            })
            })
        .catch(e => {
            res.status(500).send(e)})
});

router.get("/login", (req, res, next) => {
    console.log("LOGIN")
    res.render('users/login')
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    // failureFlash: true,
    passReqToCallback: true
}));


router.get("/logout", (req, res, next) => {
    req.logout()
    // password uses just req.logout()
    // req.session.destroy((err) => {
    res.redirect("/login")
})

router.get('/secret', (req, res, next) => {

    console.log(req.user)
    if (req.user) {
        res.render('users/secret')
    } else {
        res.redirect('/')
    }
})

module.exports = router