const router = require("express").Router();
const path = require("path");
const gallery = require("../models/gallery");
const fs = require("fs");
const api = require("../utils/api");
const uploadCloud = require('../config/cloudinary');

router.get("/gallery", (req, res, next) => {
  res.render("gallery");
});

router.get("/imageprint", (req, res, next) => {
  Imageprint.find({})
    .then(img => {
      const hbsObj = {
        img
      };
      res.render("imgprintSchema", hbsObj);
    })
    .catch(err => console.log(err));
});

router.get("/gallery/all", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  } else {
    const { username } = req.user;
    gallery.find({ username: username }).then(images => {
      const hbsObj = {
        gallery: images
      };
      console.log(hbsObj)
      res.render("gallery/all", hbsObj);
    });
  }
});

router.post("/gallery/upload", uploadCloud.single('photo'), (req, res, next) => {
 let galleryObj = {}
  if (!req.user) {
    res.redirect('/login')
  }
  if(!req.file) {
    res.redirect('back')
  }
  galleryObj.imgPath=req.file.url;
  galleryObj.username= req.user.username
  res.redirect('/gallery/all');
  gallery.create(galleryObj)
  .then(newGallery => {
    res.redirect('/index')
  }).catch(err=> next(err));
});

router.put("/gallery/analyze/:id", async(req, res) => {
  const { id } = req.params;
  const gallery1 = await gallery.findById(id)

  api.ocr(gallery1.imgPath, analysis => {
    const arr = [];
    analysis.regions.forEach(obj => {
      obj.lines.forEach(word => {
        word.words.forEach(text => arr.push(text.text));
      });
    });
    const description = arr.join(" ");

    console.log(id);
    gallery.updateOne({ '_id':id },{description})
    .then((doc) => {
        console.log(doc);
        res.status(200).json(description);
      })
      .catch(err => console.log(err));
  });
});


router.delete("/gallery/image/:id", (req, res) => {
  if (!req.user) {
    res.status(401).json("No User Found");
  } else {
    const { username } = req.user;
    const { id } = req.params;
    gallery.remove({"_id":id}).then(()=>{
      res.status(200).json('deleted');
    })
  }
});

module.exports = router;
