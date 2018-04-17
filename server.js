const express = require('express');
const fs = require('fs');
const app = express();
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const cloudinary = require('cloudinary');
const config = require('./env');

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET
});

var jsonParser = bodyParser.json();

// Send payload to Slack
app.post('/api/slack', jsonParser, (req, res) => {
  fetch(config.WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(req.body)
  })
  .then(response => {
    // NOTE not sending the full response back to the client because it contains
    // the slack webhook url
    return res.status(response.status).send({
      status: response.status,
      statusText: response.statusText
    });
  });
});

// Upload image to Cloudinary
app.post('/api/upload', upload.single('image'), (req, res) => {

  var stream = cloudinary.uploader.upload_stream(result => {
    fs.unlink(req.file.path);
    return res.status(200).send(JSON.stringify(result.url));
  });

  var file_reader = fs.createReadStream(req.file.path).pipe(stream);

});

// Listen
app.listen(3001);
