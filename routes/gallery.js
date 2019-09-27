const router = require("express").Router();
const path = require("path");
const gallery = require("../models/gallery");
const fs = require("fs");
const api = require("../utils/api");
const uploadCloud = require('../config/cloudinary.js');


// const formidable = require("express-formidable")({
//   uploadDir: path.join(__dirname, "../public/uploads"),
//   keepExtensions: true
// });

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
      console.log(images)
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
    // res.status(401).json("No User Found");
 }
  if(req.file) {
    // console.log('found req file >>>>>>>>>>>>> ', req.file);
    galleryObj.imgPath=req.file.url;
    galleryObj.username= req.user.username
    // console.log("YEET")
    // console.log(galleryObj.imgPath)
    res.redirect('/')
  } else {
    // console.log('redirecting back <<<<<<<<<<<<<<<<<<<<< ');
    res.redirect('back')
  }
  console.log('this is the object to get created ============ ',galleryObj);
  gallery.create(galleryObj)
  .then(newGallery => {
    res.redirect('/index')
  }).catch(err=> next(err));
  // } else {
  //   // const fileName = req.files.image.path.split("\\").pop();
  //   const { username } = req.user;
  //   gallery
  //     .findOne({ userName: username })
  //     .then(documents => {
  //       if (documents) {
  //         const { id } = documents;
  //         gallery
  //           .findByIdAndUpdate({ _id: id, images: imgpath })
  //           .then(updatedDoc => {
  //             console.log(updatedDoc);
  //             res.status(201).json("Added Image To Gallery");
  //           })
  //           .catch(err => console.log(err));
  //       } else {
  //         gallery
  //           .create({
  //             images: {
  //               imgpath
  //             },
  //             userName: username
  //           })
  //           .then(doc => {
  //             console.log("new document created");
  //             console.log(doc);
  //             res.status(200).json("Created Gallery");
  //           })
  //           .catch(err => console.log(err));
  //       }
  //     })
  //     .catch(err => {
  //       console.log("in error");
  //       console.log(err);
  //     });
  // }
});

// router.put("/gallery/analyze/:id", async(req, res) => {
//   const { id } = req.params;
//   let gallery1 = await gallery.findById(id)
   
//   api.ocr(gallery1.imgPath, analysis => {
//     console.log(analysis);
//     const arr = [];
//     analysis.regions.forEach(obj => {
//       obj.lines.forEach(word => {
//         word.words.forEach(text => arr.push(text.text));
//       });
//     });
//     const description = arr.join(" ");
//     gallery1
//       .update(
//         { fileName },
//         {
//           $set: {
//             "images.$.description": description
//           }
//         }
//       )
//       .then(() => {
//         res.status(200).json(description);
//       })
//       .catch(err => console.log(err));
//   });
// });

router.put("/gallery/analyze/:id", (req, res) => {
  console.log("-=-=-=-=-=-=-=-=-=-WWE ARE HERE-=-=-=-=-=-=-=-=");
  console.log("PARAMS: 0", req.params)

  const { fileName } = req.params;
  api.ocr(fileName, analysis => {
    console.log("ANALYSIS ",analysis);
    const arr = [];
    analysis.regions.forEach(obj => {
      obj.lines.forEach(word => {
        word.words.forEach(text => arr.push(text.text));
      });
    });
    const description = arr.join(" ");
    gallery
      .update(
        { "images.fileName": fileName },
        {
          $set: {
            "images.$.description": description
          }
        }
      )
      .then(() => {
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
    console.log(id);
    const { fileName } = req.query;

    gallery
      .update({ userName: username }, { $pull: { images: { id } } })
      .then(docs => {
        console.log(docs);
        fs.unlink(
          path.join(__dirname, `../public/uploads/${fileName}`),
          err => {
            if (err) {
              console.log(err);
            }
            res.status(204).json("Deleted");
          }
        );
      })
      .catch(err => console.log(err));
  }
});

module.exports = router;
