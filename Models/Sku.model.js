const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkuSchema = new Schema({
  id: Number,
  styleId: Number,
  size: String,
  quantity: Number
});

module.exports = mongoose.model('sku', SkuSchema);