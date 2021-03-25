const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FullStyle = new Schema({
  product_id: Number,
  style_id: Number,
  name: String,
  original_price: Number,
  sale_price: String,
  default: Number,
  photos: Schema.Types.Mixed,
  skus: Schema.Types.Mixed
});

module.exports = mongoose.model('fullstyle', FullStyle);