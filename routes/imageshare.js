var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'divtvpzuc', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err)
       } else {
           res.render("imageshare/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'imageshare'});
       }
    });
        
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
        cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
            if(err) {
                console.log(err);
          // add cloudinary url for the image to the campground object under image property
        }
        req.body.campground.image = result.secure_url;
          // add author to campground
        req.body.campground.author = {
            id: req.user._id,
            username: req.user.username
        }
        Campground.create(req.body.campground, function(err, campground) {
            if (err) {
              req.flash('error', err.message);
              return res.redirect('back');
            }
            res.redirect('/imageshare/' + campground.id);
        });
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("imageshare/new");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Post not found");
           res.redirect("/imageshare")
        } else {
           res.render("imageshare/show", {campground: foundCampground})
       } 
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("image/edit", {campground: foundCampground});
    });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
           if(err){
               res.redirect("/imageshare");
           } else {
               res.redirect("/imageshare/" + req.params.id);
           }
        });
});

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/imageshare");
        } else {
            res.redirect("/imageshare");
        }
    });
});

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("imageshare/index",{campgrounds: allCampgrounds, page: 'imagesahre'});
       }
    });
});



module.exports = router;