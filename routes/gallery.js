const router = require("express").Router();
const path = require("path");
const Gallery = require("../models/User.js");
const fs = require("fs");
const formidable = require("express-formidable")({
  uploadDir: path.join(__dirname, "../public/uploads"),
  keepExtensions: true
});

router.get("/gallery", (req, res, next) => {
  res.render("gallery");
});

router.post("/gallery/upload", (req, res) => {
  console.log("hello");
  const fileName = req.files;
  console.log(fileName);
});

module.exports = router;
