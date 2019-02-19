import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import cx from 'classnames'
import { merge } from './utils'

import defaultTranslations from './translations'

import { default as SlackIcon } from './slack-icon'
import {
  CloseButton,
  Container,
  Content,
  FormElement,
  Header,
  ImagePreview,
  ImageUpload,
  Label,
  Loader,
  PreviewOverlay,
  SlackFeedback as StyledSlackFeedback,
  SubmitButton,
  Tabs,
  Trigger,
  UploadButton
} from './styles'

import defaultTheme from './themes/default'

const BUG = 'bug'
const IMPROVEMENT = 'improvement'
const FEATURE = 'feature'

class SlackFeedback extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      sending: false,
      sent: false,
      error: false,
      uploadingImage: false,
      selectedType:
        props.defaultSelectedType || this.props.feedbackTypes[0].value,
      image: {},
      message: ''
    }

    // Create reference to container
    this.SlackFeedback = React.createRef()
  }

  static getDerivedStateFromProps(state, props) {
    if (props.defaultSelectedType !== state.selectedType) {
      return {
        selectedType: props.defaultSelectedType || props.feedbackTypes[0].value
      }
    }

    return null
  }

  translate = key => {
    const { translations } = this.props

    return typeof translations === 'object' && key in translations
      ? translations[key]
      : ''
  }

  handleChange = key => event =>
    this.setState({
      [key]: event.target.value
    })

  toggle = () => {
    if (this.state.open) {
      this.close()
    } else {
      this.activate()
    }
  }

  activate = () => {
    this.setState(
      ({ open }) => ({
        open: !open
      }),
      this.props.onOpen
    )

    document.addEventListener('click', this.handleClickOutside)
  }

  handleClickOutside = event => {
    if (event.defaultPrevented) return

    if (
      this.SlackFeedback &&
      this.SlackFeedback.current &&
      !this.SlackFeedback.current.contains(event.target)
    ) {
      this.close()
    }
  }

  close = () => {
    this.setState(
      {
        open: false
      },
      () => {
        this.props.onClose()
      }
    )

    document.removeEventListener('click', this.handleClickOutside)
  }

  selectType = value => () =>
    this.setState({
      selectedType: value
    })

  resetSentState = () => {
    this.setState(
      {
        message: ''
      },
      () => {
        setTimeout(() => {
          this.setState({ sent: false })
        }, this.props.sentTimeout)
      }
    )
  }

  onSubmitSuccess = () => {
    this.setState(
      {
        sending: false,
        sent: true,
        image: {},
        error: false
      },
      () => this.resetSentState()
    )
  }

  onSubmitError = error =>
    this.setState(
      {
        sending: false,
        error: this.determineErrorType(error)
      },
      () => {
        setTimeout(() => {
          this.setState({ error: null })
        }, this.props.errorTimeout)
      }
    )

  determineErrorType = err => {
    if (!err) return this.translate('error.unexpected')

    if (typeof err === 'string') return err

    switch (err.status) {
      case 400:
        return this.translate('error.badrequest')
      case 403:
        return this.translate('error.forbidden')
      case 404:
        return this.translate('error.notfound')
      case 410:
        return this.translate('error.archived')
      case 500:
        return this.translate('error.internal')
      default:
        return this.translate('error.unexpected')
    }
  }

  send = () => {
    const { selectedType, image } = this.state
    let level = 'warning'

    this.setState({ sending: true })

    // Slack accepts 3 color levels: danger (red), good (green) and warning (orange)
    switch (selectedType) {
      case BUG:
        level = 'danger'
        break
      case FEATURE:
        level = 'good'
        break
      case IMPROVEMENT:
        level = 'warning'
        break
      default:
        level = 'warning'
        break
    }

    const payload = {
      channel: this.props.channel,
      username: this.props.user,
      attachments: [
        {
          fallback: `Feedback (${selectedType})`,
          author_name: this.props.user,
          color: level,
          title: selectedType,
          title_link: document.location.href,
          text: this.state.message,
          footer: this.translate('footer.text')
        }
      ]
    }

    // Attach the image (if available)
    if (image.url) payload.attachments[0].image_url = image.url

    // Submit the payload
    this.props.onSubmit(
      payload,
      this.onSubmitSuccess.bind(this),
      this.onSubmitError.bind(this)
    )
  }

  attachImage = event => {
    const { files } = event.target

    const file = files[0]
    file.preview = window.URL.createObjectURL(file)

    this.setState(
      {
        image: file,
        uploadingImage: true
      },
      () => {
        this.props.onImageUpload(
          file,
          this.onImageUploadSuccess.bind(this),
          this.onImageUploadError.bind(this)
        )
      }
    )
  }

  onImageUploadError = error => {
    let errorMessage = this.translate('error.upload')

    if (error && typeof error === 'string') {
      errorMessage = error
    }

    this.setState(
      {
        uploadingImage: false,
        error: errorMessage
      },
      () => {
        this.removeImage()

        setTimeout(() => {
          this.setState({ error: null })
        }, this.props.errorTimeout)
      }
    )
  }

  onImageUploadSuccess = url => {
    if (typeof url !== 'string') {
      console.error(
        '[SlackFeedback] `url` argument in `imageUploaded` method must be a string'
      )
      this.removeImage()
      return
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
    }))
  }

  renderImageUpload = () => {
    if (this.state.image.preview) {
      return this.renderImagePreview()
    }

    return (
      <ImageUpload>
        <UploadButton htmlFor="imageUpload">
          {this.translate('upload.text')}
        </UploadButton>

        <FormElement
          as="input"
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={event => this.attachImage(event)}
        />
      </ImageUpload>
    )
  }

  removeImage = event => {
    if (event) event.preventDefault()

    this.setState({
      image: {},
      uploadingImage: false
    })
  }

  renderImagePreview = () => {
    const { image = {}, uploadingImage } = this.state

    if (!image.preview) return null

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
            <span onClick={this.removeImage}>
              {this.translate('image.remove')}
            </span>
          </PreviewOverlay>
        )}
      </ImagePreview>
    )
  }

  render() {
    // Return nothing if the component has been disabled
    if (this.props.disabled) return null

    const {
      open,
      sending,
      sent,
      error,
      selectedType,
      uploadingImage
    } = this.state

    const { channel } = this.props

    const Icon = this.props.icon

    // Do not show channel UI if no channel defined
    const showChannel = Boolean(channel) && this.props.showChannel

    let submitText = this.translate('submit.text')

    if (sent) submitText = this.translate('submit.sent')
    if (sending && !sent) submitText = this.translate('submit.sending')
    if (error) submitText = error

    const theme = merge(defaultTheme, this.props.theme)

    return (
      <ThemeProvider theme={theme}>
        <StyledSlackFeedback
          ref={this.SlackFeedback}
          className={cx({ active: open })}
        >
          <Container className={cx('fadeInUp', { active: open })}>
            <Header>
              {this.props.showIcon ? <Icon /> : null}{' '}
              {this.translate('header.title')}
              <CloseButton className="close" onClick={this.close}>
                {this.translate('close')}
              </CloseButton>
            </Header>

            <Content>
              {showChannel && (
                <span id="channel">
                  <Label htmlFor="channel">
                    {this.translate('label.channel')}
                  </Label>
                  <FormElement disabled as="input" value={this.props.channel} />
                </span>
              )}

              <Label>{this.translate('label.type')}</Label>
              <Tabs>
                {this.props.feedbackTypes.map(type => (
                  <li
                    key={type.value}
                    className={cx({
                      selected: selectedType === type.value
                    })}
                    title={type.label}
                    onClick={this.selectType(type.value)}
                  >
                    {type.label}
                  </li>
                ))}
              </Tabs>

              <Label>{this.translate('label.message')}</Label>
              <FormElement
                as="textarea"
                name="message"
                value={this.state.message}
                placeholder={this.translate('placeholder')}
                onChange={this.handleChange('message')}
              />

              {/* Only render the image upload if there's callback available  */}
              {this.props.onImageUpload ? this.renderImageUpload() : null}

              <SubmitButton
                disabled={sending || uploadingImage || !this.state.message}
                className={cx({
                  sent,
                  error
                })}
                onClick={this.send}
              >
                {submitText}
              </SubmitButton>
            </Content>
          </Container>

          <Trigger className={cx({ active: open })} onClick={this.toggle}>
            {this.props.showIcon ? <Icon /> : null}{' '}
            {this.translate('trigger.text')}
          </Trigger>
        </StyledSlackFeedback>
      </ThemeProvider>
    )
  }
}

