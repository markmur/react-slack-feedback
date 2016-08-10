React Slack Feedback
=====================

React component for sending feedback from your app directly to Slack.

### Usage

Install via NPM:

```
npm install react-slack-feedback
```

To use the component, simply import it and render in your app's global component (if you want it on every page).

```js
import SlackFeedback from 'react-slack-feedback';

render() {
  return (
    <div>
      <SlackFeedback
        channel="#general" // required
        sending={false}
        onSubmit={payload => sendToSlack(payload)}
        user="Username"
        emoji=":bug:"
      />
    </div>
  );
}
```

### Props
| Prop Name     | Type   | Required      | Description |
| ------------- | ------ |:-------------:|-------------|
| channel       | string | required      | The Slack channel to send messages. Note: All slack channels are lowercase. The string should be identical to the channel name e.g '#feedback' |
| onSubmit | function |       | A JSON payload object will be returned when the user submits the form. |
| user          | string |               | The logged in user's name (if applicable) |
| emoji         | string |               | The emoji that will show in place of the users avatar on Slack |
| buttonText    | string |               | The text for the trigger button |
