const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imgSchema = new Schema({
  description: String
});

const Imageprint = mongoose.model("ImgSchema", imgSchema);

module.exports = Imageprint;
