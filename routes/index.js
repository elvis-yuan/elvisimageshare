var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/imageshare");
        });
    });
});

router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/imageshare",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome back!"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("imageshare");
});

module.exports = router;