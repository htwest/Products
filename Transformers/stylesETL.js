const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config.js');
const { Readable } = require('stream');
const csv = require('csv-parser');

(async function() {

  await mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

  const db = await mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log("We're connected to the server!")
  });

  await new Promise((resolve,reject) => {
    let stream = fs.createReadStream();
    stream
    .on("error", reject)
    .on("data", chunk => {


    })
    .on("end", () => {
      console.log('done');
    })

  });
})()