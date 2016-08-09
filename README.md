React Slack Feedback
=====================

React component for sending feedback from your app directly to Slack.

> NOTE Currently in pre-release phase

### Usage

Install via NPM:

```
npm install react-slack-feedback
```

To use the component, simply import it and render in your app's global component (if you want it on every page).

```javascript
import SlackFeedback from 'react-slack-feedback';
```

```javascript
<SlackFeedback
  webhook={webhookURL} // required
  channel="#general" // required
  user="Username"
  emoji=":bug:"
/>
```

### Props
| Prop Name     | Type   | Required      | Description |
| ------------- | ------ |:-------------:|-------------|
| channel       | string | required      | The Slack channel to send messages. Note: All slack channels are lowercase. The string should be identical to the channel name e.g '#feedback' |
| webhook       | string | required      | The Slack Webhook URL for the integration |
| user          | string |               | The logged in user's name (if applicable) |
| emoji         | string |               | The emoji that will show in place of the users avatar on Slack |
| buttonText    | string |               | The text for the trigger button |


### Missing Features

This project is currently in alpha stages and many more features are expected to be released soon. That being said, feel free to create an [issue](https://github.com/markmur/react-slack-feedback/issues) and tag it as a "Feature".

### Dependencies

* [classnames](https://github.com/jedwatson/classnames)
* [whatwg-fetch](https://github.com/github/whatwg-fetch)
* [es6-promise](https://github.com/stefanpenner/es6-promise)
