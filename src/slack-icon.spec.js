import React from 'react'
import { shallow } from 'enzyme'
import { SlackIcon } from './slack-icon'

const defaultProps = {}

const render = (props = {}) =>
  shallow(<SlackIcon {...Object.assign({}, defaultProps, props)} />)

describe('SlackIcon', () => {
  it('should match snapshots', () => {
    expect(render()).toMatchSnapshot()
  })
})
