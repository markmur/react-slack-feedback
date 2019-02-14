import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import SlackFeedback from '../src/slack-feedback'
import darkTheme from '../src/themes/dark'

const root = document.getElementById('root')

const parseJSON = res => res.json()

const API_URL = 'http://localhost:8080/api'

/**
 * Send payload to server
 * @method sendToSlack
 * @param  {Object} payload
 * @return {null}
 */
const sendToSlack = payload => {
  fetch(`${API_URL}/slack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(parseJSON)
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        this.sent()
      } else {
        this.error(res)
      }
    })
}

/**
 * Upload image to server
 * @method uploadImage
 * @param  {File} file
 * @return {null}
 */
function uploadImage(file) {
  const form = new FormData()
  form.append('image', file)

  fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: form
  })
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        this.uploadError(res.statusText)
      }

      return res.json()
    })
    .then(({ url }) => this.imageUploaded(url))
}

ReactDOM.render(
  <SlackFeedback
    theme={darkTheme}
    user="username"
    emoji=":bug:"
    channel="#feedback"
    onSubmit={sendToSlack}
    onImageUpload={uploadImage}
  />,
  root
)
