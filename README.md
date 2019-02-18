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

ReactDOM.render(
  <SlackFeedback
    disabled // completely disable the component (default = false)
    channel="#general"
    user="Username" // The logged in user (default = "Unknown User")
    emoji=":bug:" // default = :speaking_head_in_silhouette:
    onImageUpload={(image, success,error) => uploadImage(image).then(success).catch(error)}
    onSubmit={(payload, success, error) => sendToServer(payload, success, error)}
  />,
  document.getElementById('root')
)

function sendToServer(payload, success, error) {
  return fetch('/api/slack', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(success)
  .catch(error)
}

function uploadImage(image, success, error) {
  var form = new FormData()
  form.append('image', image)

  return fetch('/api/upload', { method: 'POST', data: form })
    .then(({ url }) => success(url))
    .catch(err => error(err))
  )
}
```

### Props

| Prop                | Type                                      | Default               | Required | Description                                                                                          |
| ------------------- | ----------------------------------------- | --------------------- | :------: | ---------------------------------------------------------------------------------------------------- |
| buttonText          | `String`                                  | "Slack Feedback"      |          | The text for the trigger button                                                                      |
| channel             | `String`                                  |                       |          | The Slack channel to send messages. The default webhook channel will be used if none is provided.    |
| defaultSelectedType | `String`                                  |                       |          |
| disabled            | `Boolean`                                 | false                 |          | Disable the component entirely. Returns null. Can be used to disable the component on specific pages |
| emoji               | `String`                                  | 🗣                     |          | The emoji that will show in place of the users avatar on Slack                                       |
| errorTimeout        | `Number`                                  | 8000 (8 seconds)      |          |                                                                                                      |
| feedbackTypes       | `Array<{ value: String, label: String }>` | See code              |          |                                                                                                      |
| icon                | `Function`                                | `() => <SlackIcon />` |          |                                                                                                      |
| onClose             | `Function`                                |                       |          |
| onImageUpload       | `Function`                                |                       |          | Method that will be called with a file argument                                                      |
| onOpen              | `Function`                                |                       |          |
| onSubmit            | `Function`                                |                       | required | A JSON payload object will be returned when the user submits the form.                               |
| sentTimeout         | `Number`                                  | 5000 (5 seconds)      |          |                                                                                                      |
| showChannel         | `Boolean`                                 | true                  |          |
| showIcon            | `Boolean`                                 | true                  |          |
| theme               | `Object`                                  | See themes directory  |          |
| translations        | `Object`                                  | See translations file |          |
| user                | `String`                                  | "Unknown User"        |          | The logged in user's name (if applicable)                                                            |

> NOTE:
> All slack channels are lowercase. The string should be identical to the channel name e.g '#feedback'

### Callback Functions

| Function      | Arguments                                               | Description |
| ------------- | ------------------------------------------------------- | ----------- |
| onSubmit      | `(payload: Object, success: Function, error: Function)` |             |
| onImageUpload | `(image: Object, success: Function, error: Function)`   |             |

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

```.env
WEBHOOK_URL='YOUR_SLACK_WEBHOOK_URL'
```

4.  Run the demo:

```bash
yarn start
```

This will bundle the client with `parcel` and startup a simple `express` server.
