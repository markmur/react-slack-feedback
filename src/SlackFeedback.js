import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

// classnames
import classNames from 'classnames';

// Images
import SlackIcon from './SlackIcon';
import './SlackFeedback.scss';

const propTypes = {
  channel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  sending: PropTypes.bool,
  user: PropTypes.string,
  emoji: PropTypes.string,
  buttonText: PropTypes.string,
  disableImageUpload: PropTypes.bool
};

const defaultProps = {
  sending: false,
  user: 'Unknown User',
  emoji: ':speaking_head_in_silhouette:',
  buttonText: 'Slack Feedback',
  disableImageUpload: false
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
      sendURL: true,
      sent: false,
      error: false,
      selectedType: 'Bug'
    };
  }

  toggle() {
    if (this.state.active) {
      this.close();
    } else {
      this.activate();
    }
  }

  activate() {
    this.setState({
      active: !this.state.active
    });

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(e) {
    if (!this.refs.SlackFeedback.contains(e.target)) {
      this.close();
    }
  }

  close() {
    this.setState({
      active: false
    });

    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleSendURL() {
    this.setState({ sendURL: !this.state.sendURL });
  }

  selectType(e) {
    this.setState({ selectedType: e.target.innerText });
  }

  error(err) {
    console.warn(err);

    this.setState({
      sending: false,
      error: true
    }, () => {
      setTimeout(() => {
        this.setState({ error: false })
      }, 5 * 1000);
    });
  }

  sent() {
    this.setState({
      sending: false,
      sent: true
    }, () => {
      setTimeout(() => {
        this.setState({ sent: false })
      }, 5 * 1000);
    });
  }

  send() {
    var { selectedType, sendURL } = this.state;

    var message = this.refs.message.value;
    var level;

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

    var body = {
      channel: this.props.channel,
      username: this.props.user,
      icon_emoji: this.props.emoji,
      attachments: [
        {
          fallback: `Feedback (${selectedType})`,
          color: level,
          title: selectedType,
          title_link: document.location.href,
          text: message,
          footer: 'React Slack Feedback',
          // ts: new Date().getTime()
        }
      ]
    };

    this.props.onSubmit.call(this, body);
  }

  render() {
    var {
      active,
      sending,
      sent,
      error,
      sendURL,
      selectedType
    } = this.state;

    var submitText = 'Send Feedback';

    if (sent) submitText = 'Sent!';
    if (sending && !sent) submitText = 'Sending Feedback...';
    if (error) submitText = 'Error!';

    return (
      <div ref="SlackFeedback" id="SlackFeedback" class={classNames('SlackFeedback', { active })}>
        <div ref="container" class="SlackFeedback--container fadeInUp">
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
              class={classNames('submit', { sent, error, disabled: sending })}
              onClick={::this.send}>
              {submitText}
            </button>
          </div>

        </div>

        <div
          class={classNames('SlackFeedback--trigger', { active })}
          onClick={::this.toggle}>
          <SlackIcon /> {this.props.buttonText}
        </div>
      </div>
    );
  }
}

SlackFeedback.propTypes = propTypes;
SlackFeedback.defaultProps = defaultProps;

export default SlackFeedback;
