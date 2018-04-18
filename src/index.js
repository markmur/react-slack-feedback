import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import SlackFeedback, { SlackIcon } from './SlackFeedback';

ReactDOM.render(
  <SlackFeedback
    onSubmit={sendToSlack}
    onImageUpload={uploadImage}
    user="Mark Murray"
    emoji=":bug:"
    channel="#yab-feedback"
  />,
  document.getElementById('root')
);

/**
 * Send payload to server
 * @method sendToSlack
 * @param  {Object} payload
 * @param  {Object} headerPass
 * @return {null}
 */
function sendToSlack(payload, headerPass) {
  headerPass['Content-Type'] = 'application/json';
  fetch('/api/slack', {
    method: 'POST',
    headers: headerPass,
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(res => {
      if (res.status >= 200 && res.status < 300) {
        this.sent();
      } else {
        this.error(res);
      }
    });
}

/**
 * Upload image to server
 * @method uploadImage
 * @param  {File} file
 * @return {null}
 */
function uploadImage(file) {
  var form = new FormData();
  form.append('image', file);

  fetch('/api/upload', {
    method: 'POST',
    body: form
  })
    .then(res => {
      console.log(res.status, res.statusText);
      if (res.status < 200 || res.status >= 300) {
        this.uploadError(res.statusText);
      }

      return res.json();
    })
    .then(url => this.imageUploaded(url));
}
