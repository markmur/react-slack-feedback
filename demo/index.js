import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import SlackFeedback from '../src/slack-feedback'
import theme from '../src/themes/slack'

const root = document.querySelector('#root')

const parseJSON = res => res.json()

const API_URL = 'http://localhost:8080/api'

/**
 * Send payload to server
 * @param {Object} payload - payload
 * @param {Function} success - success callback
 * @param {Function} error - error callback
 * @return {Promise} returns promise
 */
const sendToSlack = (payload, success, error) => {
  return fetch(`${API_URL}/slack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        error(res)
        throw res
      }

      return res
    })
    .then(parseJSON)
    .then(success)
}

/**
 * Upload image to server
 * @method uploadImage
 * @param  {File} file
 * @return {null}
 */
function uploadImage(file, success, error) {
  const form = new FormData()
  form.append('image', file)

  fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: form
  })
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        error(res.statusText)
        throw res
      }

      return res.json()
    })
    .then(({ url }) => success(url))
}

ReactDOM.render(
  <SlackFeedback
    theme={theme}
    user="username"
    emoji=":bug:"
    channel="#feedback"
    onSubmit={(payload, success, error) => sendToSlack(payload, success, error)}
    onImageUpload={(file, success, error) => uploadImage(file, success, error)}
  />,
  root
)
