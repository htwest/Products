const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  // Test Schema for CSV transform
const TestSchema = new Schema({
  id: Number,
  genre: String,
  name: String,
  age: Schema.Types.Mixed,
  location: String,
  test: Schema.Types.Mixed
});


module.exports = mongoose.model('character', TestSchema);