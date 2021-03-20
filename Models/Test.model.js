const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // Test Schema for CSV transform
const TestSchema = new Schema({
  id: String,
  genreID: String,
  name: String,
  age: String,
  location: String
});


module.exports = mongoose.model('Test', TestSchema);