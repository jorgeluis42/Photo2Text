const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema({ 
    
  //     images: String,
  // userName: String
  imgPath:String,
  fileName:String,
  username:String,
  description: String
});

const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
