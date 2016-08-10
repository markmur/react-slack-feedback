React Slack Feedback
=====================

React component for gathering user feedback to send to slack.

### Usage

Install via NPM:

```
npm install react-slack-feedback
```

To use the component, import it and render in your app's global component,
or individual components (if you don't want it on every page).

> NOTE
Your Slack Webhook URL should _never_ be available on the front end.
For this reason you must have a server which sends the request to slack.
This component will produce the JSON object to send to Slack but it won't send
the request for you.

```js
import SlackFeedback from 'react-slack-feedback';

/**
 * Send the Slack message to your server
 * @param  {Object} payload
 * @return {null}
 */
function sendToSlack(payload) {
  $.post('/api/slack', {
    data: payload
  }).then(res => {

    // The `onSubmit` prop function is called with the SlackFeedback component
    // context (this.props.onSubmit.call(this, payload)), meaning the component
    // methods are available from this function. You should call the `sent`
    // method if the request was successfully sent to Slack.
    this.sent();
  });
}

<SlackFeedback
  // required
  channel="#general"
  // Important: Not `sendToSlack.bind(this)` or `payload => sendToSlack(payload)`
  // otherwise the `sent` method will not be available.
  onSubmit={sendToSlack}
  user="Users Name"
  emoji=":bug:" // default = :speaking_head_in_silhouette:
/>
```

### Props
| Prop Name     | Type   | Required      | Description |
| ------------- | ------ |:-------------:|-------------|
| channel       | string | required      | The Slack channel to send messages. Note: All slack channels are lowercase. The string should be identical to the channel name e.g '#feedback' |
| onSubmit | function | required | A JSON payload object will be returned when the user submits the form. |
| user          | string |               | The logged in user's name (if applicable) |
| emoji         | string |               | The emoji that will show in place of the users avatar on Slack |
| buttonText    | string |               | The text for the trigger button |

### Running Locally

To run this module locally:

1. Clone the repo:

```bash
git clone https://github.com/markmur/react-slack-feedback.git
```

2. Install the node modules

```bash
npm install
```

3. Create an ENV file with your `WEBHOOK_URL`

`./env.js`
```
module.exports = {
  WEBHOOK_URL: 'YOUR_SLACK_WEBHOOK_URL'
};
```

4. Run the `Procfile` with `foreman`:

```bash
nf start
```

This will start the `webpack-dev-server` and an `express` backend server.
The component will be available at http://localhost:3000
