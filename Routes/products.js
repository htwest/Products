const express = require('express');
const mongoose = require('mongoose');
const productRouter = express.Router();

const Product = require('../Models/Product.model');
const Feature = require('../Models/Feature.model');
const Style = require('../Models/Style.model');
const Photo = require('../Models/Photo.model');
const Sku = require('../Models/Sku.model');
const Related = require('../Models/Related.model')

const styleFetcher = require('../Handlers/styleFetcher');
const photoFetcher = require('../Handlers/photoFetcher');
const skuFetcher = require('../Handlers/skuFetcher');
const relatedFetcher = require('../Handlers/relatedFetcher');

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
        let resObj = { ...result['0']["_doc"] };

        Feature
          .find({ productId: product_id }, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              resObj['features'] = result;
              res.send(resObj);
            }
          })
      }
    })
})

productRouter.get('/:product_id/related', (req, res) => {
  const product_id = req.params.product_id;

  Related
    .find({ current_product_id: product_id }, (err, results) => {
      if (err) {
      console.log(err);
      } else {
        const returnArr = [];
        for (let item of results) {
          returnArr.push(item.related_product_id);
        }
        res.send(returnArr);
      }
    })

})

productRouter.get('/:product_id/styles', (req, res) => {
  const product_id = req.params.product_id;

  const returnData = {
    product_id: product_id,
    results: []
  }

  styleFetcher(product_id)
    .then((styleResults) => {

      return styleResults.map((style) => {
        // console.log({style})
        let style_id = style.id;

        let styleObj = {
          styleId: style.id,
          name: style.name,
        }

        return photoFetcher(style_id)
          .then((photoData) => {
            // console.log({photoData})
            styleObj.photos = photoData;
            return photoData
          })
          .then((photoData) => {
            // console.log({style_id});
            return skuFetcher(style_id)
          })
          .then((skuData) => {
            // console.log({skuData})
            const skuObj = {};
            for (sku of skuData) {
              skuObj[sku.id] = {
                quantity: sku.quantity,
                size: sku.size
              }
            }
            styleObj.skus = skuObj;
            return styleObj

          })
          .catch((err) => console.log(err))
      })
    })
    .then((promises) => {
      Promise.all(promises).then((data) => {
        // console.log({data});
        returnData.results = data;
        res.send(returnData);
      });
      })
    .catch((err) => console.log(err))

})

module.exports = productRouter;
