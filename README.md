# React Slack Feedback

React component for gathering user feedback to send to slack.

![image](http://res.cloudinary.com/di0xuztdq/image/upload/v1471245001/uehkqqfarpue7auonqol.gif)

[![Build Status](https://travis-ci.org/markmur/react-slack-feedback.svg?branch=master)](https://travis-ci.org/markmur/react-slack-feedback)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

### Usage

Install with `yarn` or `npm`:

```bash
# npm
npm install react-slack-feedback

# yarn
yarn add react-slack-feedback
```

To use the component, import it and render in your app's global component,
or individual components (if you don't want it on every page).

> NOTE:
> Your Slack Webhook URL should _never_ be available on the front end.
> For this reason you must have a server which sends the request to slack.
> This component will produce the JSON object to send to Slack but it won't send
> the request for you.

```js
import SlackFeedback from 'react-slack-feedback'

const sendMessageToSlack = (payload = {}) =>
  fetch('http://localhost:8080/api/slack', {
    method: 'POST',
    data: JSON.stringify(payload)
  })).then(
    res => {
      // The `onSubmit` prop function is called with the SlackFeedback component
      // context (this.props.onSubmit.call(this, payload)), meaning the component
      // methods are available from this function. You should call the `sent`
      // method if the request was successfully sent to Slack.
      this.sent()
    })
    .catch(error => this.error(error.statusText))
  )

ReactDOM.render(
  <SlackFeedback
    // NOTE: The `onSubmit` method is called with the SlackFeedback context which
    // allows you to call `this.sent()` in the sendToSlack function. If you use
    // `payload => sendToSlack(payload)` or `sendToSlack.bind(this)` then you must
    // use a ref to call the sent method. i.e `this.refs.SlackFeedback.sent();`
    disabled // completely disable the component (default = false)
    channel="#general"
    user="Username" // The logged in user (default = "Unknown User")
    emoji=":bug:" // default = :speaking_head_in_silhouette:
    onImageUpload={uploadImage}
    onSubmit={sendMessageToSlack}
  />,
  document.getElementById('root')
)

/**
 * Upload image to server
 * @method uploadImage
 * @param  {File} image
 * @return {null}
 */
function uploadImage(image) {
  var form = new FormData()
  form.append('image', image)

  $.post('/api/upload', { data: form }).then(
    // It is important that you call the `imageUploaded` method or
    // the component will load indefinitely.
    //
    // If you've called the `uploadImage` function with `image => uploadImage(image)`,
    // you'll have to use a ref on the SlackFeedback component to access the
    // 'imageUploaded' and 'error' methods
    url => this.imageUploaded(url),
    err => this.error(err)
  )
}
```

### Props

| Prop          | Type     | Default          | Required | Description                                                                                          |
| ------------- | -------- | ---------------- | :------: | ---------------------------------------------------------------------------------------------------- |
| onSubmit      | function |                  | required | A JSON payload object will be returned when the user submits the form.                               |
| onImageUpload | function |                  |          | Method that will be called with a file argument                                                      |
| channel       | string   |                  |          | The Slack channel to send messages. The default webhook channel will be used if none is provided.    |
| user          | string   | "Unknown User"   |          | The logged in user's name (if applicable)                                                            |
| emoji         | string   | 🗣                |          | The emoji that will show in place of the users avatar on Slack                                       |
| buttonText    | string   | "Slack Feedback" |          | The text for the trigger button                                                                      |
| disabled      | boolean  | false            |          | Disable the component entirely. Returns null. Can be used to disable the component on specific pages |

> NOTE:
> All slack channels are lowercase. The string should be identical to the channel name e.g '#feedback'

### Callback Functions

| Function        | Arguments      | Description                                                                                                                                                      |
| --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sent()          |                | Should be called when the payload has been successfully sent to your sever. The submit button will display a `Sent!` message and reset the loading state.        |
| error()         | error (string) | Should be called if there's an error sending the slack payload to your server. Pass the `statusText` of the response to update the submit button.                |
| imageUploaded() | url (string)   | Should be called if an image is successfully uploaded to your server. This adds the image url to the payload JSON and resets the loading state of the component. |
| uploadError()   | error (string) | Should be called if there's an error uploading an image.                                                                                                         |

---

### Running Locally

To run this module locally:

1.  Clone the repo:

```bash
git clone https://github.com/markmur/react-slack-feedback.git
```

2.  Install the node modules

```bash
yarn
```

3.  Create a ENV file with your `WEBHOOK_URL`

`.env`

```js
WEBHOOK_URL = 'YOUR_SLACK_WEBHOOK_URL'
```

4.  Run the demo:

```bash
yarn start
```

This will bundle the client with `parcel` and startup a simple `express` server.
