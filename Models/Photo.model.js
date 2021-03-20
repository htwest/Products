const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // Test Schema for CSV transform
const PhotoSchema = new Schema({
  id: String,
  styleId: Number,
  url: String,
  thumbnail_url: String,
});


module.exports = mongoose.model('Photo', PhotoSchema);