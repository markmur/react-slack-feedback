import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import fetch from 'isomorphic-fetch';
import SlackFeedback from './feedback';

const App = hot(module)(({ children }) => <div>{children}</div>);

App.propTypes = {
  children: PropTypes.node.isRequired
};

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
const uploadImage = file => {
  const form = new FormData();
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
};

const root = document.getElementById('root');

ReactDOM.render(
  <App>
    <SlackFeedback
      onSubmit={sendToSlack}
      onImageUpload={uploadImage}
      user="markmur"
      emoji=":bug:"
      channel="#feedback"
    />
  </App>,
  root
);
