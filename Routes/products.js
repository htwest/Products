const express = require('express');
const mongoose = require('mongoose');
const productRouter = express.Router();
const Product = require('../Models/Product.model');
const Feature = require('../Models/Feature.model');

productRouter.use(express.json());

// localhost:3000/products
productRouter.get('/', (req, res) => {
  let count = req.query.count || 5;
  Product
  .find({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
       res.send(result);
    }
  })
  .limit(count);
});

productRouter.get('/:product_id', (req, res) => {
  const product_id = req.params.product_id;

  Product
  .find({ id: product_id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      let resObj = { ... result['0']["_doc"] };

      Feature
      .find({ productId: product_id }, (err, result) => {
        resObj['features'] = result;
        res.send(resObj);
      })
    }
  })
})

module.exports = productRouter;