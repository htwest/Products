const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');
const split = require('split');

const FullStyle = require('../Models/newStyles.model');
const Style = require('../Models/Style.model');
const Photo = require('../Models/Photo.model');
const Sku = require('../Models/Sku.model');

(async function() {

  await mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

  const db = await mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("We're connected to the server!")
  });

  const lineCount = 0;

  await new Promise((resolve,reject) => {

    let buffer = [];
    let counter = 0;
    let schemaCount = 0;

    let stream = fs.createReadStream('../Resources/stylesSample.csv');
    stream
    .pipe(split())
    .on("error", reject)
    .on("data", (line) => {
      const data = line.toString();

      if (counter > 5) {
        stream.pause();

        for(let i = 0; i < buffer.length; i++) {
          if (buffer[i] === 'id,productId,name,sale_price,original_price,default_style') {
            continue;
          }
          const currentEntry = buffer[i].split(",")
          const cleanedEntry = [];

          currentEntry.forEach((item) => {
            if (item[0] === '"') {
              item = item.substring(1, item.length -1);
            }
            cleanedEntry.push(item);
          })

          const style_id = parseInt(cleanedEntry[0]);

          Photo.find({ styleId: style_id })
          .then((photoResults) => {

            const photoData = photoResults;

            Sku.find({ styleId: style_id })
            .then((skuResults) => {

            const skuData = skuResults;

            const newEntry = new FullStyle({
              product_id: parseInt(cleanedEntry[1]),
              style_id: parseInt(cleanedEntry[0]),
              name: parseInt(cleanedEntry[2]),
              original_price: parseInt(cleanedEntry[4]),
              sale_price: cleanedEntry[3],
              default: parseInt(cleanedEntry[5]),
              photos: photoData,
              skus: skuData
            }).save()

            schemaCount++;
            console.log(`Saved: ${schemaCount}`);
            })
            .catch((err) => console.log(err))
          })
          .catch((err) => console.log(err))
        }

        buffer = [];
        counter = 0;
        stream.resume()
      }

      counter++
      buffer.push(data);

    })
    .on("end", () => {
      for(let i = 0; i < buffer.length; i++) {
        if (buffer[i] === 'id,productId,name,sale_price,original_price,default_style') {
          continue;
        }

        const currentEntry = buffer[i].split(",")
        const cleanedEntry = [];

        currentEntry.forEach((item) => {
          if (item[0] === '"') {
            item = item.substring(1, item.length -1);
          }
          cleanedEntry.push(item);
        })
        const style_id = parseInt(cleanedEntry[0]);

        Photo.find({ styleId: style_id })
        .then((photoResults) => {

          const photoData = photoResults;
          Sku.find({ styleId: style_id })
            .then((skuResults) => {

              const skuData = skuResults;

              const newEntry = new FullStyle({
                product_id: parseInt(cleanedEntry[1]),
                style_id: parseInt(cleanedEntry[0]),
                name: parseInt(cleanedEntry[2]),
                original_price: parseInt(cleanedEntry[4]),
                sale_price: cleanedEntry[3],
                default: parseInt(cleanedEntry[5]),
                photos: photoData,
                skus: skuData
              }).save()

              console.log('saved');
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
      }
    })

  });
})()