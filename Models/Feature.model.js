const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
  id: Number,
  productId: Number,
  feature: String,
  value: String
});

module.exports = mongoose.model('feature', FeatureSchema);