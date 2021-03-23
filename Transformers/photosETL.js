const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');
const { Readable } = require('stream');
const split = require('split');

const Photo = require('../Models/Photo.model');

let fragment;

(async function() {

  await mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

  const db = await mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("We're connected to the server!")
  });


  await new Promise((resolve,reject) => {
    // Create Buffer to hold Documents
    let buffer = [];
    let counter = 0;
    let lineCounter = 0;
    let batchCounter = 1;

    // Create read stream to parse csv file
    let stream = fs.createReadStream('../Resources/photos.csv');
    stream
      .pipe(split())
      .on("error", reject)
      .on("data", (line) => {
        const data = line.toString();
        if (counter > 1000) {
          stream.pause()

          for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 'id, styleId, url, thumbnail_url') {
              continue;
            }
            const currentEntry = buffer[i].split(",")
            const cleanedEntry = [];

            currentEntry.forEach((item) => {
              if (item[0] === '"') {
                item = item.substring(1, item.length);
              }
              if(item[item.length -1] === '"') {
                item = item.substring(0, item.length -1);
              }
              cleanedEntry.push(item);
            })

            const newPhoto = new Photo({
              id: parseInt(cleanedEntry[0]),
              styleId: parseInt(cleanedEntry[1]),
              url: cleanedEntry[2],
              thumbnail_url: cleanedEntry[3],
            })
            .save()
          }

          buffer = [];
          counter = 0;
          batchCounter++
          console.log(`Finished Batch: ${batchCounter}`);
          stream.resume();
        }

        buffer.push(data);
        lineCounter++
        counter++;
      })
      .on("end", async () => {
        if (buffer.length > 0) {
          for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === 'id, styleId, url, thumbnail_url') {
              continue;
            }
            const currentEntry = buffer[i].split(",")
            const cleanedEntry = [];

            currentEntry.forEach((item) => {
              if (item[0] === '"') {
                item = item.substring(1, item.length);
              }
              if(item[item.length -1] === '"') {
                item = item.substring(0, item.length -1);
              }
              cleanedEntry.push(item);
            })

            const newPhoto = new Photo({
              id: parseInt(cleanedEntry[0]),
              styleId: parseInt(cleanedEntry[1]),
              url: cleanedEntry[2],
              thumbnail_url: cleanedEntry[3],
            }).save();
          }
        }
        console.log('FINISHED ALL BATCHES');
      });

  })
})()

