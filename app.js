var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
//    seedDB      = require("./seeds"),
    Comment     = require("./models/comment"),
    passport    = require("passport"),
  LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    flash       = require("connect-flash"),
    dotEnv      = require('dotenv').config(),
 methodOverride = require("method-override");

//requiring routes
var commentRoutes = require("./routes/comments"),
 campgroundRoutes = require("./routes/imageshare"),
      indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost/imageshare");
mongoose.connect("mongodb://localhost/imageshare");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.use(require("express-session")({
    secret: "Testing engine",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.locals.moment = require('moment')

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use("/imageshare/:id/comments", commentRoutes);
app.use("/imageshare", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELPCAMP started");
});
