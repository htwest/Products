const express = require('express');

const app = express();
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.send('works')
})

// SERVER
app.listen(3000);