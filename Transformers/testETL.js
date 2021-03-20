const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');

const Test = require('../Models/Test.model');

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
    let counter = 0;
    let batchCounter = 0;

    // Create read stream to parse csv file
    let stream = fs.createReadStream('../Resources/sampleData.csv')
      .on("error", reject)
      .on("data", async data => {
        // Parse Data into seperate arrays
        let newData = data.toString().split("\n");

        // Iterate over every Data entry
        newData.forEach((entry) => {
          // Split single string up by commas
          let splitEntry = entry.split(/,/);
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

          // Map item entries to Schema
          const character = new Test({
            id: entryArr[0],
            genreId: entryArr[1],
            name: entryArr[2],
            age: entryArr[3],
            location: entryArr[4]
          })
          // Push document to buffer
          buffer.push(character);
          counter++;

          // Account for size of data in buffer
          if (counter > 8) {
            // Pause Stream to insert data to DB
              stream.pause()
              Test.insertMany(buffer);

              // Reset Counter and buffer then resume stream
              counter = 0;
              buffer = [];
              batchCounter++
              console.log(`Finished Batch ${batchCounter}`)
              stream.resume();
          }
        })
      })
      .on("end", async () => {

        //If any data is left, add to DB
        if ( counter > 0 ) {
          Test.insertMany(buffer);
          buffer = [];
          counter = 0;
          console.log('Finished Final Batch')
          resolve();
          }
        console.log("ENDED")
      });

  });
})()