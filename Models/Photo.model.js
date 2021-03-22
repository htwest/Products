const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
  id: Number,
  styleId: Number,
  url: String,
  thumbnail_url: String,
});


module.exports = mongoose.model('Photo', PhotoSchema);