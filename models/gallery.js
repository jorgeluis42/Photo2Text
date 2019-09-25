const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    fileLocation: {
      type: String
    },
    userName: String
  },
  {
    timestamps: true
  }
);

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
