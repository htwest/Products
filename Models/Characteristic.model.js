const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CharacteristicSchema = new Schema({
  id: Number,
  product_id: Number,
  name: String
});

module.exports = mongoose.model('characteristic', CharacteristicSchema);