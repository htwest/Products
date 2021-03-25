const mongoose = require('mongoose');
const Related = require('../Models/Sku.model');

const relatedFinder = (id) => {
  return Related.find({current_product_id: id})
}

module.exports = relatedFinder;