SlackFeedback.propTypes = {
  channel: PropTypes.string,
  defaultSelectedType: PropTypes.string,
  disabled: PropTypes.bool,
  errorTimeout: PropTypes.number,
  feedbackTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  icon: PropTypes.func,
  onClose: PropTypes.func,
  onImageUpload: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  sentTimeout: PropTypes.number,
  showChannel: PropTypes.bool,
  showIcon: PropTypes.bool,
  theme: PropTypes.object,
  translations: PropTypes.object,
  user: PropTypes.string
}

SlackFeedback.defaultProps = {
  channel: '',
  defaultSelectedType: null,
  disabled: false,
  errorTimeout: 8 * 1000,
  feedbackTypes: [
    { value: BUG, label: defaultTranslations['feedback.type.bug'] },
    {
      value: IMPROVEMENT,
      label: defaultTranslations['feedback.type.improvement']
    },
    { value: FEATURE, label: defaultTranslations['feedback.type.feature'] }
  ],
  icon: () => <SlackIcon />,
  onClose: () => {},
  onOpen: () => {},
  sentTimeout: 5 * 1000,
  showChannel: true,
  showIcon: true,
  theme: defaultTheme,
  translations: defaultTranslations,
  user: 'Unknown User'
}

SlackFeedback.defaultTheme = defaultTheme
SlackFeedback.SlackIcon = SlackIcon

export default SlackFeedback
