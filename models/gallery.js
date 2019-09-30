const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({ 
  imgPath:String,
  fileName:String,
  username:String,
  description: String
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
