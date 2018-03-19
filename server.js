const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./env');

const app = express();

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8081;

const jsonParser = bodyParser.json();

// Send payload to Slack
app.post('/slack', jsonParser, (req, res) => {
  fetch(config.WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(req.body)
  }).then(response => {
    // NOTE not sending the full response back to the client because it contains
    // the slack webhook url
    return res.status(response.status).send({
      status: response.status,
      statusText: response.statusText
    });
  });
});

// Upload image to Cloudinary
app.post('/upload', upload.single('image'), (req, res) => {
  return res.json({ url: req.file.path });
});

// Listen
app.listen(PORT, err => {
  if (err) throw err;

  console.log(`Listening on port ${PORT}`);
});
