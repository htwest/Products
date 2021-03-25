const express = require('express');
const mongoose = require('mongoose');

const config = require('./config.js');

const app = express();
app.use(express.json());


// IMPORT ROUTES
const testRoute = require('./Routes/test');
const productRoute = require('./Routes/products');

// ROUTES
app.get('/', (req, res) => {
  res.send('works')
})

app.use('/test', testRoute);
app.use('/products', productRoute);

// CONNECT TO DB and SERVER
mongoose.connect(config.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  app.listen(3000);
  console.log("We're connected to the server!")
});
