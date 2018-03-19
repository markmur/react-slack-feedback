import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import SlackFeedback from './feedback';

/**
 * Send payload to server
 * @method sendToSlack
 * @param  {Object} payload
 * @return {null}
 */
const sendToSlack = payload => {
  fetch('/api/slack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
};

/**
 * Upload image to server
 * @method uploadImage
 * @param  {File} file
 * @return {null}
 */
function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);

  fetch('/api/upload', {
    method: 'POST',
    body: form
  })
    .then(function(res) {
      if (res.status < 200 || res.status >= 300) {
        this.uploadError(res.statusText);
      }

      return res.json();
    })
    .then(({ url }) => this.imageUploaded(url));
}

const root = document.getElementById('root');

ReactDOM.render(
  <SlackFeedback
    onSubmit={sendToSlack}
    onImageUpload={uploadImage}
    user="markmur"
    emoji=":bug:"
    channel="#feedback"
  />,
  root
);
