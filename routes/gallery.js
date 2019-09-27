const router = require("express").Router();
const path = require("path");
const gallery = require("../models/gallery");
const fs = require("fs");
const api = require("../utils/api");

const formidable = require("express-formidable")({
  uploadDir: path.join(__dirname, "../public/uploads"),
  keepExtensions: true
});

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
    res.status(401).json("No User Found");
  } else {
    const { username } = req.user;
    gallery.findOne({ userName: username }).then(documents => {
      const hbsObj = {
        gallery: documents.images
      };
      res.render("gallery/all", hbsObj);
    });
  }
});

router.post("/gallery/upload", formidable, (req, res) => {
  if (!req.user) {
    res.status(401).json("No User Found");
  } else {
    const fileName = req.files.image.path.split("\\").pop();
    const { username } = req.user;
    gallery
      .findOne({ userName: username })
      .then(documents => {
        if (documents) {
          const { id } = documents;
          gallery
            .findByIdAndUpdate({ _id: id }, { $push: { images: { fileName } } })
            .then(updatedDoc => {
              console.log(updatedDoc);
              res.status(201).json("Added Image To Gallery");
            })
            .catch(err => console.log(err));
        } else {
          gallery
            .create({
              images: {
                fileName
              },
              userName: username
            })
            .then(doc => {
              console.log("new document created");
              console.log(doc);
              res.status(200).json("Created Gallery");
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log("in error");
        console.log(err);
      });
  }
});

router.put("/gallery/analyze/:fileName", (req, res) => {
  const { fileName } = req.params;
  api.ocr(fileName, analysis => {
    console.log(analysis);
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
