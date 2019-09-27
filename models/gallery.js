const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({
  images: [
    {
      fileLocation: String,
      fileName: String,
      description: String
    }
  ],
  userName: String
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
