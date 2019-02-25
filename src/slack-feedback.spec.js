import React from 'react'
import { shallow } from 'enzyme'

import { default as SlackIcon } from './slack-icon'
import defaultTheme from './themes/default'
import SlackFeedback from './slack-feedback'
import translations from './translations'
import { merge } from './utils'

const __ = key => (key in translations ? translations[key] : key)

const DEFAULT_PROPS = {
  user: 'unit-tester',
  channel: '#tests',
  sentTimeout: 0
}

const render = props =>
  shallow(<SlackFeedback {...Object.assign({}, DEFAULT_PROPS, props)} />)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

describe('SlackFeedback', () => {
  let component
  let find
  let trigger
  let submit
  let textarea
  let close
  let onSubmit
  let onImageUpload
  let onOpen
  let onClose
  let defaultPropCallbacks

  beforeEach(() => {
    onSubmit = jest.fn()
    onImageUpload = jest.fn()
    onOpen = jest.fn()
    onClose = jest.fn()

    defaultPropCallbacks = {
      onSubmit,
      onImageUpload,
      onOpen,
      onClose
    }

    component = render({
      ...defaultPropCallbacks
    })

    find = name => component.find(`styles__${name}`)

    trigger = find('Trigger')
    submit = find('SubmitButton')
    textarea = component.find('[name="message"]')
    close = component.find('.close')
  })

  it('should match the snapshots', () => {
    expect(component).toMatchSnapshot()
    expect(
      render({ disabled: true, ...defaultPropCallbacks })
    ).toMatchSnapshot()
    expect(
      render({ showChannel: false, ...defaultPropCallbacks })
    ).toMatchSnapshot()
    expect(
      render({ showIcon: false, ...defaultPropCallbacks })
    ).toMatchSnapshot()
  })

  describe('exports', () => {
    it('the default theme should be exported as defaultTheme', () => {
      expect(SlackFeedback.defaultTheme).toEqual(defaultTheme)
    })
    it('the slack icon should be exported as SlackIcon', () => {
      expect(SlackFeedback.SlackIcon).toEqual(SlackIcon)
    })
  })

  describe('translations', () => {
    it('should return the correct value from the translations', () => {
      expect(component.instance().translate('submit.text')).toEqual(
        'Send Feedback'
      )
    })

    it('should return an empty string if not found', () => {
      expect(component.instance().translate('not.available')).toEqual('')
    })

    it('should return the correct value from a translation prop', () => {
      component.setProps({ translations: { 'trigger.text': 'Feedback' } })
      expect(component.instance().translate('trigger.text')).toEqual('Feedback')
    })

    it('should return default translations if translation prop is provided', () => {
      component.setProps({ translations: { 'trigger.text': 'Feedback' } })
      expect(component.instance().translate('submit.text')).toEqual(
        'Send Feedback'
      )
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
  })

  describe('open/close', () => {
    it('should be closed by default', () => {
      expect(component.state('open')).toBe(false)
    })

    it('should fire close if toggle on state.open', () => {
      component.setState({ open: true })
      component.instance().toggle()
      expect(onClose).toHaveBeenCalled()
    })

    it('should open when the trigger is clicked and fire this.props.onOpen', () => {
      component.setState({ open: false })
      trigger.simulate('click')
      expect(component.state('open')).toBeTruthy()
      expect(onOpen).toHaveBeenCalled()
    })

    it('should set the open state to false on close click', () => {
      component.setState({ open: true })
      close.simulate('click')
      expect(component.state('open')).toEqual(false)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('handleClickOutside', () => {
    it('should close if inside component', () => {
      component.setState({ open: true })
      close.simulate('click', {})
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('tabs', () => {
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
      expect(component.state('selectedType')).toEqual('bug')
    })

    it('should select the correct tab', () => {
      const newComponent = render({
        feedbackTypes: customTabs,
        defaultSelectedType: 'test',
        ...defaultPropCallbacks
      })
      expect(newComponent.state('selectedType')).toEqual('test')
    })
    it('should change the tab state on click', () => {
      const newComponent = render({
        feedbackTypes: customTabs,
        ...defaultPropCallbacks
      })

      expect(newComponent.state().selectedType).toBe(customTabs[0].value)

      newComponent
        .find('li')
        .at(1)
        .simulate('click')
      expect(newComponent.state().selectedType).toBe(customTabs[1].value)
    })
  })

  describe('onSubmit', () => {
    it('should set the sending state to true', () => {
      expect(component.state('sending')).toBe(false)
      submit.simulate('click')
      expect(component.state('sending')).toBe(true)
    })
    it('should set the default log level to "danger"', () => {
      submit.simulate('click')
      const payload = onSubmit.mock.calls[0][0]
      expect(payload.attachments[0].color).toEqual('danger')
    })

    it('should set the correct log level', () => {
      const nthPayload = n => onSubmit.mock.calls[n][0]

      component.setState({ selectedType: 'bug' })
      submit.simulate('click')
      expect(nthPayload(0).attachments[0].color).toEqual('danger')

      component.setState({ selectedType: 'feature' })
      submit.simulate('click')
      expect(nthPayload(1).attachments[0].color).toEqual('good')

      component.setState({ selectedType: 'improvement' })
      submit.simulate('click')
      expect(nthPayload(2).attachments[0].color).toEqual('warning')
    })

    it('should return warning level if selectedType invalid', () => {
      component.setState({ selectedType: 'invalid' })
      submit.simulate('click')
      const payload = onSubmit.mock.calls[0][0]
      expect(payload.attachments[0].color).toEqual('warning')
    })

    it('should return the correct payload', () => {
      const message = 'test'
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')

      const expectedPayload = {
        attachments: [
          {
            fallback: `Feedback (${component.state('selectedType')})`,
            author_name: DEFAULT_PROPS.user,
            color: 'danger',
            title: component.state('selectedType'),
            title_link: document.location.href,
            text: message,
            footer: __('footer.text')
          }
        ]
      }

      expect(onSubmit).toHaveBeenCalledWith(
        expectedPayload,
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('shuold attach image if available', () => {
      const message = 'test'
      textarea.simulate('change', { target: { value: message } })
      component.setState({ image: { url: 'fake-url' } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')

      const expectedPayload = {
        attachments: [
          {
            fallback: `Feedback (${component.state('selectedType')})`,
            author_name: DEFAULT_PROPS.user,
            color: 'danger',
            title: component.state('selectedType'),
            title_link: document.location.href,
            text: message,
            footer: __('footer.text'),
            image_url: 'fake-url'
          }
        ]
      }

      expect(onSubmit).toHaveBeenCalledWith(
        expectedPayload,
        expect.any(Function),
        expect.any(Function)
      )
    })

    it('should change sent state', () => {
      const message = 'test'
      onSubmit.mockImplementation((payload, success) => success())
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')
      expect(component.state().sent).toBeTruthy()
      expect(component.state().sending).toBeFalsy()
      expect(component.state().error).toBeFalsy()
    })

    it('should reset sent state on success', async () => {
      const message = 'test'
      component.setProps({ sentTimeout: 0 })
      onSubmit.mockImplementation((payload, success) => success())
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')
      expect(component.state().sent).toBeTruthy()
      await sleep(1)
      expect(component.state().sent).toBeFalsy()
    })

    it('should reset sent state on error', async () => {
      const message = 'test'
      component.setProps({ errorTimeout: 0 })
      onSubmit.mockImplementation((payload, success, error) =>
        error('test error')
      )
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')
      expect(component.state().sending).toBeFalsy()
      expect(component.state().error).toBe('test error')
      await sleep(1)
      expect(component.state().error).toBeNull()
    })

    it('should change error state', () => {
      const message = 'test'
      onSubmit.mockImplementation((payload, success, error) =>
        error('TEST_ERROR')
      )
      textarea.simulate('change', { target: { value: message } })
      expect(component.state('message')).toBe(message)
      submit.simulate('click')
      expect(component.state().sent).toBeFalsy()
      expect(component.state().sending).toBeFalsy()
      expect(component.state().error).toBe('TEST_ERROR')
    })
  })

  describe('errors', () => {
    it('determineErrorType: should determine the correct error type', () => {
      const instance = component.instance()
      expect(instance.determineErrorType()).toEqual(__('error.unexpected'))
      expect(instance.determineErrorType('error')).toEqual('error')
      expect(instance.determineErrorType({ status: 400 })).toEqual(
        __('error.badrequest')
      )
      expect(instance.determineErrorType({ status: 403 })).toEqual(
        __('error.forbidden')
      )
      expect(instance.determineErrorType({ status: 404 })).toEqual(
        __('error.notfound')
      )
      expect(instance.determineErrorType({ status: 410 })).toEqual(
        __('error.archived')
      )
      expect(instance.determineErrorType({ status: 500 })).toEqual(
        __('error.internal')
      )
      expect(instance.determineErrorType({ status: 100000 })).toEqual(
        __('error.unexpected')
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
})
