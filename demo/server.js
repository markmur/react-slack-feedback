const path = require('path')
const cors = require('cors')
const fs = require('fs-extra')
const rimraf = require('rimraf')
const multer = require('multer')
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('isomorphic-fetch')

const UPLOADS = 'uploads'
const PORT = process.env.PORT || 8080
const VALID_MIMETYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']

const app = express()

app.use(cors())

app.use(express.static(path.resolve(UPLOADS)))

const upload = multer({ dest: UPLOADS })

// Send payload to Slack
app.post('/api/slack', bodyParser.json(), (req, res) => {
  fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(req.body)
  }).then(response => {
    // NOTE not sending the full response back to the client because it contains
    // the slack webhook url
    return res.status(response.status).send({
      status: response.status,
      statusText: response.statusText
    })
  })
})

// Save image locally, images will be deleted when the server connection is closed
app.post('/api/upload', upload.single('image'), (req, res) => {
  const ext = req.file.originalname.split('.').pop()

  if (!VALID_MIMETYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: 'Invalid mimetype'
    })
  }

  setTimeout(() => {
    res.status(200).json({
      url: `http://localhost:${PORT}/${req.file.path}.${ext}`
    })
  }, 2000)
})

// Listen
app.listen(PORT, err => {
  if (err) throw err

  fs.ensureDir(UPLOADS)

  console.log(`Server listening on http://localhost:${PORT}`)
})

process.on('SIGINT', () => {
  console.log('Closing server. Removing uploads folder...')
  rimraf.sync(UPLOADS)
})
