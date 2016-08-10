import React from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';
import SlackFeedback from './SlackFeedback';

function sendToSlack(payload) {
  fetch('/api/slack', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .catch(err => {
    console.error(err);
  })
  .then(res => {
    console.log(res);
    this.sent();
  });
}

ReactDOM.render(
  <SlackFeedback
    onSubmit={sendToSlack}
    user="Mark Murray"
    emoji=":bug:"
    channel="#yab-feedback"
  />, document.getElementById('root'));
