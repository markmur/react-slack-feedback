const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const fetch = require('isomorphic-fetch');
const config = require('./env');

app.use(bodyParser.json());

app.post('/slack', function(req, res) {
  fetch(config.WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(req.body)
  })
  .catch(err => {
    console.error(err);
    return res.status(500).send(err);
  })
  .then(response => {
    return res.status(200).send(response);
  });
});

app.listen(3001, function () {
  console.log('EXPRESS LISTENING ON PORT 3001');
});
