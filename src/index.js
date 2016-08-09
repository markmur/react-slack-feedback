import React from 'react';
import ReactDOM from 'react-dom';
import SlackFeedback from './SlackFeedback';
import { WEBHOOK_URL } from './env';

ReactDOM.render(
  <SlackFeedback
    user="Mark Murray"
    channel="#yab-feedback"
    webhook={WEBHOOK_URL}
  />, document.getElementById('root'));
