const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StyleSchema = new Schema({
  id: Number,
  productId: Number,
  name: String,
  sale_price: Number,
  original_price: Number,
  default_style: Number,
});

module.exports = mongoose.model('style', StyleSchema);