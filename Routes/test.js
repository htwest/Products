const express = require('express');
const testRouter = express.Router();
const Test = require('../Models/test-models/Test.model');

testRouter.use(express.json());

// localhost:3000/test
testRouter.get('/', (req, res) => {
  res.send(req.query)
});

// localhost:3000/test/more
testRouter.get('/more', (req, res) => {
  res.send('More Tests is working');
})

// localhost:3000/test
    // Map post data to Schema
testRouter.post('/', (req, res) => {
  const post = new Test({
    title: req.body.title,
    body: {
      header: req.body.body.header,
      text: req.body.body.text
    },
    date: req.body.date
  })

    // Save to the Database collection
  post.save()
  .then((data) => {
    res.sendStatus(200)
  })
  .catch((err) => {
    console.log(err);
  })

})


module.exports = testRouter;