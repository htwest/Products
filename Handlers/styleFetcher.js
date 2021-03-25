const mongoose = require('mongoose');
const Style = require('../Models/Style.model');

const styleFetcher = (id) => {
  return Style.find({ productId: id})
  //  Style.aggregate().match({ productId: id })
  // .lookup({
  //   from: 'photos',
  //   localField: 'id',
  //   foreignField: 'styleId',
  //   as: 'photos'
  // })
}

module.exports = styleFetcher;