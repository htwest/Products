const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelatedSchema = new Schema({
  id: Number,
  current_product_id: Number,
  related_product_id: Number
});

module.exports = mongoose.model('related', RelatedSchema, 'related');