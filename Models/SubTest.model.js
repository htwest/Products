const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // Test Schema for CSV transform
const GenrePictureSchema = new Schema({
  thumbnail: String,
  pictureUrl: String
});


module.exports = mongoose.model('genrepicture', GenrePictureSchema);