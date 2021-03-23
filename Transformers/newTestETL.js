const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');

const Character = require('../Models/Test.model');
const Genre = require('../Models/Genre.model');
const GenrePicture = require('../Models/SubTest.model');

(async function() {

  await mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

  const db = await mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("We're connected to the server!")
  });

  await new Promise((resolve,reject) => {

    let lineCount = 0;

    let stream = fs.createReadStream('../Resources/SampleData.csv');
    stream
    .on("error", reject)
    .on("data", (chunk) => {
      const data = chunk.toString().split("\n");

      for (let i = 1; i < data.length; i++) {
        lineCount++
        const splitEntry = data[i].split(",")
        const cleanedEntry = [];
        splitEntry.forEach((item) => {
          // remove quotation marks
          if (typeof(item) === 'string') {
            item = item.substring(1, item.length -1);
          }
          cleanedEntry.push(item);
        })

        const genreId = cleanedEntry[1];
        console.log(genreId);

        Genre.find({ id: genreId })
        .then((results) => {
          let genreData = results[0].genre;
          let testArr = []

          GenrePicture.find( { genreId: parseInt(genreId)} )
          .then((results) => {
            results.forEach((entry) => testArr.push(entry))

            let characterData = new Character({
            id: cleanedEntry[0],
            genre: genreData,
            name: cleanedEntry[2],
            age: cleanedEntry[3],
            location: cleanedEntry[4],
            test: testArr
            }).save();

          })
          .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
      }

    })
    .on("end", () => {
      console.log('done');
    })

  });
})()