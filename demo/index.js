/* eslint-disable import/no-unassigned-import */
import React from 'react'
import ReactDOM from 'react-dom'
import fetch from 'isomorphic-fetch'
import styled from 'styled-components'

import SyntaxHighlighter, {
  registerLanguage
} from 'react-syntax-highlighter/dist/prism-light'
import jsx from 'react-syntax-highlighter/dist/languages/prism/jsx'
import json from 'react-syntax-highlighter/dist/languages/prism/json'
import syntax from 'react-syntax-highlighter/dist/styles/prism/atom-dark'

import SlackFeedback from '../src/slack-feedback'
import defaultTheme from '../src/themes/default'
import darkTheme from '../src/themes/dark'

import { version } from '../package'

import './index.css'

registerLanguage('json', json)
registerLanguage('jsx', jsx)

const themes = {
  default: defaultTheme,
  dark: darkTheme
}

const root = document.querySelector('#root')

const parseJSON = res => res.json()

const API_URL = 'http://localhost:8080/api'

const sendToSlack = (payload, success, error) => {
  if (process.env.USE_SERVER) {
    return success()
  }

  return fetch(`${API_URL}/slack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) {
        error(res)
        throw res
      }

      return res
    })
    .then(parseJSON)
    .then(success)
}

function uploadImage(file, success, error) {
  if (process.env.USE_SERVER) {
    return success(file.preview)
  }

  const form = new FormData()
  form.append('image', file)

  fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: form
  })
    .then(res => {
      if (res.status < 200 || res.status >= 300) {
        error(res.statusText)
        throw res
      }

      return res.json()
    })
    .then(({ url }) => success(url))
}

const Button = styled.button`
  border-radius: 4px;
  outline: none;
  font-size: 15px;
  padding: 1em 2em;
  background: white;
  margin-right: 1em;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2em;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  border: 2px solid ${p => (p.selected ? '#0087ff' : 'transparent')};

  &:hover {
    box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.1);
  }
`

const App = () => {
  const [theme, setTheme] = React.useState('default')

  return (
    <div>
      <h1>React Slack Feedback</h1>
      <p>Latest: {version}</p>

      <h3>Choose theme</h3>

      <Button
        selected={theme === 'default'}
        onClick={() => setTheme('default')}
      >
        Default
      </Button>
      <Button selected={theme === 'dark'} onClick={() => setTheme('dark')}>
        Dark
      </Button>

      <h3>Usage</h3>
      <h5>Install module + peer dependencies</h5>

      <SyntaxHighlighter language="jsx" style={syntax}>
        {`yarn add react-slack-feedback styled-components`}
      </SyntaxHighlighter>

      <SyntaxHighlighter language="jsx" style={syntax}>
        {`import SlackFeedback from 'react-slack-feedback'
        
<SlackFeedback
  open
  channel="#feedback"
  disabled={false}
  errorTimeout={8 * 1000}
  icon={() => <SlackIcon />}
  onClose={() => {}}
  onOpen={() => {}}
  sentTimeout={5 * 1000}
  showChannel={true}
  showIcon={true}
  theme={defaultTheme}
  translations={defaultTranslations}
  user="Anonymous"
  onSubmit={(payload, success, error) => {}}
  onImageUpload={(file, success, error) => {}}
/>`}
      </SyntaxHighlighter>

      <h5>CURRENT THEME</h5>

      <SyntaxHighlighter language="json" style={syntax}>
        {JSON.stringify(themes[theme], null, 2)}
      </SyntaxHighlighter>

      <SlackFeedback
        open
        theme={themes[theme]}
        channel="#feedback"
        onSubmit={(payload, success, error) =>
          sendToSlack(payload, success, error)
        }
        onImageUpload={(file, success, error) =>
          uploadImage(file, success, error)
        }
      />
    </div>
  )
}
ReactDOM.render(<App />, root)
