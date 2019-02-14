import React from 'react'
import { shallow, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import merge from 'lodash.merge'

import SlackIcon from './slack-icon'
import defaultTheme from './themes/default'
import SlackFeedback from './slack-feedback'

configure({ adapter: new Adapter() })

jsdom.reconfigure({ href: 'unit-test' }) // eslint-disable-line no-undef

const onSubmit = jest.fn()
const onImageUpload = jest.fn()
const onOpen = jest.fn()
const onClose = jest.fn()

const DEFAULT_PROPS = {
  user: 'unit-tester',
  emoji: ':party:',
  channel: '#tests',
  onSubmit,
  onImageUpload,
  onOpen,
  onClose
}

const render = props =>
  shallow(<SlackFeedback {...Object.assign({}, DEFAULT_PROPS, props)} />)

describe('SlackFeedback', () => {
  const component = render()
  const find = name => component.find(`styles__${name}`)

  const trigger = find('Trigger')
  const submit = find('SubmitButton')
  const checkbox = find('Checkbox')
  const textarea = component.find('[name="message"]')
  const close = component.find('.close')
  const tabs = find('Tabs').find('li')

  it('should match the snapshots', () => {
    expect(component).toMatchSnapshot()
    expect(render({ disabled: true })).toMatchSnapshot()
  })

  describe('exports', () => {
    it('the default theme should be exported as defaultTheme', () => {
      expect(SlackFeedback.defaultTheme).toEqual(defaultTheme)
    })
    it('the slack icon should be exported as SlackIcon', () => {
      expect(SlackFeedback.SlackIcon).toEqual(SlackIcon)
    })
  })

  describe('presentational', () => {
    it('should show the channel by default', () => {
      expect(component.find('#channel')).toHaveLength(1)
    })
    it('should not show the channel if showChannel is false', () => {
      component.setProps({ showChannel: false })
      expect(component.find('#channel')).toHaveLength(0)

      // Reset the value
      component.setProps({ showChannel: true })
    })
    it('should display nothing if disabled', () => {
      component.setProps({ disabled: true })
      expect(component.html()).toBe(null)

      // Reset the value
      component.setProps({ disabled: false })
    })
    it('should display the correct closeButton node', () => {
      const closeButton = <a>x</a>
      component.setProps({ closeButton })
      expect(component.find('.close').html()).toEqual(
        '<div class="close"><a>x</a></div>'
      )
    })
  })

  describe('open/close', () => {
    it('should be closed by default', () => {
      expect(component.state('active')).toBe(false)
    })

    it('should open when the trigger is clicked and fire this.props.onOpen', () => {
      component.setState({ active: false })
      trigger.simulate('click')
      expect(component.state('active')).toBeTruthy()
      expect(onOpen).toHaveBeenCalled()
    })

    it('should set the active state to false on close click', () => {
      component.setState({ active: true })
      close.simulate('click')
      expect(component.state('active')).toEqual(false)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe.skip('tabs', () => {
    const customTabs = [
      {
        value: 'unit',
        label: 'Unit'
      },
      {
        value: 'test',
        label: 'Test'
      }
    ]

    it('should select the first type by default', () => {
      expect(component.state('selectedType')).toEqual('Bug')
      component.setProps({
        feedbackTypes: customTabs,
        defaultSelectedType: null
      })
      expect(component.state('selectedType')).toEqual('Unit')
    })

    it('should select the correct tab', () => {
      component.setProps({
        feedbackTypes: customTabs,
        defaultSelectedType: 'Test'
      })
      expect(component.state('selectedType')).toEqual('Test')
    })
    it('should change the tab state on click', () => {
      tabs.first().simulate('click')
      expect(component.state('selectedType')).toBe(customTabs[0].label)

      tabs.second().simulate('click')
      expect(component.state('selectedType')).toBe(customTabs[1].label)
    })
    xit('should render the default tab options', () => {
      return Promise.reject()
    })
    xit('should render custom tab options', () => {
      return Promise.reject()
    })
  })

  describe('send', () => {
    it('should set the sending state to true', () => {
      expect(component.state('sending')).toBe(false)
      submit.simulate('click')
      expect(component.state('sending')).toBe(true)
    })
    it('should set the default log level to "warning"', () => {
      submit.simulate('click')
    })
    it('should return the correct payload', () => {
      onSubmit.mockReset()
      const message = 'test'
      component.setState({ sendURL: false })
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')

      expect(onSubmit).toHaveBeenCalledWith({
        channel: DEFAULT_PROPS.channel,
        username: DEFAULT_PROPS.user,
        icon_emoji: DEFAULT_PROPS.emoji,
        attachments: [
          {
            fallback: `Feedback (${component.state('selectedType')})`,
            author_name: DEFAULT_PROPS.user,
            color: 'danger',
            title: component.state('selectedType'),
            title_link: document.location.href,
            text: message,
            footer: 'React Slack Feedback'
          }
        ]
      })
      component.setState({ sendURL: true })
    })
  })

  describe('errors', () => {
    it('determineErrorType: should determine the correct error type', () => {
      const instance = component.instance()
      expect(instance.determineErrorType()).toEqual('Unexpected Error!')
      expect(instance.determineErrorType('error')).toEqual('error')
      expect(instance.determineErrorType({ status: 400 })).toEqual(
        'Bad Request!'
      )
    })
  })

  describe('theme', () => {
    const getTheme = () => component.find('ThemeProvider').props('theme').theme

    it('should have the default theme', () => {
      expect(getTheme()).toEqual(defaultTheme)
    })
    it('should deep merge a custom theme with the default', () => {
      const customTheme = {
        primary: 'blue',
        input: {
          color: 'red'
        }
      }

      component.setProps({
        theme: customTheme
      })

      const theme = getTheme()

      expect(theme.primary).toEqual(customTheme.primary)
      expect(theme.input.color).toEqual(customTheme.input.color)
      expect(theme).toEqual(merge({}, theme, customTheme))
    })
  })

  describe('sendURL', () => {
    it('should be true by default', () => {
      expect(component.state('sendURL')).toBeTruthy()
      expect(checkbox.props().checked).toBeTruthy()
    })
    it('should toggle the sendURL state when the checkbox or label are clicked', () => {
      expect(checkbox.props().checked).toBeTruthy()
      checkbox.props().onChange()
      expect(component.state('sendURL')).toBe(false)
    })
  })
})
