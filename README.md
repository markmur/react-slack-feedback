React Slack Feedback
=====================

React component for sending feedback from your app directly to Slack.

> NOTE Currently in pre-release phase

### Usage

Install via NPM:

```
npm install react-slack-feedback
```

If you're using ES5, import the component with require:
```javascript
const SlackFeedback = require('react-slack-feedback');
```

If you're using ES6, import the component:
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
| Prop Name     | Required      | Description |
| ------------- |:-------------:|-------------|
| channel       | required      | The Slack channel to send messages |
| webhook       | required      | The Slack Webhook URL for the integration |
| user          |               | The logged in user's name (if applicable) |
| emoji         |               | The emoji that will show in place of the users avatar on Slack |
| buttonText    |               | The text for the trigger button |


### Missing Features

This project is currently in alpha stages and many more features are expected to be released soon. That being said, feel free to create an [issue](https://github.com/markmur/react-slack-feedback/issues) and tag it as a "Feature".

### Dependencies

* React
* ReactDOM
* [classnames](https://github.com/jedwatson/classnames)
* [whatwg-fetch](https://github.com/github/whatwg-fetch)
* [es6-promise](https://github.com/stefanpenner/es6-promise)
