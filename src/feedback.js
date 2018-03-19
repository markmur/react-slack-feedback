import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import cx from 'classnames';
import merge from 'lodash.merge';
import SlackIcon from './slack-icon';
import {
  SlackFeedback as StyledSlackFeedback,
  Loader,
  Container,
  Header,
  Content,
  Trigger,
  Tabs,
  Label,
  Checkbox,
  CheckboxLabel,
  ImageUpload,
  ImagePreview,
  PreviewOverlay,
  UploadButton,
  SubmitButton,
  FormElement
} from './styles';
import defaultTheme from './theme';

const Input = FormElement.withComponent('input');
const Textarea = FormElement.withComponent('textarea');

class SlackFeedback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: true,
      sendURL: true,
      sent: false,
      error: false,
      uploadingImage: false,
      selectedType: props.defaultSelectedType,
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
    this.setState(({ active }) => ({
      active: !active
    }));

    document.addEventListener('click', this.handleClickOutside);
  };

  handleClickOutside = event => {
    if (event.defaultPrevented) return;

    if (!this.SlackFeedback.contains(event.target)) {
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
    this.setState(({ sendURL }) => ({
      sendURL: !sendURL
    }));
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
        this.message.value = '';
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
    const { selectedType, sendURL, image } = this.state;
    let message = this.message.value;
    let level;

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
      default:
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
    const { files } = event.target;

    const file = files[0];
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
    let errorMessage = 'Error uploading image!';

    if (err && typeof err === 'string') {
      errorMessage = err;
    }

    this.setState(
      {
        uploadingImage: false,
        error: errorMessage
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
      console.error(
        '[SlackFeedback] `url` argument in `imageUploaded` method must be a string'
      );
      this.removeImage();
      return;
    }

    // Merge the image URL with the file object,
    // the resulting object will contain only the preview and the URL.
    // Any file information will be lost
    this.setState(({ image }) => ({
      uploadingImage: false,
      image: {
        ...image,
        url
      }
    }));
  };

  renderImageUpload = () => {
    if (this.state.image.preview) {
      return this.renderImagePreview();
    }

    return (
      <ImageUpload>
        <UploadButton htmlFor="imageUpload">
          {this.props.imageUploadText}
        </UploadButton>

        <Input
          type="file"
          id="imageUpload"
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

    // Do not show channel UI if no channel defined
    const showChannel = Boolean(this.props.channel) && this.props.showChannel;

    let submitText = 'Send Feedback';

    if (sent) submitText = 'Sent!';
    if (sending && !sent) submitText = 'Sending Feedback...';
    if (error) submitText = error;

    // Return nothing if the component has been disabled
    if (this.props.disabled) return null;

    const theme = merge({}, defaultTheme, this.props.theme);

    return (
      <ThemeProvider theme={theme}>
        <StyledSlackFeedback
          innerRef={c => {
            this.SlackFeedback = c;
          }}
          className={cx({ active })}
        >
          <Container
            innerRef={c => {
              this.container = c;
            }}
            className={cx('fadeInUp', { active })}
          >
            <Header>
              {this.props.title}
              <div className="close" onClick={this.close}>
                {this.props.closeButton}
              </div>
            </Header>

            <Content>
              {showChannel && <Label>Channel</Label>}
              <Input
                value={this.props.channel}
                disabled
                hidden={!showChannel}
              />

              <Label>Feedback Type</Label>
              <Tabs>
                {this.props.feedbackTypes.map(type => (
                  <li
                    key={type.value}
                    onClick={this.selectType(type.label)}
                    className={cx({
                      selected: selectedType === type.label
                    })}
                  >
                    {type.label}
                  </li>
                ))}
              </Tabs>

              <Label>Your Message</Label>
              <Textarea
                innerRef={c => {
                  this.message = c;
                }}
                placeholder="Message..."
              />

              {/* Only render the image upload if there's callback available  */}
              {this.props.onImageUpload ? this.renderImageUpload() : null}

              <div style={{ padding: '0.5em 0 1em' }}>
                <Checkbox
                  id="sendURL"
                  type="checkbox"
                  checked={sendURL}
                  onChange={this.toggleSendURL}
                />
                <CheckboxLabel htmlFor="sendURL">
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

          <Trigger className={cx({ active })} onClick={this.toggle}>
            {this.props.buttonText}
          </Trigger>
        </StyledSlackFeedback>
      </ThemeProvider>
    );
  }
}

const defaultFeedbackTypes = [
  { value: 'bug', label: 'Bug' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'feature', label: 'Feature Request' }
];

SlackFeedback.propTypes = {
  channel: PropTypes.string,
  user: PropTypes.string,
  disabled: PropTypes.bool,
  emoji: PropTypes.string,
  buttonText: PropTypes.node,
  defaultSelectedType: PropTypes.string,
  feedbackTypes: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  imageUploadText: PropTypes.string,
  showChannel: PropTypes.bool,
  title: PropTypes.node,
  closeButton: PropTypes.node,
  errorTimeout: PropTypes.number,
  sentTimeout: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func,
  theme: PropTypes.object
};

const noop = () => {};

const defaultButtonText = (
  <span>
    <SlackIcon /> Slack Feedback
  </span>
);

const defaultTitle = (
  <span>
    <SlackIcon /> Send Feedback to Slack
  </span>
);

SlackFeedback.defaultProps = {
  channel: '',
  user: 'Unknown User',
  disabled: false,
  emoji: ':speaking_head_in_silhouette:',
  buttonText: defaultButtonText,
  imageUploadText: 'Attach Image',
  defaultSelectedType: 'Bug',
  feedbackTypes: defaultFeedbackTypes,
  showChannel: true,
  title: defaultTitle,
  closeButton: 'close',
  errorTimeout: 8 * 1000,
  sentTimeout: 5 * 1000,
  onImageUpload: noop,
  theme: defaultTheme
};

SlackFeedback.defaultTheme = defaultTheme;

export default SlackFeedback;
