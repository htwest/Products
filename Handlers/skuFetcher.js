const mongoose = require('mongoose');
const Sku = require('../Models/Sku.model');

const skuFinder = (id) => {
  return Sku.find({ styleId: id })
}

module.exports = skuFinder;