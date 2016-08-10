import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// classnames
import classNames from 'classnames';

// Promises polyfill
require('es6-promise').polyfill();

// Fetch
import 'whatwg-fetch';

// Images
import SlackIcon from './SlackIcon';
import './SlackFeedback.scss';

const propTypes = {
  user: PropTypes.string,
  channel: PropTypes.string.isRequired,
  webhook: PropTypes.string.isRequired,
  emoji: PropTypes.string,
  buttonText: PropTypes.string
};

const defaultProps = {
  user: 'Unknown User',
  emoji: ':speaking_head_in_silhouette:',
  buttonText: 'Slack Feedback'
};

const types = [
  { value: 'bug', label: 'Bug' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'feature', label: 'Feature Request' }
];

class SlackFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      sending: false,
      sendURL: true,
      selectedType: 'Bug'
    };
  }

  activate() {
    this.setState({
      active: !this.state.active
    });
  }

  close() {
    this.setState({ active: false });
  }

  toggleSendURL() {
    this.setState({ sendURL: !this.state.sendURL });
  }

  selectType(e) {
    this.setState({ selectedType: e.target.innerText });
  }

  send() {
    var { selectedType, sendURL } = this.state;
    var level;
    var message = this.refs.message.value;

    this.setState({ sending: true });

    if (sendURL) message += `\n <${document.location.href}>`;

    switch (selectedType) {
      case 'Bug':
        level = 'danger';
        break;
      case 'Feature':
        level = 'good';
        break;
      case 'Improvement':
        level = 'warning';
        break;
    }

    var body = JSON.stringify({
      channel: this.props.channel,
      username: this.props.user,
      icon_emoji: this.props.emoji,
      attachments: [
        {
          fallback: `Feedback (${selectedType})`,
          color: level,
          title: `Feedback (${selectedType})`,
          title_link: document.location.href,
          text: message,
          footer: 'React Slack Feedback',
          ts: Date.now()
        }
      ]
    });

    fetch(this.props.webhook, {
      method: 'POST',
      body
    }).then(() => {
      this.setState({ sending: false });
    });
  }

  render() {
    var {
      active,
      sending,
      sendURL,
      selectedType
    } = this.state;

    return (
      <div id="SlackFeedback" class={classNames('SlackFeedback', { active })}>
        <div class="SlackFeedback--container fadeInUp">
          <div class="SlackFeedback--header">
            <SlackIcon /> Send Feedback to Slack
            <div class="close" onClick={::this.close}>close</div>
          </div>

          <div class="SlackFeedback--content">

            <label class="SlackFeedback--label">Channel</label>
            <input class="SlackFeedback--input" value={this.props.channel} disabled />

            <label class="SlackFeedback--label">Feedback Type</label>
            <ul class="SlackFeedback--tabs">
              <li onClick={::this.selectType} class={classNames({
                  selected: selectedType === 'Bug'
                })}>Bug</li>
              <li onClick={::this.selectType} class={classNames({
                  selected: selectedType === 'Feature'
                })}>Feature</li>
              <li onClick={::this.selectType} class={classNames({
                  selected: selectedType === 'Improvement'
                })}>Improvement</li>
            </ul>

            <label class="SlackFeedback--label">Your Message</label>
            <textarea ref="message" class="SlackFeedback--textarea" placeholder="Message..." />

            <div style={{ padding: '0.5em 0 1em' }}>
              <input id="sendURL" class="SlackFeedback--checkbox" type="checkbox" checked={sendURL} onChange={::this.toggleSendURL} />
              <label for="sendURL" class="SlackFeedback--checkbox-label">Send URL with Feedback</label>
            </div>

            <button
              class={classNames('submit', { disabled: sending })}
              onClick={::this.send}>
              {sending ? 'Sending Feedback...' : 'Send Feedback'}
            </button>
          </div>

        </div>

        <div class={classNames('SlackFeedback--trigger', { active })} onClick={::this.activate}>
          <SlackIcon /> {this.props.buttonText}
        </div>
      </div>
    );
  }
}

SlackFeedback.propTypes = propTypes;
SlackFeedback.defaultProps = defaultProps;

export default SlackFeedback;
