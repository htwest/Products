const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');
const { Readable } = require('stream');
const csv = require('csv-parser');

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

    // Create counters to use for keeping track of data progress
    // counter is used for breaking up the documents into smaller segments
    // lineCounter is used for bug-testing
    // batchCounter is used to keep track of the batches being imported into DB
    let counter = 0;
    let lineCounter = 0;
    let batchCounter = 0;
    let data = []

    // Create read stream to parse csv file
    let stream = fs.createReadStream('../Resources/photos.csv');
    stream
      .on("error", reject)
      .on("data", chunk => {

        // Parse Data into seperate arrays, removing header fields
        var chunk = chunk.toString().split("\n")
        if (chunk[lineCounter] === 'id, styleId, url, thumbnail_url') {
          chunk.shift();
        }

        // Iterate over every Data entry
        chunk.forEach((entry) => {
          lineCounter++;

          // Split single string up by commas
          let splitEntry = entry.split(",");
          let entryArr = []

          // Iterate over comma seperated string
          splitEntry.forEach((item) => {

            // Remove all double quotes from each item to clean
            if (item[0] === '"') {
              item = item.substring(1, item.length);
            }
            if (item[item.length - 1] === '"') {
              item = item.substring(0, item.length -1);
            }
            // Push item to array
            entryArr.push(item);
          })

          // if (isNaN(parseInt(entryArr[0])) || isNaN(parseInt(entryArr[1]))) {
          //   if (fragment) {
          //     console.log('FullLine', fragment + entry);
          //     fragment = '';
          //   } else {
          //     fragment = entry;
          //     console.log('Fragment Saved', fragment);
          //   }
          //   return;
          // }

          // Map item entries to Schema
          const photoData = new Photo({
            id: parseInt(entryArr[0]),
            styleId: parseInt(entryArr[1]),
            url: entryArr[2],
            thumbnail_url: entryArr[3],
          })
          .save();

        })
        // stream.resume();
      })
      .on("end", async () => {

        console.log('ENDED');
      });

  })
})()