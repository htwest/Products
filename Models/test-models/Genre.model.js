const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // Test Schema for CSV transform
const GenreSchema = new Schema({
  id: Number,
  genre: String
});


module.exports = mongoose.model('genre', GenreSchema);