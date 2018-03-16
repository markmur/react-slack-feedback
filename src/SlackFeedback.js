import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  SlackFeedback as StyledSlackFeedback,
  Loader,
  Container,
  Header,
  Content,
  Icon,
  Trigger,
  Tabs,
  Label,
  Checkbox,
  CheckboxLabel,
  ImageUpload,
  UploadButton,
  SubmitButton,
  FormElement
} from './styles';

const Input = FormElement.withComponent('input');
const Textarea = FormElement.withComponent('textarea');

// Images
import SlackIcon from './SlackIcon';

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
      uploadingImage: false,
      selectedType: 'Bug',
      image: {}
    };
  }

  toggle = () => {
    if (this.state.active) {
      this.close();
    } else {
      this.activate();
    }
  };

  activate = () => {
    this.setState({
      active: !this.state.active
    });

    document.addEventListener('click', this.handleClickOutside);
  };

  handleClickOutside = event => {
    if (event.defaultPrevented) return;

    if (!this.refs.SlackFeedback.contains(event.target)) {
      this.close();
    }
  };

  close = () => {
    this.setState({
      active: false
    });

    document.removeEventListener('click', this.handleClickOutside);
  };

  toggleSendURL = () => {
    this.setState({
      sendURL: !this.state.sendURL
    });
  };

  selectType = type => () => {
    this.setState({
      selectedType: type
    });
  };

  sent = () => {
    this.setState(
      {
        sending: false,
        sent: true,
        image: {},
        error: false
      },
      () => {
        this.refs.message.value = '';
        setTimeout(() => {
          this.setState({ sent: false });
        }, this.props.sentTimeout);
      }
    );
  };

  error = err => {
    this.setState(
      {
        sending: false,
        error: this.determineErrorType(err)
      },
      () => {
        setTimeout(() => {
          this.setState({ error: null });
        }, this.props.errorTimeout);
      }
    );
  };

  determineErrorType = err => {
    if (!err) return 'Unexpected Error!';
    if (typeof err === 'string') return err;

    switch (err.status) {
      case 400:
        return 'Bad Request!';
      case 403:
        return 'Forbidden!';
      case 404:
        return 'Channel Not Found!';
      case 410:
        return 'Channel is Archived!';
      case 500:
        return 'Server Error!';
      default:
        return 'Unexpected Error!';
    }
  };

  send = () => {
    var { selectedType, sendURL, image } = this.state;
    var message = this.refs.message.value;
    var level;

    this.setState({
      sending: true
    });

    // Attach the curent URL
    if (sendURL) message += `\n <${document.location.href}>`;

    // Slack accepts 3 color levels: danger (red), good (green) and warning (orange)
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

    const payload = {
      channel: this.props.channel,
      username: this.props.user,
      icon_emoji: this.props.emoji,
      attachments: [
        {
          fallback: `Feedback (${selectedType})`,
          author_name: this.props.user,
          color: level,
          title: selectedType,
          title_link: document.location.href,
          text: message,
          footer: 'React Slack Feedback'
        }
      ]
    };

    // Attach the image (if available)
    if (image.url) payload.attachments[0].image_url = image.url;

    // Submit the payload
    this.props.onSubmit.call(this, payload);
  };

  attachImage = event => {
    var { files } = event.target;

    var file = files[0];
    file.preview = window.URL.createObjectURL(file);

    this.setState(
      {
        image: file,
        uploadingImage: true
      },
      () => {
        this.props.onImageUpload.call(this, file);
      }
    );
  };

  uploadError = err => {
    this.setState(
      {
        uploading: false,
        error: 'Error Uploading Image!'
      },
      () => {
        this.removeImage();

        setTimeout(() => {
          this.setState({ error: null });
        }, this.props.errorTimeout);
      }
    );
  };

  imageUploaded = url => {
    if (typeof url !== 'string') {
      /* eslint-disable */
      console.error(
        '[SlackFeedback] `url` argument in `imageUploaded` method must be a string'
      );
      /* eslint-enable */
      this.removeImage();
      return;
    }

    // Merge the image URL with the file object,
    // the resulting object will contain only the preview and the URL.
    // Any file information will be lost
    const image = { ...this.state.image, url };

    this.setState({
      uploadingImage: false,
      image
    });
  };

  renderImageUpload = () => {
    if (this.state.image.preview) {
      return this.renderImagePreview();
    }

    return (
      <ImageUpload>
        <label className="SlackFeedback-image-upload-button" for="imageUpload">
          {this.props.imageUploadText}
        </label>

        <Input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={event => this.attachImage(event)}
        />
      </ImageUpload>
    );
  };

  removeImage = event => {
    if (event) event.preventDefault();

    this.setState({
      image: {},
      uploadingImage: false
    });
  };

  renderImagePreview = () => {
    const { image, uploadingImage } = this.state;

    if (!image.preview) return null;

    return (
      <ImagePreview
        style={{
          backgroundImage: `url(${image.preview})`
        }}
      >
        {uploadingImage ? (
          <Loader />
        ) : (
          <PreviewOverlay>
            <span onClick={this.removeImage}>Remove</span>
          </PreviewOverlay>
        )}
      </ImagePreview>
    );
  };

  render() {
    const {
      active,
      sending,
      sent,
      error,
      sendURL,
      selectedType,
      uploadingImage
    } = this.state;

    // do not show channel UI if no channel defined
    const showChannel = !!this.props.channel && this.props.showChannel;

    let submitText = 'Send Feedback';

    if (sent) submitText = 'Sent!';
    if (sending && !sent) submitText = 'Sending Feedback...';
    if (error) submitText = error;

    // Return nothing if the component has been disabled
    if (this.props.disabled) return null;

    return (
      <StyledSlackFeedback ref="SlackFeedback" className={cx({ active })}>
        <Container
          ref="container"
          style={this.props.contentStyles}
          className="fadeInUp"
        >
          <Header>
            {this.props.title}
            <div className="close" onClick={this.close}>
              {this.props.closeButton}
            </div>
          </Header>

          <Content>
            {showChannel && <Label>Channel</Label>}
            <Input value={this.props.channel} disabled hidden={!showChannel} />

            <Label>Feedback Type</Label>
            <Tabs>
              {types.map(type => (
                <li
                  onClick={this.selectType(type.label)}
                  className={cx({
                    selected: selectedType === type.label
                  })}
                >
                  type.label
                </li>
              ))}
            </Tabs>

            <Label>Your Message</Label>
            <Textarea ref="message" placeholder="Message..." />

            {/* Only render the image upload if there's callback available  */}
            {this.props.onImageUpload ? this.renderImageUpload() : null}

            <div style={{ padding: '0.5em 0 1em' }}>
              <Checkbox
                id="sendURL"
                type="checkbox"
                checked={sendURL}
                onChange={this.toggleSendURL}
              />
              <CheckboxLabel for="sendURL">
                Send URL with Feedback
              </CheckboxLabel>
            </div>

            <SubmitButton
              className={cx({
                sent,
                error,
                disabled: sending || uploadingImage
              })}
              onClick={this.send}
            >
              {submitText}
            </SubmitButton>
          </Content>
        </Container>

        <Trigger
          style={this.props.triggerStyles}
          className={cx({ active })}
          onClick={this.toggle}
        >
          {this.props.buttonText}
        </Trigger>
      </StyledSlackFeedback>
    );
  }
}

SlackFeedback.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func,
  sending: PropTypes.bool,
  channel: PropTypes.string,
  user: PropTypes.string,
  disabled: PropTypes.bool,
  emoji: PropTypes.string,
  buttonText: PropTypes.node,
  imageUploadText: PropTypes.string,
  triggerStyles: PropTypes.object,
  contentStyles: PropTypes.object,
  showChannel: PropTypes.bool,
  title: PropTypes.node,
  closeButton: PropTypes.node,
  errorTimeout: PropTypes.number,
  sentTimeout: PropTypes.number
};

SlackFeedback.defaultProps = {
  sending: false,
  user: 'Unknown User',
  disabled: false,
  emoji: ':speaking_head_in_silhouette:',
  buttonText: (
    <span>
      <SlackIcon /> Slack Feedback
    </span>
  ),
  disableImageUpload: false,
  imageUploadText: 'Attach Image',
  triggerStyles: {},
  contentStyles: {},
  showChannel: true,
  title: (
    <span>
      <SlackIcon /> Send Feedback to Slack
    </span>
  ),
  closeButton: 'close',
  errorTimeout: 8 * 1000,
  sentTimeout: 5 * 1000
};

export default SlackFeedback;
