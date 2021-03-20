const express = require('express');
const mongoose = require('mongoose');

const config = require('./config.js');
const sampleTransformer = require('./Transformers/sampleTransformer.js');

const app = express();
app.use(express.json());


// IMPORT ROUTES
const testRoute = require('./Routes/test');
app.use('/test', testRoute);

// ROUTES
app.get('/', (req, res) => {
  res.send('works')
})


// CONNECT TO DB
mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're connected to the server!")
});


// SERVER
app.listen(3000);

// DATA IMPORT AND TRANSFORMATION
// sampleTransformer();